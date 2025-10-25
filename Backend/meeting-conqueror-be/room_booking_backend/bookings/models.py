from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone


class Room(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    description = models.TextField(blank=True)
    amenities = models.TextField(blank=True, help_text="Comma-separated amenities")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_blocked = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} (Capacity: {self.capacity})"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    purpose = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['room', 'start_time']),
            models.Index(fields=['start_time', 'end_time']),
        ]

    def __str__(self):
        return f"{self.room.name} - {self.user_name} ({self.start_time.strftime('%Y-%m-%d %H:%M')})"

    def clean(self):
        """Custom validation to prevent invalid or overlapping bookings."""
        if self.start_time >= self.end_time:
            raise ValidationError('End time must be after start time.')

        if self.start_time < timezone.now():
            raise ValidationError('Cannot book a room in the past.')

        # Check for overlapping bookings for the same room
        overlapping = Booking.objects.filter(
            room=self.room,
            status__in=['pending', 'confirmed']
        ).exclude(id=self.id).filter(
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        )

        if overlapping.exists():
            raise ValidationError('This time slot is already booked.')

    def save(self, *args, **kwargs):
        """Ensure validations run on every save."""
        self.clean()
        super().save(*args, **kwargs)

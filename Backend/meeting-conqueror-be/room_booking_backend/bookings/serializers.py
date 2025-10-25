from rest_framework import serializers
from .models import Room, Booking
from django.utils import timezone


class RoomSerializer(serializers.ModelSerializer):
    """Serialize Room details."""
    class Meta:
        model = Room
        fields = ['id', 'name', 'capacity', 'description', 'amenities', 'is_active', 'created_at', 'is_blocked']


class BookingSerializer(serializers.ModelSerializer):
    """Serialize Booking details with room info."""
    room_name = serializers.CharField(source='room.name', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'room', 'room_name', 'user_name', 'user_email',
            'start_time', 'end_time', 'purpose', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

    def validate(self, data):
        """Extra validation before saving a booking."""
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError('End time must be after start time.')

        if data['start_time'] < timezone.now():
            raise serializers.ValidationError('Cannot book a room in the past.')

        # Prevent overlapping bookings
        room = data['room']
        overlapping = Booking.objects.filter(
            room=room,
            status__in=['pending', 'confirmed']
        ).filter(
            start_time__lt=data['end_time'],
            end_time__gt=data['start_time']
        )

        # Exclude current record when updating
        if self.instance:
            overlapping = overlapping.exclude(id=self.instance.id)

        if overlapping.exists():
            raise serializers.ValidationError('This time slot is already booked.')

        return data

from django.contrib import admin
from .models import Room, Booking


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("name", "capacity", "is_active", "created_at")
    search_fields = ("name", "description", "amenities")
    list_filter = ("is_active", "capacity")
    ordering = ("name",)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "room",
        "user_name",
        "user_email",
        "start_time",
        "end_time",
        "status",
    )
    search_fields = ("user_name", "user_email", "room__name")
    list_filter = ("status", "room", "start_time")
    ordering = ("-start_time",)

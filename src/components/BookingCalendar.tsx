import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, addHours, setHours, setMinutes, startOfDay } from "date-fns";
import { Clock } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
}

interface BookingCalendarProps {
  roomId: string;
  onTimeSelect?: (start: Date, end: Date) => void;
}

export const BookingCalendar = ({ roomId, onTimeSelect }: BookingCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const formattedDate = format(date, "yyyy-MM-dd");
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/bookings/?room_id=${roomId}&date=${formattedDate}`
        );
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data.results || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [roomId, date]);

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const start = setMinutes(setHours(date, 9 + i), 0);
    const end = addHours(start, 1);
    return { start, end };
  });

  const isSlotBooked = (slotStart: Date, slotEnd: Date) =>
    bookings.some((b) => {
      const bookingStart = new Date(b.start_time);
      const bookingEnd = new Date(b.end_time);
      return (
        (slotStart >= bookingStart && slotStart < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (slotStart <= bookingStart && slotEnd >= bookingEnd)
      );
    });

  const handleSlotClick = (slot: { start: Date; end: Date }) => {
    if (!isSlotBooked(slot.start, slot.end)) {
      setSelectedSlot(slot);
      onTimeSelect?.(slot.start, slot.end);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && setDate(d)}
          disabled={(d) => d < startOfDay(new Date())}
          className="rounded-md border"
        />
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Available Times - {format(date, "MMM dd, yyyy")}
        </h3>
        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
          {timeSlots.map((slot) => {
            const isBooked = isSlotBooked(slot.start, slot.end);
            const isSelected = selectedSlot?.start.getTime() === slot.start.getTime();
            return (
              <Button
                key={slot.start.toISOString()}
                variant={isSelected ? "default" : isBooked ? "secondary" : "outline"}
                disabled={isBooked}
                onClick={() => handleSlotClick(slot)}
                className="h-auto py-3 flex flex-col items-center justify-center"
              >
                <Clock className="w-4 h-4 mb-1" />
                <span className="text-xs">
                  {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                </span>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

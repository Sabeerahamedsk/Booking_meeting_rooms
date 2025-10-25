import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingCalendar } from "@/components/BookingCalendar";
import { toast } from "sonner";
import { ArrowLeft, Users } from "lucide-react";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  image_url: string;
}

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTime, setSelectedTime] = useState<{ start: Date; end: Date } | null>(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   supabase.auth.getUser().then(({ data: { user } }) => {
  //     if (!user) {
  //       navigate("/auth");
  //     } else {
  //       setUser(user);
  //     }
  //   });

  //   if (roomId) {
  //     fetchRoom();
  //   }
  // }, [roomId, navigate]);

  // const fetchRoom = async () => {
  //   const { data } = await supabase
  //     .from("rooms")
  //     .select("*")
  //     .eq("id", roomId)
  //     .single();

  //   if (data) setRoom(data);
  // };

  // const handleBooking = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedTime || !user) return;

  //   setLoading(true);
  //   try {
  //     const { error } = await supabase.from("bookings").insert({
  //       room_id: roomId,
  //       user_id: user.id,
  //       title,
  //       description,
  //       start_time: selectedTime.start.toISOString(),
  //       end_time: selectedTime.end.toISOString(),
  //     });

  //     if (error) throw error;

  //     toast.success("Room booked successfully!");
  //     navigate("/");
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (!room) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={"/placeholder.svg"}
              alt="test"
              className="w-full h-[300px] object-cover rounded-lg shadow-[var(--shadow-elegant)]"
            />
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-3xl">Test</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Users className="w-5 h-5" />
                  <span>Capacity: 21 people</span>
                </div>
                <p className="text-foreground">Test</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Book This Room</CardTitle>
            </CardHeader>
            <CardContent>
              <form  className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Team Standup"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the meeting"
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !selectedTime}
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <BookingCalendar
          roomId={roomId!}
          onTimeSelect={(start, end) => setSelectedTime({ start, end })}
        />
      </div>
    </div>
  );
};

export default RoomDetail;

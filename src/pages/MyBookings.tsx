// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { ArrowLeft, Calendar, Clock, MapPin, Trash2 } from "lucide-react";
// import { format } from "date-fns";

// interface Booking {
//   id: string;
//   title: string;
//   description: string | null;
//   start_time: string;
//   end_time: string;
//   rooms: {
//     name: string;
//     capacity: number;
//   };
// }

// const MyBookings = () => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       if (!user) {
//         navigate("/auth");
//       } else {
//         fetchBookings();
//       }
//     });
//   }, [navigate]);

//   const fetchBookings = async () => {
//     setLoading(true);
//     // const { data: { user } } = await supabase.auth.getUser();
//     await fetch(`http://127.0.0.1:8000/api/bookings`)
    
//     if (!user) return;

//     const { data } = await supabase
//       .from("bookings")
//       .select(`
//         id,
//         title,
//         description,
//         start_time,
//         end_time,
//         rooms (
//           name,
//           capacity
//         )
//       `)
//       .eq("user_id", user.id)
//       .gte("end_time", new Date().toISOString())
//       .order("start_time", { ascending: true });

//     if (data) {
//       setBookings(data as any);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (bookingId: string) => {
//     const { error } = await supabase
//       .from("bookings")
//       .delete()
//       .eq("id", bookingId);

//     if (error) {
//       toast.error("Failed to cancel booking");
//     } else {
//       toast.success("Booking cancelled successfully");
//       fetchBookings();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
//       <div className="container mx-auto px-4 py-8">
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/")}
//           className="mb-6"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Rooms
//         </Button>

//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
//           <p className="text-muted-foreground">
//             View and manage your upcoming meeting room reservations
//           </p>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">Loading...</div>
//         ) : bookings.length === 0 ? (
//           <Card>
//             <CardContent className="text-center py-12">
//               <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
//               <p className="text-lg text-muted-foreground">No upcoming bookings</p>
//               <Button onClick={() => navigate("/")} className="mt-4">
//                 Book a Room
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {bookings.map((booking) => (
//               <Card key={booking.id} className="hover:shadow-[var(--shadow-elegant)] transition-shadow">
//                 <CardHeader>
//                   <CardTitle className="flex items-center justify-between">
//                     <span className="truncate">{booking.title}</span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleDelete(booking.id)}
//                       className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </CardTitle>
//                   {booking.description && (
//                     <CardDescription>{booking.description}</CardDescription>
//                   )}
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <MapPin className="w-4 h-4 text-primary" />
//                     <span className="font-medium">{booking.rooms.name}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Calendar className="w-4 h-4" />
//                     <span>{format(new Date(booking.start_time), "MMM dd, yyyy")}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Clock className="w-4 h-4" />
//                     <span>
//                       {format(new Date(booking.start_time), "HH:mm")} -{" "}
//                       {format(new Date(booking.end_time), "HH:mm")}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyBookings;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  room: {
    name: string;
    capacity: number;
  };
}

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must log in first!");
      navigate("/auth");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookings/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(
        data.results.map((b: any) => ({
          id: b.id,
          title: b.title,
          description: b.description,
          start_time: b.start_time,
          end_time: b.end_time,
          room: b.room, // adjust if your API returns differently
        }))
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to cancel booking");

      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your upcoming meeting room reservations
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No upcoming bookings</p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Book a Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{booking.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(booking.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  {booking.description && (
                    <CardDescription>{booking.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">{booking.room.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(booking.start_time), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(booking.start_time), "HH:mm")} -{" "}
                      {format(new Date(booking.end_time), "HH:mm")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

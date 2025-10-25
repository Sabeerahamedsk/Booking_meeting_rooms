// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "sonner";
// // import { Button } from "@/components/ui/button";
// // import { RoomCard } from "@/components/RoomCard";
// // import { LogOut, Calendar, User } from "lucide-react";
// // import heroImage from "@/assets/meeting-room-hero.jpg";
// // import snipperImage from "@/assets/room-snipper.jpg";
// // import assassinImage from "@/assets/room-assassin.jpg";
// // import unchartedImage from "@/assets/room-uncharted.jpg";

// // interface Room {
// //   id: string;
// //   name: string;
// //   capacity: number;
// //   description: string;
// //   image_url: string | null;
// // }

// // const Index = () => {
// //   const navigate = useNavigate();
// //   const [rooms, setRooms] = useState<Room[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       toast.error("Please log in first");
// //       navigate("/auth");
// //       return;
// //     }
// //     fetchRooms(token);
// //   }, [navigate]);

// //   const fetchRooms = async (token: string) => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch("http://127.0.0.1:8000/api/rooms/", {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Token ${token}`, // Django DRF token auth
// //         },
// //       });

// //       if (!response.ok) {
// //         const data = await response.json();
// //         throw new Error(data.detail || "Failed to fetch rooms");
// //       }

// //       const data = await response.json();
// //       const roomImages: { [key: string]: string } = {
// //         Snipper: snipperImage,
// //         Assassin: assassinImage,
// //         Uncharted: unchartedImage,
// //       };

// //       const roomsWithImages = data.results.map((room: any) => ({
// //         ...room,
// //         image_url: roomImages[room.name] || room.image_url,
// //       }));

// //       setRooms(roomsWithImages);
// //     } catch (err: any) {
// //       console.error(err);
// //       toast.error(err.message || "Failed to fetch rooms");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSignOut = () => {
// //     localStorage.removeItem("token");
// //     toast.success("Signed out successfully");
// //     navigate("/auth");
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
// //       {/* Hero Section */}
// //       <div className="relative h-[400px] overflow-hidden">
// //         <img
// //           src={heroImage}
// //           alt="Meeting rooms"
// //           className="w-full h-full object-cover"
// //         />
// //         <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
// //           <div className="container mx-auto px-4">
// //             <div className="max-w-2xl text-white">
// //               <h1 className="text-5xl font-bold mb-4">Meeting Room Booking</h1>
// //               <p className="text-xl mb-6 text-white/90">
// //                 Book your perfect meeting space in seconds. Available rooms: Snipper, Assassin, and Uncharted.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Navigation Bar */}
// //       <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-[var(--shadow-soft)]">
// //         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
// //           <div className="flex items-center gap-2">
// //             <Calendar className="w-6 h-6 text-primary" />
// //             <span className="font-semibold text-lg">Room Booking</span>
// //           </div>
// //           <div className="flex items-center gap-4">
// //             <Button variant="ghost" onClick={() => navigate("/my-bookings")} className="gap-2">
// //               <User className="w-4 h-4" /> My Bookings
// //             </Button>
// //             <Button variant="ghost" onClick={handleSignOut} className="gap-2">
// //               <LogOut className="w-4 h-4" /> Sign Out
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Rooms Grid */}
// //       <div className="container mx-auto px-4 py-12">
// //         <div className="mb-8">
// //           <h2 className="text-3xl font-bold mb-2">Available Meeting Rooms</h2>
// //           <p className="text-muted-foreground">
// //             Select a room to view availability and make a booking
// //           </p>
// //         </div>
// //         {loading ? (
// //           <p>Loading rooms...</p>
// //         ) : (
// //           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {rooms.map((room) => (
// //               <RoomCard
// //                 key={room.id}
// //                 id={room.id}
// //                 name={room.name}
// //                 capacity={room.capacity}
// //                 description={room.description || ""}
// //                 imageUrl={room.image_url || "/placeholder.svg"}
// //               />
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Index;

// // Index.tsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { RoomCard } from "@/components/RoomCard";
// import { LogOut, Calendar, User } from "lucide-react";
// import { toast } from "sonner";

// interface Room {
//   id: string;
//   name: string;
//   capacity: number;
//   description: string;
//   image_url: string | null;
//   isBlocked: boolean;
// }

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// const Index = () => {
//   const navigate = useNavigate();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState<string | null>(null);

//   // Check token on mount
//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (!savedToken) {
//       navigate("/auth");
//     } else {
//       setToken(savedToken);
//       fetchRooms(savedToken);
//     }
//   }, [navigate]);

//   // Fetch rooms with Django token
//   const fetchRooms = async (token: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/rooms/`, {
//         headers: { Authorization: `Token ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch rooms");
//       const data = await res.json();
//       const mappedRooms = data.results.map((room: any) => ({
//         id: room.id,
//         name: room.name,
//         capacity: room.capacity,
//         description: room.description,
//         image_url: room.image || "/placeholder.svg",
//         isBlocked: room.is_blocked || false,
//       }));
//       setRooms(mappedRooms);
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookRoom = (roomId: string) => {
//     if (!token) {
//       navigate("/auth");
//     } else {
//       navigate(`/book-room/${roomId}`);
//     }
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem("token");
//     toast.success("Signed out successfully");
//     navigate("/auth");
//   };

//   if (!token) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
//       <div className="container mx-auto px-4 py-12">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Available Rooms</h1>
//           <div className="flex gap-4">
//             <Button variant="ghost" onClick={() => navigate("/my-bookings")}>
//               <User className="w-4 h-4" /> My Bookings
//             </Button>
//             <Button variant="ghost" onClick={handleSignOut}>
//               <LogOut className="w-4 h-4" /> Sign Out
//             </Button>
//           </div>
//         </div>

//         {loading ? (
//           <div>Loading rooms...</div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {rooms.map((room) => (
//               <RoomCard
//                 key={room.id}
//                 id={room.id}
//                 name={room.name}
//                 capacity={room.capacity}
//                 description={room.description || ""}
//                 imageUrl={room.image_url || "/placeholder.svg"}
//                 isBlocked={room.isBlocked}
//                 onClick={() => {if (!room.isBlocked) onSelectRoom(room.id);}}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Index;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/RoomCard";
import { Calendar, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/meeting-room-hero.jpg";
import snipperImage from "@/assets/room-snipper.jpg";
import assassinImage from "@/assets/room-assassin.jpg";
import unchartedImage from "@/assets/room-uncharted.jpg";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imageUrl: string;
  isBlocked: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/rooms/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to fetch rooms");
      }

      const data = await res.json();

      // Map backend data to Room objects
      const roomImages: { [key: string]: string } = {
        Snipper: snipperImage,
        Assassin: assassinImage,
        Uncharted: unchartedImage,
      };

      const mappedRooms: Room[] = data.results.map((room: any) => ({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        description: room.description || "",
        imageUrl: roomImages[room.name] || room.image || "/placeholder.svg",
        isBlocked: room.is_blocked || false,
      }));

      setRooms(mappedRooms);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = (roomId: string) => {
    navigate(`/book/${roomId}`);
  };

  if (loading) return <div className="text-center py-12">Loading rooms...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={heroImage} alt="Meeting rooms" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-4">Meeting Room Booking</h1>
              <p className="text-xl mb-6 text-white/90">
                Book your perfect meeting space in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">Room Booking</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/my-bookings")} className="gap-2">
              <User className="w-4 h-4" />
              My Bookings
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("token");
                toast.success("Signed out successfully");
                navigate("/auth");
              }}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Available Meeting Rooms</h2>
          <p className="text-muted-foreground">
            Select a room to view availability and make a booking
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              capacity={room.capacity}
              description={room.description}
              imageUrl={room.imageUrl}
              isBlocked={room.isBlocked}
              onClick={() => !room.isBlocked && handleSelectRoom(room.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

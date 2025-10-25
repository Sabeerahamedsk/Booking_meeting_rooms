// import { useState } from "react";
// import { RoomList } from "./RoomList";
// import { BookingCalendar } from "./BookingCalendar";
// import { toast } from "sonner";


// export default function BookingPage() {
//   const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

//   return (
//     <div className="p-8">
//       {!selectedRoomId ? (
//         <RoomList onSelectRoom={setSelectedRoomId} />
//       ) : (
//         <BookingCalendar
//           roomId={selectedRoomId}
//           onTimeSelect={(start, end) =>
//             console.log("Selected slot:", start, end)
//           }
//         />
//       )}
//     </div>
//   );
// }

// const createBooking = async (roomId: string, start: string, end: string) => {
//   const token = localStorage.getItem("token");
//   if (!token) return toast.error("Login first");

//   try {
//     const response = await fetch("http://127.0.0.1:8000/api/bookings/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Token ${token}`,
//       },
//       body: JSON.stringify({
//         room: roomId,
//         start_time: start,
//         end_time: end,
//       }),
//     });

//     if (!response.ok) {
//       const data = await response.json();
//       throw new Error(data.detail || "Failed to create booking");
//     }

//     toast.success("Booking created successfully!");
//   } catch (err: any) {
//     toast.error(err.message);
//   }
// };

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BookingCalendar } from "./BookingCalendar";
import { RoomList } from "./RoomList";

export default function BookingPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/rooms/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch rooms");
        const data = await response.json();
        setRooms(data.results);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="p-8">
      {!selectedRoomId ? (
        <RoomList onSelectRoom={setSelectedRoomId} />
      ) : (
        <BookingCalendar
          roomId={selectedRoomId}
          onTimeSelect={(start, end) =>
            console.log("Selected slot:", start, end)
          }
        />
      )}
    </div>
  );
}

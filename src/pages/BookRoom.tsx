
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// const BookRoom: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     user_name: "",
//     user_email: "",
//     start_time: "",
//     end_time: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const bookingData = {
//       room: id,
//       user_name: formData.user_name,
//       user_email: formData.user_email,
//       start_time: formData.start_time,
//       end_time: formData.end_time,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/bookings/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bookingData),
//       });

//       if (response.ok) {
//         alert("Room booked successfully!");
//         navigate("/");
//       } else {
//         const errorData = await response.json();
//         console.error("Booking failed:", errorData);
//         alert("Booking failed. Check console for details.");
//       }
//     } catch (error) {
//       console.error("Error booking room:", error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-center">Book This Room</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="user_name"
//           placeholder="Your Name"
//           value={formData.user_name}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           name="user_email"
//           type="email"
//           placeholder="Your Email"
//           value={formData.user_email}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           name="start_time"
//           type="datetime-local"
//           value={formData.start_time}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           name="end_time"
//           type="datetime-local"
//           value={formData.end_time}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Confirm Booking
//         </button>
//       </form>
//     </div>
//   );
// };

// export default BookRoom;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  is_blocked: boolean;
}

const BookRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    start_time: "",
    end_time: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();
        setRoom(data);

        if (data.is_blocked) {
          toast.error("This room is currently blocked!");
          navigate("/");
        }
      } catch (err: any) {
        toast.error(err.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication required");
      navigate("/auth");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // ✅ Django token
        },
        body: JSON.stringify({
          room: id,
          user_name: formData.user_name,
          user_email: formData.user_email,
          start_time: formData.start_time,
          end_time: formData.end_time,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.detail ||
            JSON.stringify(errorData) ||
            "Failed to book room"
        );
      }

      toast.success("Room booked successfully!");
      navigate("/my-bookings");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading room...</div>;
  if (!room) return <div className="p-8 text-center">Room not found</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Book Room: {room.name}
      </h2>
      <p className="text-sm mb-2">{room.description}</p>
      <p className="text-sm mb-4 font-medium">Capacity: {room.capacity}</p>

      <form onSubmit={handleBook} className="space-y-4">
        <input
          name="user_name"
          placeholder="Your Name"
          value={formData.user_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="user_email"
          type="email"
          placeholder="Your Email"
          value={formData.user_email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="start_time"
          type="datetime-local"
          value={formData.start_time}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="end_time"
          type="datetime-local"
          value={formData.end_time}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <Button type="submit" className="w-full" disabled={room.is_blocked}>
          {room.is_blocked ? "Blocked" : "Confirm Booking"}
        </Button>
      </form>
    </div>
  );
};

export default BookRoom;


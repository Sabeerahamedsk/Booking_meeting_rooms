
import { useEffect, useState } from "react";
import { RoomCard } from "./RoomCard";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imageUrl: string;
  isBlocked: boolean;
}

interface RoomListProps {
  onSelectRoom: (id: string) => void;
}

export const RoomList = ({ onSelectRoom }: RoomListProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/rooms/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Token ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();

      const mappedRooms: Room[] = data.results.map((room: any) => ({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        description: room.description,
        imageUrl: room.image || "https://via.placeholder.com/300",
        isBlocked: room.is_blocked || false,
      }));

      setRooms(mappedRooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          {...room}
          onClick={() => !room.isBlocked && onSelectRoom(room.id)}
        />
      ))}
    </div>
  );
};

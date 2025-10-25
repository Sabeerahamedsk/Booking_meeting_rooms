
// import React from "react";

// const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django backend

// interface RoomCardProps {
//   id: string;
//   name: string;
//   capacity: number;
//   description: string;
//   imageUrl: string;
//   isBlocked: boolean;
//   onClick: () => void;
// }

// export const RoomCard: React.FC<RoomCardProps> = ({
//   name,
//   capacity,
//   description,
//   imageUrl,
//   isBlocked,
//   onClick,
// }) => {
//   return (
//     <div
//       onClick={!isBlocked ? onClick : undefined}
//       className={`relative rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
//         isBlocked ? "opacity-50 cursor-not-allowed" : "opacity-100"
//       }`}
//     >
//       <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
//       {isBlocked && (
//         <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//           <span className="text-white font-bold text-lg bg-red-600 px-3 py-1 rounded">
//             Blocked
//           </span>
//         </div>
//       )}
//       <div className="p-4 bg-white">
//         <h3 className="text-xl font-semibold">{name}</h3>
//         <p className="text-sm text-muted-foreground">{description}</p>
//         <p className="text-sm font-medium mt-2">Capacity: {capacity}</p>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imageUrl: string;
  isBlocked: boolean;
  onClick?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  capacity,
  description,
  imageUrl,
  isBlocked,
}) => {
  const navigate = useNavigate();

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent parent click
    if (!isBlocked) {
      navigate(`/book-room/${id}`);
    }
  };

  return (
    <div
      className={`relative rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
        isBlocked ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"
      }`}
    >
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />

      {isBlocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white font-bold text-lg bg-red-600 px-3 py-1 rounded">
            Blocked
          </span>
        </div>
      )}

      <div className="p-4 bg-white">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm font-medium mt-2">Capacity: {capacity}</p>

        <Button
          className="mt-3 w-full"
          disabled={isBlocked}
          onClick={handleBookClick}
        >
          {isBlocked ? "Blocked" : "Book Room"}
        </Button>
      </div>
    </div>
  );
};

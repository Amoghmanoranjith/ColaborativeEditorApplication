import React from 'react';
import './MyRooms.css';

interface Room {
  id: number;
  name: string;
}

interface MyRoomsProps {
  rooms: Room[];
}

const MyRooms: React.FC<MyRoomsProps> = ({ rooms }) => {
  const handleJoinRoom = (roomName: string) => {
    alert(`Joining ${roomName}`);
  };

  return (
    <div className="my-rooms-container">
      <h2>My Rooms</h2>
      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room.id} className="room-card">
            <span>{room.name}</span>
            <button onClick={() => handleJoinRoom(room.name)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRooms;

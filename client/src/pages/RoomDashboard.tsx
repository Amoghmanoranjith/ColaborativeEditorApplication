import React from 'react';
import CreateRoom from '../components/CreateRoom';
import MyRooms from '../components/MyRooms';
import './RoomDashboard.css';

const RoomDashboard: React.FC = () => {
  const rooms = [
    { id: 1, name: 'Room A' },
    { id: 2, name: 'Room B' },
    { id: 3, name: 'Room C' },
    { id: 4, name: 'Room D' },
    { id: 5, name: 'Room E' },
    { id: 6, name: 'Room F' },
    { id: 7, name: 'Room G' },
    { id: 1, name: 'Room A' },
    { id: 2, name: 'Room B' },
    { id: 3, name: 'Room C' },
    { id: 4, name: 'Room D' },
    { id: 5, name: 'Room E' },
    { id: 6, name: 'Room F' },
    { id: 7, name: 'Room G' },
  ];

  return (
    <>
      <aside className="sidebar">
        <MyRooms rooms={rooms} />
      </aside>

      <div className="create-room-wrapper">
        <CreateRoom />
      </div>
    </>

  );
};

export default RoomDashboard;

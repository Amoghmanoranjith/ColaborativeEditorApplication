import React, { useState } from 'react';
import './CreateRoom.css';

const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:8081/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomName }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create room');
      }

      setSuccessMsg('Room created successfully!');
      setRoomName('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="create-room-container">
      <h3>Create Room</h3>
      <form onSubmit={handleCreateRoom}>
        <div className="form-group">
          <label>Room Name</label><br />
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-msg">{error}</div>}
        {successMsg && <div className="success-msg">{successMsg}</div>}
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "@y/websocket-server/utils";
import cors from "cors"
// Setup express app
const app = express();
app.use(express.json()); // middleware to parse JSON body
app.use(cors())
// Create HTTP server from express app
const server = http.createServer(app);
 
// In-memory store for room data
const roomData = new Map();
/*
Structure:
roomName: {
  admin: string,
  language_id: number,
}
*/
 
// Create room endpoint
app.post('/create-room', (req, res) => {
  const { roomName, admin, language_id } = req.body;
  console.log(roomName, admin, language_id);
  if (!roomName || !admin || typeof language_id !== 'number') {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (roomData.has(roomName)) {
    return res.status(409).json({ error: "Room already exists." });
  }
  roomData.set(roomName, {
    admin,
    language_id,
  });
  console.log(roomData);
  return res.status(201).json({ message: "Room created successfully." });
});

// Optional: get room info
app.get('/join-room/:roomName', (req, res) => {
  const roomName = req.params.roomName;
  const roomMeta = roomData.get(roomName);
  if (!roomMeta) return res.status(404).json({ error: "Room not found." });
  res.status(200).json({...roomMeta});
});

const wss = new WebSocketServer({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req, { gc: true });
});

// Start server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 HTTP & WebSocket server running at http://localhost:${PORT}`);
});

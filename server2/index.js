import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "@y/websocket-server/utils";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

const roomData = new Map();
const roomConnections = new Map(); // track active WebSocket connections per room

// Create room endpoint
app.post('/create-room', (req, res) => {
  const { roomName, admin, language_id } = req.body;
  if (!roomName || !admin || typeof language_id !== 'number') {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (roomData.has(roomName)) {
    return res.status(409).json({ error: "Room already exists." });
  }
  roomData.set(roomName, { admin, language_id });
  console.log(`Room created: ${roomName}`, roomData);
  return res.status(201).json({ message: "Room created successfully." });
});

// Get room info + connected client count
app.get('/join-room/:roomName', (req, res) => {
  const roomName = req.params.roomName;
  const roomMeta = roomData.get(roomName);
  if (!roomMeta) return res.status(404).json({ error: "Room not found." });

  const connectedClients = roomConnections.get(roomName)?.size || 0;

  res.status(200).json({
    ...roomMeta,
    connectedClients
  });
});

// Compile endpoint
app.post('/compile', async (req, res) => {
  try {
    const { language_id, source_code, stdin } = req.body;
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: 'true', wait: 'false', fields: '*' },
      headers: {
        'x-rapidapi-key': 'YOUR_API_KEY',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: { language_id, source_code, stdin }
    };
    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Compilation error:", error);
    res.status(500).json({ error: "Compilation failed" });
  }
});

// Status endpoint
app.post('/status', async (req, res) => {
  try {
    const { token } = req.body;
    const options = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'x-rapidapi-key': 'YOUR_API_KEY',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      }
    };
    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Status fetch error:", error);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (conn, req) => {
  const ip = req.socket.remoteAddress;
  const roomName = req.url.slice(1); // assume URL format is /roomName
  console.log(`✅ New WebSocket connection from ${ip} to room ${roomName} at ${new Date().toISOString()}`);

  // Track connections per room
  if (!roomConnections.has(roomName)) roomConnections.set(roomName, new Set());
  roomConnections.get(roomName).add(conn);

  // Remove connection on close
  conn.on("close", () => {
    roomConnections.get(roomName)?.delete(conn);
    console.log(`❌ Connection from ${ip} disconnected. Room ${roomName} active connections: ${roomConnections.get(roomName)?.size}`);
  });

  setupWSConnection(conn, req, { gc: true });
});

// Start server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 HTTP & WebSocket server running at http://localhost:${PORT}`);
});

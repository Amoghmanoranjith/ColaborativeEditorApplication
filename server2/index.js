import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "@y/websocket-server/utils";
import cors from "cors"
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(cors())
const server = http.createServer(app);

const roomData = new Map();


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
  res.status(200).json({ ...roomMeta });
});

app.post('/compile', async (req, res) => {
  try {
    const { language_id, source_code, stdin } = req.body;
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'true',
        wait: 'false',
        fields: '*'
      },
      headers: {
        'x-rapidapi-key': '3c80a113c8mshb48590a41fe6e12p14f11fjsn3e5e0f787c85',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        language_id: language_id,
        source_code: btoa(source_code),
        stdin: btoa(stdin)
      }
    };
    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
})

app.get('/status', async (req, res) => {
  try {
    const { token } = req.body;
    const options = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: {
        base64_encoded: 'true',
        fields: '*'
      },
      headers: {
        'x-rapidapi-key': '3c80a113c8mshb48590a41fe6e12p14f11fjsn3e5e0f787c85',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      }
    }
    const response = await axios.request(options);
    response.stdout = atob(response.stdout);
    response.stderr = atob(response.stderr);
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
})

const wss = new WebSocketServer({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req, { gc: true });
});

// Start server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 HTTP & WebSocket server running at http://localhost:${PORT}`);
});

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Utility to pause
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createHeadlessClient(roomId, name, durationMs = 9000000) {
  const ydoc = new Y.Doc();
  const wsProvider = new WebsocketProvider(
    'ws://localhost:8080', 
    roomId,
    ydoc
  );

  wsProvider.awareness.setLocalStateField('user', { name });

  console.log(`[${name}] Connecting to room ${roomId}...`);

  wsProvider.on('status', (event) => {
    console.log(`[${name}] WebSocket status: ${event.status}`);
  });

  ydoc.on('update', (update) => {
    console.log(`[${name}] Received Yjs update of length ${update.byteLength}`);
  });

  wsProvider.awareness.on('update', ({ added, updated, removed }) => {
    if (added.length) console.log(`[${name}] Users added: ${added}`);
    if (updated.length) console.log(`[${name}] Users updated: ${updated}`);
    if (removed.length) console.log(`[${name}] Users removed: ${removed}`);
  });

  setTimeout(() => {
    wsProvider.destroy();
    console.log(`[${name}] Disconnected after ${durationMs / 1000}s`);
  }, durationMs);
}

// Gradually spawn 100 clients
(async () => {
  const totalClients = 200;
  const delayMs = 20; // 200ms between each client

  for (let i = 0; i < totalClients; i++) {
    console.log(`Creating client user${i}`);
    createHeadlessClient('7ARGS8', `user${i}`);
    await sleep(delayMs);
  }
})();

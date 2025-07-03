// src/socket/index.ts

let socket: WebSocket;

export const initSocket = (url: string): WebSocket => {
  console.log("Connecting to", url);
  socket = new WebSocket(url);


  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  socket.onerror = (err) => {
    console.error("WebSocket error", err);
  };

  return socket;
};

export const getSocket = (): WebSocket => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    throw new Error("WebSocket not open. Call initSocket first and wait for connection.");
  }
  return socket;
};

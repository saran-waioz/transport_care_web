import io from "socket.io-client";
import SOCKET from "./backendapi";
let socket;
export const initiateSocket = (room) => {
  socket = io(SOCKET, {
    query: {id:"90",}
  });
  console.log(`Connecting socket...`);
  if (socket && room) socket.emit("ping", room);
};
export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};
export const subscribeDriverLocation = (cb) => {
  if (!socket) return true;
  socket.on("driver_location", (msg) => {
    console.log("Websocket event received!");
    return cb(null, msg);
  });
};

export const testing = (cb) => {
  if (!socket) {
    return true;
  } else {
    socket.on("pong", (msg) => {
      console.log("Websocket event received!");
      return cb(null, msg);
    });
  }
};

import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_SERVER_HOST, {
  autoConnect: false,
  transports: ["websocket", "polling"]
});

export default socket;
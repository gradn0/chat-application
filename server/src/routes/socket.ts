import { Socket } from "socket.io";

const clients: Record<number, String> = {};

const handleSockets = (socket: Socket) => {
  socket.on("ehlo", ({id}) => clients[id] = socket.id);
}

export default handleSockets;
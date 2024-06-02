import { Socket } from "socket.io";

export const clients: Record<number, Socket> = {};

const handleSockets = (socket: Socket) => {
  socket.on("ehlo", ({id}) => clients[id] = socket);
}

export default handleSockets;
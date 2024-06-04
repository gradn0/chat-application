import { Socket } from "socket.io";
import db from "../db";

export const clients: Record<number, Socket> = {};

const handleSockets = (socket: Socket) => {
  socket.on("ehlo", ({id}) => clients[id] = socket);
  socket.on("new-message", async ({sender_id, roomId, body}) => {
    try {
      const message = (await db.query("INSERT INTO messages (body, sender_id, room_id) VALUES ($1, $2, $3) RETURNING *", [body, sender_id, roomId])).rows[0];
      const members = (await db.query("SELECT user_id FROM room_members WHERE room_id = $1", [roomId])).rows;
      members.forEach(member => {
        clients[member.user_id].emit("new-message", message);
      })
    } catch (error) {
      console.log(error);
    }
  })
}

export default handleSockets;
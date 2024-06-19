import { Socket } from "socket.io";
import db from "../db";

export const clients: Record<number, Socket> = {};

const handleSockets = (socket: Socket) => {
  socket.on("ehlo", ({id}) => clients[id] = socket);
  
  socket.on("new-message", async ({sender_id, roomId, body}) => {
    try {
      const message = (await db.query("INSERT INTO messages (body, sender_id, room_id) VALUES ($1, $2, $3) RETURNING *", [body, sender_id, roomId])).rows[0];
      const sender = (await db.query("SELECT username, icon_url FROM users WHERE id = $1", [sender_id])).rows[0]
      const recieverIds = (await db.query("SELECT user_id FROM room_members WHERE room_id = $1", [roomId])).rows
                  .map(member => member.user_id)
                  .filter(id => id !== sender_id);
      await db.query("UPDATE room_members SET unseen_messages = TRUE WHERE room_id = $1 AND user_id = ANY($2::int[])", [roomId, recieverIds]);         
      clients[sender_id].emit("new-message", {...message, ...sender});   
      recieverIds.forEach(id => {
        clients[id]?.emit("new-message", {...message, ...sender}); 
      })
    } catch (error) {
      console.log(error);
    }
  })

  socket.on("chat-seen", async ({userId, chatId}) => {
    try {
      (await db.query("UPDATE room_members SET unseen_messages = FALSE WHERE user_id = $1 AND room_id = $2", [userId, chatId]));
    } catch (error) {
      console.log(error);
    }
  })

  socket.on("delete-chat", async ({roomId}) => {
    try {
      const members = (await db.query("SELECT user_id FROM room_members WHERE room_id = $1", [roomId])).rows;
      members.forEach(member => {
        clients[member.user_id]?.emit("delete-chat");
      })
    } catch (error) {
      console.log(error);
    }
  })
}

export default handleSockets;
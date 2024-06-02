import { Socket } from "socket.io";
import db from "../db";

const clients: Record<number, Socket> = {};

const handleSockets = (socket: Socket) => {
  socket.on("ehlo", ({id}) => clients[id] = socket);
  socket.on("create-room", async ({name, ids}) => {
    const existingRoom = (await db.query("SELECT * FROM rooms WHERE name = $1", [name])).rows[0];
    if (existingRoom) return;
    if (!ids[0]) return;

    const roomId = (await db.query("INSERT INTO rooms (name) VALUES ($1) RETURNING id", [name])).rows[0].id;
    if (ids[1]) {
      await db.query("INSERT INTO room_members (room_id, user_id) VALUES ($1, $2), ($1, $3)", [roomId, ids[0], ids[1]]);
    } else {
      await db.query("INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)", [roomId, ids[0]]);
    }
  })
}

export default handleSockets;
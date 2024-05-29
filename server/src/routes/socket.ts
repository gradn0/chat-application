import { Socket } from "socket.io";
import db from "../db";
import { getErrorMessage } from "../app";

const handleSockets = (socket: Socket) => {
  socket.on("friend_request", async ({username, request_id}) => {
    try {
      const reciever = (await db.query("SELECT id FROM users WHERE username = $1", [username])).rows[0];
      if (reciever) {
        const res = await db.query("INSERT INTO relationships (request_id, reciever_id, status) VALUES ($1, $2, $3)", [request_id, reciever.id, 'pending']);
        console.log(res);
        
      } else {
        throw new Error("user does not exist");
      }
    } catch (error) {
      socket.emit("error", {Error: getErrorMessage(error)});
    }
  })
}

export default handleSockets;
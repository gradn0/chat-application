import { getErrorMessage } from "../common";
import db from "../db";
import { Response } from "express";
import { clients } from "./socket";

export const getChats = async (req: any, res: Response) => {
  const {id} = req.user;
  try {
    const chats = (await db.query("\
      SELECT rooms.*, room_members.joined_at, room_members.unseen_messages, room_members.room_name FROM room_members\
      INNER JOIN rooms ON room_members.room_id = rooms.id\
      WHERE room_members.user_id = $1", [id])).rows;
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const createChat = async (req: any, res: Response) => {
  const {creator, recipient} = req.body;
  const creatorRoomName = recipient.username;
  const recipientRoomName = creator.username;
  try {
    const existingRoom = (await db.query("SELECT * FROM room_members WHERE user_id = $1 AND room_name = $2", [creator.id, recipient.username])).rows[0]
    if (existingRoom) throw new Error("Room already exists");

    const roomId = (await db.query("INSERT INTO rooms DEFAULT VALUES RETURNING id")).rows[0].id;
    await db.query("INSERT INTO room_members (room_id, user_id, room_name) VALUES ($1, $2, $3), ($1, $4, $5)", [roomId, creator.id, recipient.username, recipient.id, creator.username]);

    clients[creator.id]?.emit("new-chat", {roomId});
    clients[recipient.id]?.emit("new-chat", {roomId});
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const deleteChat = async (req: any, res: Response) => {
  const {id} = req.params;
  try {
    await db.query("DELETE FROM room_members WHERE room_id = $1", [id]);
    await db.query("DELETE FROM messages WHERE room_id = $1", [id]);
    await db.query("DELETE FROM rooms WHERE id = $1", [id]);
    res.status(200);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const addMember = async (req: any, res: Response) => {
  const {id} = req.params;
  const {roomId, roomName} = req.body;
  try {
    const existingMember = (await db.query("SELECT * FROM room_members WHERE user_id = $1 AND room_name = $2", [id, roomId])).rows[0]
    if (existingMember) throw new Error("User is already a member of this room");

    await db.query("INSERT INTO room_members (user_id, room_id, room_name) VALUES ($1, $2, $3)", [id, roomId, roomName]);
    await db.query("UPDATE room_members SET room_name = $1 WHERE room_id = $2", [roomName, roomId]);
    await db.query("UPDATE rooms SET member_count = member_count + 1 WHERE id = $1", [roomId]);
    
    const recieverIds = (await db.query("SELECT user_id FROM room_members WHERE room_id = $1", [roomId])).rows.map(member => member.user_id);
    recieverIds.forEach(id => {
      clients[id]?.emit("new-chat", {roomId});
    })

    res.status(200);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const getMessages = async (req: any, res: Response) => {
  const {length, earliest} = req.query;
  const {roomId} = req.params;
  try {
    const messages = earliest
      ? (await db.query(`SELECT messages.*, users.username, users.icon_url FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE room_id = $1 AND id < $2 ORDER BY id DESC LIMIT $3`, [roomId, earliest, length])).rows
      : (await db.query(`SELECT messages.*, users.username, users.icon_url FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE room_id = $1 ORDER BY id DESC LIMIT $2`, [roomId, length])).rows
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
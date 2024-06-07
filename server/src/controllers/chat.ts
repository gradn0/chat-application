import { getErrorMessage } from "../common";
import db from "../db";
import { Response } from "express";
import { clients } from "./socket";

export const getChats = async (req: any, res: Response) => {
  const {id} = req.user;
  try {
    const chats = (await db.query("\
      SELECT rooms.*, room_members.joined_at, room_members.unseen_messages FROM room_members\
      INNER JOIN rooms ON room_members.room_id = rooms.id\
      WHERE room_members.user_id = $1", [id])).rows;
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const createChat = async (req: any, res: Response) => {
  const {usernames, ids} = req.body;
  try {
    const existingRoom = (await db.query("SELECT * FROM rooms WHERE name = $1 OR name = $2", [`dm-${usernames[0]}/${usernames[1]}`, `dm-${usernames[1]}/${usernames[0]}`])).rows[0];
    if (existingRoom) throw new Error("Room already exists");
    if (!ids[0] || !ids[1]) throw new Error("Two ids are required to create a chat");

    const roomId = (await db.query("INSERT INTO rooms (name) VALUES ($1) RETURNING id", [`dm-${usernames[0]}/${usernames[1]}`])).rows[0].id;
    await db.query("INSERT INTO room_members (room_id, user_id) VALUES ($1, $2), ($1, $3)", [roomId, ids[0], ids[1]]);

    clients[ids[0]].emit("new-chat", {roomId});
    clients[ids[1]].emit("new-chat", {roomId});

    res.status(200);
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


export const getMessages = async (req: any, res: Response) => {
  const {length, earliest} = req.query;
  const {roomId} = req.params;
  try {
    const messages = earliest
      ? (await db.query(`SELECT * FROM messages WHERE room_id = $1 AND id < $2 ORDER BY id DESC LIMIT $3`, [roomId, earliest, length])).rows
      : (await db.query(`SELECT * FROM messages WHERE room_id = $1 ORDER BY id DESC LIMIT $2`, [roomId, length])).rows
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
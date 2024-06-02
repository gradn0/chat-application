import { getErrorMessage } from "../common";
import db from "../db";
import { Response } from "express";

export const getChats = async (req: any, res: Response) => {
  const {id} = req.user;
  try {
    const chats = (await db.query("SELECT rooms.*, room_members.joined_at FROM room_members INNER JOIN rooms ON room_members.room_id = rooms.id WHERE room_members.user_id = $1", [id])).rows;
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
    if (!ids[0]) throw new Error("At least one id is required");

    const roomId = (await db.query("INSERT INTO rooms (name) VALUES ($1) RETURNING id", [`dm-${usernames[0]}/${usernames[1]}`])).rows[0].id;
    if (ids[1]) {
      await db.query("INSERT INTO room_members (room_id, user_id) VALUES ($1, $2), ($1, $3)", [roomId, ids[0], ids[1]]);
    } else {
      await db.query("INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)", [roomId, ids[0]]);
    }
    res.status(200);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
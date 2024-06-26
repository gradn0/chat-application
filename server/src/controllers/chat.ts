import { getErrorMessage } from "../common";
import db from "../db";
import { Response } from "express";
import { clients } from "./socket";

export const getChats = async (req: any, res: Response) => {
  const {id} = req.user;
  try {
    const chats = (await db.query("\
      SELECT rooms.id, rooms.member_count, room_members.joined_at, room_members.unseen_messages, room_members.room_name, room_members.icon_url, room_members.is_admin FROM room_members\
      INNER JOIN rooms ON room_members.room_id = rooms.id\
      WHERE room_members.user_id = $1", [id])).rows;
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const createChat = async (req: any, res: Response) => {
  const {creatorId, recipientId} = req.body;
  try {
    const {username: creatorName, icon_url: creatorIcon} = (await db.query("SELECT * FROM users WHERE id = $1", [creatorId])).rows[0];
    const {username: recipientName, icon_url: recipientIcon} = (await db.query("SELECT * FROM users WHERE id = $1", [recipientId])).rows[0];

    const existingRoom = (await db.query("SELECT * FROM room_members WHERE user_id = $1 AND room_name = $2", [creatorId, recipientName])).rows[0]
    if (existingRoom) throw new Error("Room already exists");

    const {id: roomId} = (await db.query("INSERT INTO rooms DEFAULT VALUES RETURNING id")).rows[0];
    await db.query("INSERT INTO room_members (room_id, user_id, room_name, icon_url, is_admin) VALUES ($1, $2, $3, $4, $8), ($1, $5, $6, $7, $9)", [
      roomId, creatorId, recipientName, recipientIcon, recipientId, creatorName, creatorIcon, true, false]);

    clients[creatorId]?.emit("new-chat", {roomId});
    clients[recipientId]?.emit("new-chat", {roomId});
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
    const {member_count} = (await db.query("UPDATE rooms SET member_count = member_count + 1 WHERE id = $1 RETURNING member_count", [roomId])).rows[0];
    if (member_count > 2) (await db.query("UPDATE room_members SET icon_url = $1 WHERE room_id = $2", [null, roomId]));

    const recieverIds = (await db.query("SELECT user_id FROM room_members WHERE room_id = $1", [roomId])).rows.map(member => member.user_id);
    recieverIds.forEach(id => {
      clients[id]?.emit("new-chat", {roomId});
    })

    res.status(200);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const removeMember = async (req: any, res: Response) => {
  const {userId, roomId} = req.query;
  res.status(200);
  try {
    const memberIds = (await db.query("SELECT user_id FROM room_members WHERE room_id = $1", [roomId])).rows.map(member => member.user_id);

    await db.query("DELETE FROM room_members WHERE user_id = $1 AND room_id = $2", [userId, roomId]);
    await db.query("UPDATE rooms SET member_count = member_count - 1 WHERE id = $1", [roomId]);

    memberIds.forEach(id => {
      clients[id]?.emit("new-chat", {roomId});
    })
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const getMessages = async (req: any, res: Response) => {
  const {length, earliest} = req.query;
  const {roomId} = req.params;
  try {
    const messages = earliest
      ? (await db.query(`SELECT messages.*, users.username, users.icon_url FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE room_id = $1 AND messages.id < $2 ORDER BY messages.id DESC LIMIT $3`, [roomId, earliest, length])).rows
      : (await db.query(`SELECT messages.*, users.username, users.icon_url FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE room_id = $1 ORDER BY id DESC LIMIT $2`, [roomId, length])).rows
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
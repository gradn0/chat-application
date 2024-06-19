import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import { createWebToken, validateLogin, validateSignup } from "../utils/auth";
import { getErrorMessage } from "../common";

export const signup = async (req: Request, res: Response) => {
  const {username, email, password} = req.body;
  try {
    await validateSignup(email, username, password);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const {id, icon_url} = (await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, icon_url", [username, email, hash])).rows[0];
    const token = createWebToken(id);
    res.status(201).json({id, username, token, icon_url});
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const login = async (req: Request, res: Response) => {
  const {username, password} = req.body;
  try {
    const user = await validateLogin(username, password);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = createWebToken(user.id);
      res.status(200).json({id: user.id, username: user.username, token, icon_url: user.icon_url});
    } else {
      throw new Error("Incorrect username or password");
    }
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const edit = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {newUsername, oldUsername} = req.body;
  try {
    await db.query("UPDATE users SET username = $1 WHERE id = $2", [newUsername, id]);
    await db.query("UPDATE room_members SET room_name = $1 WHERE room_name = $2", [newUsername, oldUsername]);
    res.status(200).json({username: newUsername});
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
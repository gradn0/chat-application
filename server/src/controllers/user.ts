import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import { createWebToken, validateLogin, validateSignup } from "../utils/auth";
import { getErrorMessage } from "../app";

export const signup = async (req: Request, res: Response) => {
  const {username, email, password} = req.body;
  try {
    await validateSignup(email, username, password);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const id = (await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id", [username, email, hash])).rows[0].id;
    const token = createWebToken(id);
    res.status(201).json({id, username, token});
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
      res.status(200).json({username: user.username, id: user.id, token});
    } else {
      throw new Error("Incorrect username or password");
    }
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const createFriendRequest = async (req: any, res: Response) => {
  const username = req.params.username;
  const {id} = req.user;
  try {
    const reciever = (await db.query("SELECT id FROM users WHERE username = $1", [username])).rows[0];
    if (reciever) {
      await db.query("INSERT INTO relationships (request_id, reciever_id, status) VALUES ($1, $2, $3)", [id, reciever.id, 'pending']);
    } else {
      throw new Error("user does not exist");
    }
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const getFriendRequests = async (req: any, res: Response) => {
  const {id} = req.user;
  try {

    const requests = (await db.query(
      "SELECT users.username, relationships.request_id, relationships.id FROM users LEFT JOIN relationships on users.id = relationships.request_id WHERE reciever_id = $1 AND status = $2", 
      [id, 'pending'])).rows;
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
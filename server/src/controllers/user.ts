import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";
import { createWebToken, validateLogin, validateSignup } from "../utils/auth";
import { getErrorMessage } from "../app";

export const signup = async (req: Request, res: Response) => {
  const {username, email, password} = req.body;
  try {
    await validateSignup(email, username, password);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id", [username, email, hash]);
    const token = createWebToken(user.rows[0].id);
    res.status(201).json({email, username, token});
    
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
      res.status(200).json({username: user.username, email: user.email, token});
    } else {
      throw new Error("Incorrect username or password");
    }
    
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
  
}
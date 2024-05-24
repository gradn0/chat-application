import { pool } from "../db";
import jwt from "jsonwebtoken";

export const createWebToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return;
  return jwt.sign({id}, secret, {expiresIn: '3d'});
}

export const validateSignup = async (email: string, username: string, password: string) => {
  if (!email || !password || !username) {
    throw new Error("All fields must be filled");
  }

  const existingEmail = (await pool.query("SELECT * FROM users WHERE email = $1", [email])).rows[0];
  const existingUsername = (await pool.query("SELECT * FROM users WHERE username = $1", [username])).rows[0];

  if (existingEmail) {
    throw new Error("Email exists");
  }

  if (existingUsername) {
    throw new Error("Username exists");
  }

  const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
  const emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

  if (!emailRegex.test(email)) throw new Error("Invalid email");
  if (!passwordRegex.test(password)) throw new Error("Password to weak");
}

export const validateLogin = async (username: string, password: string) => {
  if (!username || !password) {
    throw new Error("All fields must be filled");
  }
  const user = (await pool.query("SELECT * FROM users WHERE email = $1 OR username = $1", [username])).rows[0];
  if (user) return user;
  throw new Error("Incorrect username or password");
}

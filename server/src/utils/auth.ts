import { pool } from "../db";
import jwt from "jsonwebtoken";

export const createWebToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return;
  return jwt.sign({id}, secret, {expiresIn: '3d'});
}

export const validateSignup = async (email: string, username: string, password: string) => {
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }

  const existingEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const existingUsername = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  
  if (existingEmail.rows.length > 0) {
    throw new Error("Email exists");
  }
  if (existingUsername.rows.length > 0) {
    throw new Error("Username exists");
  }

  const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
  const emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

  if (!emailRegex.test(email)) throw new Error("Invalid email");
  if (!passwordRegex.test(password)) throw new Error("Password to weak");
}
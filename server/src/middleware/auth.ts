import jwt from "jsonwebtoken"
import { getErrorMessage } from "../common";
import db from "../db";

interface IJWTPayload {
  id: number,
}

const getToken = (req: any) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new Error("Unauthorized request");
  }
  try {
    const token = auth.split("Bearer ")[1];
    return token;
  } catch {
    throw new Error("Invalid token format");
  }
}

export const auth = async (req:any, res:any, next:any) => {
  try {
    const token = getToken(req);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Internal server error");
    const {id} = jwt.verify(token, secret) as IJWTPayload;
    req.user = (await db.query("SELECT * FROM users WHERE id = $1", [id])).rows[0];
    next();
  } catch (error) {
    return res.status(401).json({Error: getErrorMessage(error)});
  }
}
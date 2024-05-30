import { getErrorMessage } from "../common";
import db from "../db";
import { Response } from "express";

export const createRelationship = async (req: any, res: Response) => {
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

export const getRelationships = async (req: any, res: Response) => {
  const {id} = req.user;
  const {status} = req.params;
  try {

    const requests = (await db.query(
      "SELECT relationships.id, users.username FROM users LEFT JOIN relationships on users.id = relationships.request_id WHERE reciever_id = $1 AND status = $2", 
      [id, status])).rows;
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const editRelationship = async (req: any, res: Response) => {
  const {id} = req.params;
  const {status} = req.body;

  try {
    await db.query("UPDATE relationships SET status = $1 WHERE id = $2", [status, id]);
    res.status(200).json({id, status});
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
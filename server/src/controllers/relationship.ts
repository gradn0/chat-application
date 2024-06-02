import { TStatus, getErrorMessage } from "../common";
import db from "../db";
import { Response } from "express";

export const createRelationship = async (req: any, res: Response) => {
  const username = req.params.username;
  const {id} = req.user;
  try {
    const reciever = (await db.query("SELECT id FROM users WHERE username = $1", [username])).rows[0];
    if (reciever) {
      if (reciever.id === id) throw new Error("request id is the same as recieving id");
      const existingRelationships = (await db.query(
        "SELECT * FROM relationships WHERE (request_id = $1 AND reciever_id = $2) OR (request_id = $2 AND reciever_id = $1)", 
        [id, reciever.id]
      )).rows;
      if (existingRelationships.length > 0) throw new Error("Relationship already exists");

      await db.query("INSERT INTO relationships (request_id, reciever_id, status) VALUES ($1, $2, $3)", [id, reciever.id, 'pending']);
    } else {
      throw new Error("user does not exist");
    }
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const getRelationship = async (req: any, res: Response, status: TStatus) => {
  const {id} = req.user;
  try {
    const requests = (await db.query(
      "SELECT relationships.id, users.username, relationships.request_id, relationships.reciever_id FROM users LEFT JOIN relationships on users.id = relationships.request_id WHERE (reciever_id = $1 OR request_id = $1) AND status = $2", 
      [id, status])).rows;
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const editRelationship = async (req: any, res: Response) => {
  const {id} = req.params;
  const {status}:{status: TStatus} = req.body;

  try {
    await db.query("UPDATE relationships SET status = $1 WHERE id = $2", [status, id]);
    res.status(200).json({id, status});
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const deleteRelationship = async (req: any, res: Response) => {
  const {id} = req.params;

  try {
    await db.query("DELETE FROM relationships WHERE id = $1", [id]);
    res.status(200).json({id});
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}
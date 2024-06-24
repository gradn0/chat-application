import { IRelationship, TStatus, getErrorMessage } from "../common";
import db from "../db";
import { Response } from "express";
import { clients } from "./socket";

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

    clients[reciever.id].emit("friend-request");
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const getRelationship = async (req: any, res: Response, status: TStatus) => {
  const {id} = req.user;
  try {
    const relationships: IRelationship[] = (await db.query(
      "SELECT relationships.*, users.username, users.icon_url FROM relationships INNER JOIN users\
      ON (relationships.request_id = users.id AND relationships.request_id != $1) OR (relationships.reciever_id = users.id AND relationships.reciever_id != $1)\
      WHERE (request_id = $1 OR reciever_id = $1) AND status = $2", 
      [id, status])).rows;
    res.status(200).json(relationships);
  } catch (error) {
    res.status(400).json({Error: getErrorMessage(error)});
  }
}

export const editRelationship = async (req: any, res: Response) => {
  const {id} = req.params;
  const {status}:{status: TStatus} = req.body;

  try {
    const request_id = (await db.query("UPDATE relationships SET status = $1 WHERE id = $2 RETURNING request_id", [status, id])).rows[0].request_id;
    if (status === "approved"){
      clients[request_id].emit("request-accepted");
      clients[req.user.id].emit("request-accepted");
    }
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
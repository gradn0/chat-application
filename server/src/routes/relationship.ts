import express from "express";
import { auth } from "../middleware/auth";
import { createRelationship, editRelationship, getRelationship, deleteRelationship } from "../controllers/relationship";

const router = express.Router();

router.use(auth);
router.post("/:username", (req, res) => createRelationship(req, res));
router.get("/requests", (req, res) => getRelationship(req, res, "pending"));
router.get("/friends", (req, res) => getRelationship(req, res, "approved"));
router.delete("/:id", (req, res) => deleteRelationship(req, res));
router.patch("/:id", (req, res) => editRelationship(req, res));

export default router;
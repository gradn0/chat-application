import express from "express";
import { auth } from "../middleware/auth";
import { createRelationship, editRelationship, getRelationships } from "../controllers/relationship";

const router = express.Router();

router.use(auth);
router.post("/:username", (req, res) => createRelationship(req, res));
router.get("/:status", (req, res) => getRelationships(req, res));
router.patch("/:id", (req, res) => editRelationship(req, res));

export default router;
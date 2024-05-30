import express from "express";
import { auth } from "../middleware/auth";
import { createRelationship, editRelationship, getRelationship } from "../controllers/relationship";

const router = express.Router();

router.use(auth);
router.post("/:username", (req, res) => createRelationship(req, res));
router.get("/requests", (req, res) => getRelationship(req, res, "pending"));
router.get("/friends", (req, res) => getRelationship(req, res, "approved"));
router.patch("/:id", (req, res) => editRelationship(req, res));

export default router;
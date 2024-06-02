import express from "express";
import { auth } from "../middleware/auth";
import { createChat, getChats } from "../controllers/chat";

const router = express.Router();

router.use(auth);
router.get("/", (req, res) => getChats(req, res));
router.post("/", (req, res) => createChat(req, res));

export default router;
import express from "express";
import { auth } from "../middleware/auth";
import { addMember, createChat, deleteChat, getChats, getMessages } from "../controllers/chat";

const router = express.Router();

router.use(auth);
router.get("/", (req, res) => getChats(req, res));
router.post("/", (req, res) => createChat(req, res));
router.delete("/:id", (req, res) => deleteChat(req, res));
router.put("/:id", (req, res) => addMember(req, res));

router.get("/:roomId/messages", (req, res) => getMessages(req, res));

export default router;
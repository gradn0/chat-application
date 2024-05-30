import express from "express";
import { createFriendRequest, getFriendRequests, login, signup, editFriendRequest } from "../controllers/user";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/signup", (req, res) => signup(req, res));
router.post("/login", (req, res) => login(req, res));

router.use(auth);
router.post("/friendRequest/:username", (req, res) => createFriendRequest(req, res));
router.get("/friendRequests", (req, res) => getFriendRequests(req, res));
router.patch("/friendRequest/:id", (req, res) => editFriendRequest(req, res));

export default router;
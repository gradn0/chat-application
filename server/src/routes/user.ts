import express from "express";
import { edit, login, signup } from "../controllers/user";

const router = express.Router();

router.post("/signup", (req, res) => signup(req, res));
router.post("/login", (req, res) => login(req, res));
router.patch("/edit/:id", (req, res) => edit(req, res));

export default router;
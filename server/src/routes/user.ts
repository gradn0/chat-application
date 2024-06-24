import express from "express";
import { edit, login, signup } from "../controllers/user";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/signup", (req, res) => signup(req, res));
router.post("/login", (req, res) => login(req, res));
router.post("/edit/:id", upload.none(), (req, res) => edit(req, res))

export default router;
import express from "express";
import { signup } from "../controllers/user";

const router = express.Router();

router.post("/signup", (req, res) => {
  signup(req, res);
})

export default router;
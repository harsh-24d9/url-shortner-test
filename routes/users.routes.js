import express from "express";
import { createUser, loginUser } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(201).json(`Welcome to users route`);
});

router.post("/signup", createUser);
router.post("/login", loginUser);

export default router;

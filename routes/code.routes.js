import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createShortCode,
  redirectShortCode,
} from "../controllers/codes.controller.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, createShortCode);
router.get("/:shortCode", redirectShortCode);

export default router;

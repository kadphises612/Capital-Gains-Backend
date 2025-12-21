import express from "express";
import {
  createTrade,
  getTradesByUser,
} from "../controllers/trade.controller.js";

const router = express.Router();

router.post("/", createTrade);
router.get("/user/:userId", getTradesByUser);

export default router;

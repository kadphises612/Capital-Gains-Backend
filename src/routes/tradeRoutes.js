import { Router } from "express";
import {
  createTrade,
  getTradesForUser,
  updateTrade,
  deleteTrade,
} from "../controllers/tradeController.js";

const router = Router();

router.post("/create", createTrade);

router.get("/user/:userId", getTradesForUser);

router.put("/:tradeId", updateTrade);

router.delete("/:tradeId", deleteTrade);

export default router;

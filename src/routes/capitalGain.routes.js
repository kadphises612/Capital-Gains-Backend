import express from "express";
import { getCapitalGain } from "../controllers/capitalGain.controller.js";

const router = express.Router();

router.get("/user/:userId/:symbol", getCapitalGain);

export default router;

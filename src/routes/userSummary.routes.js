import express from "express";
import { getUserSummary } from "../controllers/usersummary.controller.js";

const router = express.Router();

router.get("/user/:userId/summary", getUserSummary);

export default router;

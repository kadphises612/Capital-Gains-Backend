import express from "express";
// import { getUserCapitalGainSummary } from "..//controllers/userCapitalGain.controller.js";

import { getUserCapitalGainSummary } from "./../controllers/userCapitalGain.controller.js";

const router = express.Router();

router.get("/user/:userId", getUserCapitalGainSummary);

export default router;

import { Router } from "express";
import {
  userSummaryHandler,
  allUsersSummaryHandler,
} from "../controllers/userController.js";

const router = Router();

router.get("/:userId/summary", userSummaryHandler);
router.get("/summary/all", allUsersSummaryHandler);

export default router;

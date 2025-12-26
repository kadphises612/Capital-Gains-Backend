import { Router } from "express";
import {
  userSummaryHandler,
  allUsersSummaryHandler,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser); // create user
router.get("/", getUsers); // list users
router.get("/:userId", getUser); // get one
router.put("/:userId", updateUser); // update
router.delete("/:userId", deleteUser); // delete

router.get("/:userId/summary", userSummaryHandler);
router.get("/summary/all", allUsersSummaryHandler);

export default router;

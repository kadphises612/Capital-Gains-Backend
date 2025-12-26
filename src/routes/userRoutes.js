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

router.post("/create", createUser); // create user
router.get("/get-all", getUsers); // list users
router.get("/get/:userId", getUser); // get one
router.put("/update/:userId", updateUser); // update
router.delete("/delete/:userId", deleteUser); // delete

router.get("/summary/:userId", userSummaryHandler);
router.get("/summary/all", allUsersSummaryHandler);

export default router;

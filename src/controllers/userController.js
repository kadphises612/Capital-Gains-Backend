import {
  getUserSummary,
  getAllUsersSummary,
} from "../services/summaryService.js";

import { User } from "../models/User.js";

/**
 * Create User
 */
export async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Get All Users
 */
export async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get Single User
 */
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Update User
 */
export async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Delete User
 */
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function userSummaryHandler(req, res) {
  try {
    const data = await getUserSummary(req.params.userId);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function allUsersSummaryHandler(req, res) {
  try {
    const data = await getAllUsersSummary();
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

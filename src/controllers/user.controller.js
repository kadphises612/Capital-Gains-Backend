import User from "../models/User.js";

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, pan, email } = req.body;

    if (!name || !pan || !email) {
      return res
        .status(400)
        .json({ message: "Name, PAN, and email are required" });
    }

    const user = await User.create({ name, pan, email });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "PAN already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).populate("summary");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

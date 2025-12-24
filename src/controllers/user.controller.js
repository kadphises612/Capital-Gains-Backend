import User from "../models/User.js";

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, pan } = req.body;

    if (!name || !pan) {
      return res.status(400).json({ message: "Name and PAN are required" });
    }

    const user = await User.create({ name, pan });
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
    const users = await User.find().sort({ createdAt: -1 });
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

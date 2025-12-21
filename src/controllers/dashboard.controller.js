import { getDashboardSummary } from "../service/dashboard.service.js";

export const getDashboard = async (req, res) => {
  try {
    const summary = await getDashboardSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

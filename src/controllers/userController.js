import {
  getUserSummary,
  getAllUsersSummary,
} from "../services/summaryService.js";

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

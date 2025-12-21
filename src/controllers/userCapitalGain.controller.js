import { calculateUserCapitalGain } from "./../service/capitalGain.service.js";

export const getUserCapitalGainSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await calculateUserCapitalGain(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

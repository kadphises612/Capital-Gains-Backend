import { calculateCapitalGain } from "../service/capitalGain.service.js";

export const getCapitalGain = async (req, res) => {
  try {
    const { userId, symbol } = req.params;

    const result = await calculateCapitalGain(userId, symbol);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

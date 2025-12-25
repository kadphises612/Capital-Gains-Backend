import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import tradeRoutes from "./routes/trade.routes.js";
import UserSummaryRoutes from "./routes/userSummary.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/trades", tradeRoutes);

app.use("/user-summary", UserSummaryRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;

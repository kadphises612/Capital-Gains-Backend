import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pan: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    broker: {
      type: String,
      enum: ["zerodha", "groww", "upstox", "angleone"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("summary", {
  ref: "UserSummary",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";

const SortSchema = new mongoose.Schema(
  {
    nameRoom: { type: String },
    countArts: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.model('Sort', SortSchema)
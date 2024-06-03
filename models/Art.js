import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    text: { type: String, required: false, },
    // tags: {type: Array, default: []}
    viewsCount: { type: Number, default: 0 },
    // imageUrl: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true },
)
// imageUrl: { type: String, required: true },

export default mongoose.model('Art', ArtSchema)
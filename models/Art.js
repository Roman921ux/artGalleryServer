import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    text: { type: String, required: false, },
    // tags: {type: Array, default: []},
    viewsCount: { type: Number, default: 0 },
    room: { type: String, default: 'general' },
    likes: {
      count: { type: Number, default: 0 },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          index: true
        }
      ]
    },
    comments: {
      count: { type: Number, default: 0 },
      commentList: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          comment: { type: String, required: true },
          createdAt: { type: Date, default: Date.now }
        }
      ]
    },
    imageUrl: { type: String },
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


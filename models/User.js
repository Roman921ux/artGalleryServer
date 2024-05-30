import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: String,
    arts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Arts'
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.model('User', UserSchema)
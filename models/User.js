import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    followers: {
      count: { type: Number, default: 0 },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          index: true
        }
      ],
    },
    subscriptions: {
      count: { type: Number, default: 0 },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          index: true
        }
      ],
    },
    arts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Arts',
        index: true
      },
    ],
    // arts: {
    //   count: {type: Number, default: 0},
    //   items: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'Arts',
    //       index: true 
    //     },
    //   ],
    // }
  },
  { timestamps: true },
)

export default mongoose.model('User', UserSchema)
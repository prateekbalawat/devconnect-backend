import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: [String],
    comments: [
      {
        userEmail: String,
        content: String,
        createdAt: Date,
        replies: [
          {
            userEmail: String,
            content: String,
            createdAt: Date,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;

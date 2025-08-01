import { Router, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";

const router = Router();

// GET all posts
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new post (✔️ wrapped in normal handler to fix TS error)
const handleCreatePost = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, userName, title, content } = req.body;
  console.log("1234789", userEmail);

  if (!userEmail || !userName || !title || !content) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const newPost = new Post({
      userEmail,
      userName,
      title,
      content,
      likes: [],
      comments: [],
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✨ PUT /api/posts/:id — Update post
const handleUpdatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ post: updatedPost });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Server error while updating post" });
  }
};

// 🗑️ DELETE /api/posts/:id — Delete post
const handleDeletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ error: "Server error while deleting post" });
  }
};

const togglePostLike = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userEmail } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const index = post.likes.indexOf(userEmail);
    if (index > -1) {
      post.likes.splice(index, 1); // Unlike
    } else {
      post.likes.push(userEmail); // Like
    }

    await post.save();
    return res.json({ post });
  } catch (err) {
    console.error("Error liking post:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const handleAddReply = async (req: Request, res: Response) => {
  const { id, commentIndex } = req.params;
  const { userEmail, content } = req.body;

  try {
    const post = await Post.findById(id);
    const index = parseInt(commentIndex, 10);
    if (isNaN(index) || !post || !post.comments[index])
      return res.status(404).json({ error: "Comment not found" });

    post.comments[index].replies.push({
      userEmail,
      content,
      createdAt: new Date(),
    });

    await post.save();
    return res.json({ post });
  } catch (err) {
    console.error("Error replying to comment:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const handleAddcomment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userEmail, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = {
      userEmail,
      content,
      createdAt: new Date(),
      replies: [],
    };

    post.comments.push(comment);
    await post.save();
    return res.json({ post });
  } catch (err) {
    console.error("Error adding comment:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/posts/:id/comment/:commentIndex
const handleUpdateComment = async (req: Request, res: Response) => {
  const { id, commentIndex } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(id);
    const index = parseInt(commentIndex, 10);

    if (!post || !post.comments[index]) {
      return res.status(404).json({ error: "Comment not found" });
    }

    post.comments[index].content = content;
    await post.save();

    res.json({ post });
  } catch (err) {
    console.error("Error editing comment:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/posts/:id/comment/:commentIndex
const handleDeleteComment = async (req: Request, res: Response) => {
  const { id, commentIndex } = req.params;

  try {
    const post = await Post.findById(id);
    const index = parseInt(commentIndex, 10);

    if (!post || !post.comments[index]) {
      return res.status(404).json({ error: "Comment not found" });
    }

    post.comments.splice(index, 1);
    await post.save();

    res.json({ post });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/posts/:id/comment/:commentIndex/reply/:replyIndex
const handleUpdateReply = async (req: Request, res: Response) => {
  const { id, commentIndex, replyIndex } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(id);
    const cIndex = parseInt(commentIndex, 10);
    const rIndex = parseInt(replyIndex, 10);

    if (
      !post ||
      !post.comments[cIndex] ||
      !post.comments[cIndex].replies[rIndex]
    ) {
      return res.status(404).json({ error: "Reply not found" });
    }

    post.comments[cIndex].replies[rIndex].content = content;
    await post.save();

    res.json({ post });
  } catch (err) {
    console.error("Error editing reply:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/posts/:id/comment/:commentIndex/reply/:replyIndex
const handleDeleteReply = async (req: Request, res: Response) => {
  const { id, commentIndex, replyIndex } = req.params;

  try {
    const post = await Post.findById(id);
    const cIndex = parseInt(commentIndex, 10);
    const rIndex = parseInt(replyIndex, 10);

    if (
      !post ||
      !post.comments[cIndex] ||
      !post.comments[cIndex].replies[rIndex]
    ) {
      return res.status(404).json({ error: "Reply not found" });
    }

    post.comments[cIndex].replies.splice(rIndex, 1);
    await post.save();

    res.json({ post });
  } catch (err) {
    console.error("Error deleting reply:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/posts/following/:email
const getFollowing = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const followedEmails = user.following;
    const posts = await Post.find({ userEmail: { $in: followedEmails } }).sort({
      createdAt: -1,
    });

    res.json({ posts });
  } catch (err) {
    console.error("Error fetching followed posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

router.get("/following/:email", (req, res) => {
  getFollowing(req, res);
});

router.post("/", (req, res) => {
  handleCreatePost(req, res);
});

router.put("/:id", (req, res) => {
  handleUpdatePost(req, res);
});

router.delete("/:id", (req, res) => {
  handleDeletePost(req, res);
});

router.put("/:id/like", (req, res) => {
  togglePostLike(req, res);
});

router.post("/:id/comment", (req, res) => {
  handleAddcomment(req, res);
});

router.put("/:id/comment/:commentIndex", (req, res) => {
  handleUpdateComment(req, res);
});

router.delete("/:id/comment/:commentIndex", (req, res) => {
  handleDeleteComment(req, res);
});

router.post("/:id/comment/:commentIndex/reply", (req, res) => {
  handleAddReply(req, res);
});

router.put("/:id/comment/:commentIndex/reply/:replyIndex", (req, res) => {
  handleUpdateReply(req, res);
});

router.delete("/:id/comment/:commentIndex/reply/:replyIndex", (req, res) => {
  handleDeleteReply(req, res);
});

export default router;

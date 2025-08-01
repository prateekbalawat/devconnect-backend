import { Router, Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";

const router = Router();

/**
 * GET /api/users/:email/posts
 * Returns user's name, email, and their posts
 */
const getUserPosts = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ userEmail: email }).sort({ createdAt: -1 });

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
      posts,
    });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/:email/follow
const followUser = async (req: Request, res: Response) => {
  const targetEmail = req.params.email;
  const { userEmail } = req.body;

  if (targetEmail === userEmail) {
    return res.status(400).json({ error: "Cannot follow yourself" });
  }

  try {
    const targetUser = await User.findOne({ email: targetEmail });
    const currentUser = await User.findOne({ email: userEmail });

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add only if not already following
    if (!targetUser.followers.includes(userEmail)) {
      targetUser.followers.push(userEmail);
      currentUser.following.push(targetEmail);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Error following user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/users/:email/unfollow
const unfollowUser = async (req: Request, res: Response) => {
  const targetEmail = req.params.email;
  const { userEmail } = req.body;

  try {
    const targetUser = await User.findOne({ email: targetEmail });
    const currentUser = await User.findOne({ email: userEmail });

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    targetUser.followers = targetUser.followers.filter((e) => e !== userEmail);
    currentUser.following = currentUser.following.filter(
      (e) => e !== targetEmail
    );

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Error unfollowing user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/users/:email/followers
const getFollowers = async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ count: user.followers.length, followers: user.followers });
};

// GET /api/users/:email/following
const getFollowing = async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ count: user.following.length, following: user.following });
};

router.get("/:email", (req, res) => {
  getUser(req, res);
});

router.get("/:email/posts", (req, res) => {
  getUserPosts(req, res);
});

router.put("/:email/follow", (req, res) => {
  followUser(req, res);
});

router.put("/:email/unfollow", (req, res) => {
  unfollowUser(req, res);
});

router.get("/:email/followers", (req, res) => {
  getFollowers(req, res);
});

router.get("/:email/following", (req, res) => {
  getFollowing(req, res);
});

export default router;

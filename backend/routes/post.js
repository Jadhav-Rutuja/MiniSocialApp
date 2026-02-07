const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware"); // JWT middleware

// Create Post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, imageURL } = req.body;

    // ✅ Validation: at least one required
    if (!text && !imageURL) {
      return res.status(400).json({
        message: "Post must contain text or image"
      });
    }

    const newPost = new Post({
      userId: req.user.id,
      text,
      imageURL
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Get all posts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePhoto")
      .populate("comments.userId", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } 
});


// Get posts by user
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate("userId", "username profilePhoto")
      .populate("comments.userId", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Like a post
router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// Add comment
router.put("/comment/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ userId: req.user.id, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a post
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Allow delete only by owner
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
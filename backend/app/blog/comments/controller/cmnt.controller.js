const Comment = require('../model/comment');
const Blog = require('../../model/blog');


// Create a comment
exports.createComment = async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      blog: req.params.id,
      user: req.body.userId,
    });
    await comment.save();
    await Blog.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a blog
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
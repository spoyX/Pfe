const Blog = require('../model/blog');
const Comment = require('../comments/model/comment');
const User = require('../../User/models/user'); 
const { sendPush } = require('../../config/lib/oneSignal');

// Create a new blog
exports.createBlog = async (req, res,fileName) => {
  try {
    const blogData = {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags
    };

    if (req.file) {
      blogData.image = fileName
    }

    const blog = new Blog(blogData);
    await blog.save();

    // Fetch all users with OneSignal player IDs
   const users = await User.find({ role: { $ne: 'admin' } }).select('_id oneSignalPlayerIds');
    const playerIds = users.flatMap(user => user.oneSignalPlayerIds).filter(id => id);
    const userIds = users.map(user => user._id);
    // Send push notifications
    if (playerIds.length > 0) {
      try {
        await sendPush(
          playerIds,
          'New Blog Published', // Notification title
          `A new blog titled "${blog.title}" has been published!`, // Message
          `admin/blog/${blog._id}`, 
          userIds
        );
      } catch (error) {
        console.error('Failed to send notifications:', error);
      }
    }

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('comments');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific blog
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('comments');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateBlog = async (req, res) => {
  try {
    // Find the existing blog by ID
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update the blog data
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.tags = req.body.tags;

    // If a new file is provided, update the image
    if (req.file && req.file.filename) {
      blog.image = req.file.filename; // Assuming your file upload middleware sets this
    }

    // Save the updated blog
    const updatedBlog = await blog.save();

    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: error.message });
  }
};
// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();
    res.status(204).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPopularBlogs = async (req, res) => {
  try {
    // Get blogs and populate comments
    const blogs = await Blog.find()
      .populate('comments')
      .lean(); // Using lean() for better performance as we just need the data

    // Sort blogs by comment count (descending)
    const sortedBlogs = blogs.sort((a, b) => {
      const commentsA = a.comments ? a.comments.length : 0;
      const commentsB = b.comments ? b.comments.length : 0;
      return commentsB - commentsA; // Sort in descending order
    });

    // Get top 3 blogs
    const topBlogs = sortedBlogs.slice(0, 3);

    res.json(topBlogs);
  } catch (error) {
    console.error('Error getting popular blogs:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPopularBlogs = async (req, res) => {
  try {
   
    const blogs = await Blog.find()
      .populate('comments')
      .lean(); // Using lean() for better performance as we just need the data

   
    const sortedBlogs = blogs.sort((a, b) => {
      const commentsA = a.comments ? a.comments.length : 0;
      const commentsB = b.comments ? b.comments.length : 0;
      return commentsB - commentsA; // Sort in descending order
    });

    // Get top 3 blogs
    const topBlogs = sortedBlogs.slice(0, 3);

    res.json(topBlogs);
  } catch (error) {
    console.error('Error getting popular blogs:', error);
    res.status(500).json({ message: error.message });
  }
};
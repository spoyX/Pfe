const Blog = require('../model/blog');
const Comment = require('../comments/model/comment');


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

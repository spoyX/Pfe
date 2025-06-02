const mongoose = require('mongoose');
const Comment =require('../comments/model/comment')
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, 
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tags: { type: String }, 
}, { timestamps: true });

// Middleware to delete comments when blog is deleted
blogSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await Comment.deleteMany({ blog: this._id });
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model('Blog', blogSchema);
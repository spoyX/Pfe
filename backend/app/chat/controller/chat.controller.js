const Message = require('../model/chat');
const pusher = require('../../config/pusher');

exports.sendMessage = async (req, res) => {
  const { senderId, content } = req.body;
  if (!senderId || !content) {
    return res.status(400).json({ error: "Missing senderId or content" });
  }
  try {
    const msg = await Message.create({ sender: senderId, content });
    await msg.populate("sender", "username profileImage");
    // broadcast to everyone on the “public-chat” channel
    pusher.trigger("public-chat", "new-message", {
      _id: msg._id,
      sender: {
        _id: msg.sender._id,  // Include the sender ID
        username: msg.sender.username,
        profileImage: msg.sender.profileImage
      },
      content: msg.content,
      createdAt: msg.createdAt
    });
    res.status(201).json(msg);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.getRecentMessages = async (req, res) => {
  try {
    const msgs = await Message.find()
      .sort("createdAt")
      .populate("sender", "username profileImage");
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
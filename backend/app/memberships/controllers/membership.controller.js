
const Membership=require('../Models/membership')
exports.getMembershipByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const membership = await Membership.findOne({ userId: userId }).populate('userId', 'email firstName lastName job');;
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
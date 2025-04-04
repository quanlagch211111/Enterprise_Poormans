const Messages = require('../models/Message');
const Groups = require('../models/Group');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to, group_id } = req.body;

    let messages;
    if (group_id) {
      messages = await Messages.find({ group_id }).sort({ created_at: 1 });
    } else {
      messages = await Messages.find({
        $or: [
          { sender_id: from, receiver_id: to },
          { sender_id: to, receiver_id: from }
        ]
      }).sort({ created_at: 1 });
    }

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender_id.toString() === from,
        message: msg.content,
      };
    });
    res.json(projectedMessages);
  } catch (error) {
    next(error);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { to, group_id, message } = req.body;
    const from = req.user.payload.id; 

    const data = await Messages.create({
      sender_id: from,
      receiver_id: to,
      group_id,
      content: message,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (error) {
    next(error);
  }
};

module.exports.createGroup = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const group = await Groups.create({
      name,
      members,
    });

    if (group) return res.json({ msg: "Group created successfully.", group });
    else return res.json({ msg: "Failed to create group" });
  } catch (error) {
    next(error);
  }
};

module.exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Groups.find({ members: req.user.payload.id });
    res.json(groups);
  } catch (error) {
    next(error);
  }
};

module.exports.addMemberToGroup = async (req, res, next) => {
  try {
    const { group_id, member_id } = req.body;
    const group = await Groups.findById(group_id);

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    group.members.push(member_id);
    await group.save();

    res.json({ msg: "Member added to group successfully", group });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessagesCountLast7Days = async (req, res, next) => {
  try {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      const messagesCount = await Messages.aggregate([
          {
              $match: {
                  created_at: {
                      $gte: sevenDaysAgo,
                      $lte: today,
                  },
              },
          },
          {
              $group: {
                  _id: {
                      $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
                  },
                  count: { $sum: 1 },
              },
          },
          {
              $sort: { _id: 1 },
          },
      ]);

      res.status(200).json({
          message: "Messages count for the last 7 days retrieved successfully",
          data: messagesCount,
      });
  } catch (error) {
      console.error("Error fetching messages count for the last 7 days:", error.message);
      res.status(500).json({ message: "Failed to retrieve messages count", error: error.message });
  }
};
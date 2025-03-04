const Messages = require('../models/Message');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      $or: [
        { sender_id: from, receiver_id: to },
        { sender_id: to, receiver_id: from }
      ]
    }).sort({ created_at: 1 });

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
    const { from, to, message } = req.body;
    const data = await Messages.create({
      sender_id: from,
      receiver_id: to,
      content: message,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (error) {
    next(error);
  }
};
const { addMessage, getMessages, createGroup, getGroups, addMemberToGroup } = require("../controllers/messageController");
const router = require("express").Router();
const { authMiddleware } = require('../middlewares/Authmiddlewares');

router.post("/addmessage", authMiddleware, addMessage);
router.post("/getmessage", authMiddleware, getMessages);
router.post("/creategroup", authMiddleware, createGroup);
router.get("/getgroups", authMiddleware, getGroups);
router.post("/addmembertogroup", authMiddleware, addMemberToGroup);

module.exports = router;
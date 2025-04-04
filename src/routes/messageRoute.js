const { addMessage, getMessages, createGroup, getGroups, addMemberToGroup, getMessagesCountLast7Days } = require("../controllers/messageController");
const router = require("express").Router();
const { authMiddleware } = require('../middlewares/Authmiddlewares');
const { isStaff } = require("../middlewares/Authmiddlewares");

router.post("/addmessage", authMiddleware("access"), addMessage);
router.post("/getmessage", authMiddleware("access"), getMessages);
router.post("/creategroup", authMiddleware("access"), createGroup);
router.get("/getgroups", authMiddleware("access"), getGroups);
router.post("/addmembertogroup", authMiddleware("access"), addMemberToGroup);
router.get("/count-last-7-days", authMiddleware("access"), isStaff, getMessagesCountLast7Days);


module.exports = router;
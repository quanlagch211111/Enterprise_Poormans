const { addMessage, getMessages, createGroup, getGroups, addMemberToGroup } = require("../controllers/messageController");
const router = require("express").Router();
const { authMiddleware } = require('../middlewares/Authmiddlewares');

router.post("/addmessage", authMiddleware("access"), addMessage);
router.post("/getmessage", authMiddleware("access"), getMessages);
router.post("/creategroup", authMiddleware("access"), createGroup);
router.get("/getgroups", authMiddleware("access"), getGroups);
router.post("/addmembertogroup", authMiddleware("access"), addMemberToGroup);

module.exports = router;
const express = require("express");
const router = express.Router();
//const axios = require("axios");
const db = require("../db.js");

const cors = require("cors");
router.use(
  cors({
    origin: true, //process.env.URL_CLIENT,
    credentials: true,
    //allowedHeaders: "Content-Type, Authorization",
  })
);
router.use(express.json());

router.post("/conversation", async (req, res) => {
  const { senderId, receiverId, senderImg, receiverImg } = req.body;

  const sender = await db.Users.findOne({
    where: {
      id: senderId,
    },
  });
  const receiver = await db.Users.findOne({
    where: {
      id: receiverId,
    },
  });
  const userCreated = await db.Conversations.create({
    senderId: senderId,
    senderName: sender.name,
    senderImg: senderImg,
    receiverId: receiverId,
    receiverName: receiver.name,
    receiverImg: receiverImg,
  });
  res.json(userCreated);
});

router.get("/conversation/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    console.log(userId);
    const conversation1 = await db.Conversations.findAll({
      where: {
        senderId: userId,
      },
    });
    const conversation2 = await db.Conversations.findAll({
      where: {
        receiverId: userId,
      },
    });
    const conversation = conversation1.concat(conversation2);
    console.log(conversation);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

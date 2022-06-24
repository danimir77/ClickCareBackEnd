const express = require("express");
const router = express.Router();
//const axios = require("axios");
//const { Message } = require("../db");

const cors = require("cors");
router.use(
  cors({
    origin: true, //process.env.URL_CLIENT,
    credentials: true,
    //allowedHeaders: "Content-Type, Authorization",
  })
);
router.use(express.json());

router.post("/message", async (req, res) => {
  const { text, conversationId, sender } = req.body;
  try {
    const mensaje = await db.Message.create({
      text: text,
      conversationId: conversationId,
      sender: sender,
    });
    res.status(200).json(mensaje);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/allmessage/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const allmessage = await db.Message.findAll({
      where: {
        conversationId: conversationId,
      },
    });
    res.status(200).json(allmessage);
  } catch (err) {
    res.send(error);
  }
});

module.exports = router;

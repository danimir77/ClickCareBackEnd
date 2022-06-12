// const router = require("express").Router();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db.js");
const { sendSimpleEmail } = require("../nodemailer/nodemailer.js");

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

router.get("/userValidationProcess/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Where? -->>", req.url);
  console.log("id", id);
  if (!id || !isNumeric(id)) {
    return res.status(400).json({
      error: "information required for user validation",
    });
  }
  const userFound = await db.Users.findOne({
    where: {
      id: id,
    },
    raw: true,
  });
  if (!userFound) {
    return res.status(401).json({
      error: "User not found",
    });
  }
  if (userFound.validated_email) {
    console.log("userFound", userFound);
    return res.status(201).json({
      error: "That mail was already validated",
    });
  }
  await db.Users.update(
    {
      validated_email: true,
    },
    {
      where: {
        id: id,
      },
    }
  );
  sendSimpleEmail(
    userFound.email,
    "ClickCare - User Validation",
    "Your email was successfully validated. Thank you for using ClickCare.",
    userFound.name,
    userFound.surname
  );
  return res.status(200).json({
    message: "User validated",
  });
});

module.exports = router;

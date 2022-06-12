const router = require("express").Router();
const passport = require("../passport/passport.js");
const bcrypt = require("bcrypt");
const { sendEmailToValidate } = require("../nodemailer/nodemailer.js");

const db = require("../db.js");

console.log("ENTRO a userResendValidationEmail.js");

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

router.get("/userResendValidationEmail/:id", async (req, res) => {
  console.log("Where? -->>", req.url);
  const { id } = req.params;
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
    return res.status(404).json({
      error: "User not found",
    });
  }
  const { email, name, surname } = userFound;
  console.log(email, id, name, surname);
  sendEmailToValidate(email, id, name, surname);
  res.status(200).json({
    message: "Validation email sent",
  });
});

module.exports = router;

const { Router } = require("express");
const express = require("express");
const db = require("../db");
const passport = require("../passport/passport.js");
const bcrypt = require("bcrypt");
const { sendEmailToValidate } = require("../nodemailer/nodemailer.js");
//https://www.npmjs.com/package/validator
const { userValidationRules, validate } = require("../middleware/validator.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.post(
  "/userdbRegistration",
  userValidationRules(),
  validate,
  async (req, res) => {
    console.log("Where? -->>", req.url);
    try {
      const {
        email,
        password,
        name,
        surname,
        phone,
        address,
        age,
        document,
        phone2,
        state,
        city,
        country,
      } = req.body;

      const hash = bcrypt.hashSync(password, 10);
      const [userCreated, created] = await db.Users.findOrCreate({
        where: { email: email },
        defaults: {
          email: email,
          password: hash,
          name: name,
          surname: surname,
          phone: phone,
          address: address,
          age: age,
          document: document,
          phone2: phone2,
          stateId: state
            ? (
                await db.States.findOne({ where: { name: state } })
              )?.id
            : null,
          cityId: city
            ? (
                await db.Cities.findOne({ where: { name: city } })
              )?.id
            : null,
          countryId: country
            ? (
                await db.Countries.findOne({ where: { name: country } })
              )?.id
            : null,
        },
      });
      let mensaje = {};

      if (created) {
        mensaje = { message: "User created" };

        const { id, email, name, surname } = userCreated;
        sendEmailToValidate(email, id, name, surname);
      } else {
        mensaje = { message: "User existent" };
      }

      res.status(201).json(mensaje);
    } catch (e) {
      res.send(e);
    }
  }
);

module.exports = router;

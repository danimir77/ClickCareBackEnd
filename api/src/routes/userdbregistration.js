const { Router } = require("express");
const express = require("express");
const db = require("../db");
const passport = require("../passport/passport.js");
const bcrypt = require("bcrypt");
const multer = require("multer");
const mimeTypes = require("mime-types");
const storage = multer.diskStorage({
  destination: "C:/Users/Usuario/Desktop/prueba_imagenes/",
  filename: function (req, file, cb) {
    cb("", file.originalname + "." + mimeTypes.extension(file.mimetype));
  },
});
const upload = multer({ storage: storage });

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
        photo,
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
          photo: photo,
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
        mensaje = { userCreated: userCreated.id, message: "User created" };

        const { id, email, name, surname } = userCreated;
        res.status(201).json(mensaje);
        sendEmailToValidate(email, id, name, surname);
      } else {
        mensaje = { message: "User existent" };
        res.status(422).json(mensaje);
      }
    } catch (e) {
      res.send(e);
    }
  }
);

router.post("/upload", upload.single("image"), (req, res, next) => {
  res.send("todo bien");
});

module.exports = router;

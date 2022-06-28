const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const db = require("../db.js");
const bcrypt = require("bcrypt");
const cors = require("cors");
const {
  userValidForgetPassword,
  userValidationRules,
  validate,
} = require("../middleware/validator.js");
router.use(
  cors({
    origin: true, //process.env.URL_CLIENT,
    credentials: true,
    //allowedHeaders: "Content-Type, Authorization",
  })
);

router.put("/edituser", userValidationRules(), validate, async (req, res) => {
  const {
    id,
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

  try {
    const userFinded = await db.Users.findOne({
      where: { id: id },
    });
    if (userFinded) {
      const hash = bcrypt.hashSync(password, 10);
      await userFinded.update({
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
      });
    }
    res.status(200).send("Se modificaron los datos correctamente");
  } catch {
    res
      .status(400)
      .send("El mail ingresado no se encuetra en la base de datos");
  }
});

router.put(
  "/forgetpassword",
  userValidForgetPassword(),
  validate,
  async (req, res) => {
    try {
      const { email, document, password } = req.body;
      if (!document) {
        return res.status(400).send("No ingresó un documento válido");
      }
      if (!email) {
        return res.status(400).send("No ingresó un email");
      }
      if (!password) {
        return res.status(400).send("No ingresó un password");
      }

      const hash = bcrypt.hashSync(password, 10);
      await db.Users.update(
        {
          password: hash,
        },
        {
          where: {
            [Op.and]: [
              { email: email },
              { document: document },
              { active: true },
            ],
          },
        }
      );
      return res.status(200).send("Password modificado");
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

module.exports = router;

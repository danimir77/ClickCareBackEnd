const express = require("express");
const router = express.Router();
const db = require("../db.js");
const bcrypt = require("bcrypt");

router.put("/edituser", async (req, res) => {
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

  try {
    const userFinded = await db.Users.findOne({
      where: { email: email },
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

module.exports = router;

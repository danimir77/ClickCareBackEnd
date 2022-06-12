const { Router } = require("express");
const express = require("express");
const db = require("../db.js");
const bcrypt = require("bcrypt");
const cors = require("cors");
const router = Router();
router.use(cors());
router.use(express.json());

router.put("/editprofessional", async (req, res) => {
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
    userId, //id_user
    tuition,
    trainings,
    photo,
    cvu,
    state,
    city,
    country,
  } = req.body;

  try {
    const hash = bcrypt.hashSync(password, 10);

    const stateId = state
      ? (await db.States.findOne({ where: { name: state } }))?.id_country
      : null;
    const cityId = city
      ? (await db.Cities.findOne({ where: { name: city } }))?.id_state
      : null;
    const countryId = country
      ? (await db.Cities.findOne({ where: { name: country } }))?.id
      : null;

    const profFinded = await db.Professionals.findOne({
      where: { userId: userId },
    });
    const userFinded = await db.Users.findOne({
      where: { id: userId },
    });
    Promise.all([profFinded, userFinded]).then((res1, res2) => {
      if (res1[0]) {
        profFinded.update({
          tuition: tuition,
          trainings: trainings,
          photo: photo,
          cvu: cvu,
        });
      }
      if (res1[1]) {
        userFinded.update({
          email: email,
          password: hash,
          name: name,
          surname: surname,
          phone: phone,
          address: address,
          age: age,
          document: document,
          phone2: phone2,
          stateId: stateId,
          cityId: cityId,
          countryId: countryId,
        });
      }
      res.status(200).send("Se modificaron los datos correctamente");
    });
  } catch {
    res
      .status(400)
      .send("El mail ingresado no se encuetra en la base de datos");
  }
});

module.exports = router;

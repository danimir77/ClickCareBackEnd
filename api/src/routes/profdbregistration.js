const { Router } = require("express");
const express = require("express");
const passport = require("../passport/passport.js");
const db = require("../db.js");
const { sendEmailToValidate } = require("../nodemailer/nodemailer.js");
//https://www.npmjs.com/package/validator
const { profValidationRules, validate } = require("../middleware/validator.js");

//----
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());
//----
console.log("ENTRO A profdbregistration.js");

router.post(
  "/profdbregistration",
  profValidationRules(),
  validate,
  async (req, res) => {
    console.log("Where? -->>", req.url);
    try {
      const {
        id_user,
        tuition,
        trainings,
        photo,
        cvu,
        nivelDeEstudio,
        institucion,
        titulo,
        date_inicioEstudio,
        date_finicioEstudio,
      } = req.body;
      const prodFound = await db.Users.findOne({
        where: {
          id: id_user,
        },
        raw: true,
      });
      if (prodFound) {
        await db.Professionals.create({
          tuition: tuition,
          trainings: trainings,
          photo: photo,
          cvu: cvu,
          userId: id_user,
          nivelDeEstudio: nivelDeEstudio,
          institucion: institucion,
          titulo: titulo,
          date_inicioEstudio: date_inicioEstudio,
          date_finicioEstudio: date_finicioEstudio,
        });
        const { id, email, name, surname } = prodFound;
        sendEmailToValidate(email, id, name, surname);
        res.status(201).json({ message: "Professional created" });
      } else {
        return res.status(401).json({
          error: "Professional No exists",
        });
      }
    } catch (e) {
      return res.status(401).json({
        error: e.message,
      });
    }
  }
);

module.exports = router;

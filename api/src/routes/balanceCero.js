const express = require("express");
const router = express.Router();
require("dotenv").config();
const db = require("../db.js");

router.put("/balanceCero", async function (req, res, next) {
  try {
    let { idPROFESIONAL } = req.body;
    //AXIOS OK -->> execute validation PUT Process
    const prof = await db.Professionals.findOne({
      where: { id: idPROFESIONAL },
    });
    if (!prof) {
      res.status(404).json({
        error: "Profesional no existe",
      });
    }
    prof.update({
      balance: 0,
      fecha_nacimiento: null,
    });
    res.status(200).json({
      message: `Membresía Profesional Anulada ID Prod:${idPROFESIONAL}`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;

const { Router } = require("express");
const router = require("./userdbregistration");
const db = require("../db.js");
const cors = require("cors");
router.use(cors());

const states = [
  "Misiones",
  "San Luis",
  "San Juan",
  "Entre Ríos",
  "Santa Cruz",
  "Río Negro",
  "Chubut",
  "Córdoba",
  "Mendoza",
  "La Rioja",
  "Catamarca",
  "La Pampa",
  "Santiago del Estero",
  "Corrientes",
  "Santa Fe",
  "Tucumán",
  "Neuquén",
  "Salta",
  "Chaco",
  "Formosa",
  "Jujuy",
  "Ciudad Autónoma de Buenos Aires",
  "Buenos Aires",
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
];

router.get("/states", async (req, res) => {
  const statesMaped = states.map((e) => e);
  statesMaped.forEach((p) => {
    // console.log(p);
    db.States.create({
      name: p,
    });
  });
  const states3 = await db.States.findAll();
  res.json(states3);
});

module.exports = router;

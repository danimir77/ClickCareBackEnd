const { Router } = require("express");
const express = require("express");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.post("/addspecialty", async (req, res) => {
  try {
    let obj = {
      specialities: {},
    };
    //Specialties
    obj.specialities = require("../JSONs/specialty.json").specialities;
    const { count, rows } = await db.Specialties.findAndCountAll();

    count === 0
      ? (await db.Specialties.bulkCreate(obj.specialities),
        (obj.specialities = ""),
        res.status(200).send("Specialties loaded"))
      : res.status(200).send("Specialties existing");
  } catch {
    res.status(400).json({ error: "During specialities Loaded to DB!" });
  }
});

router.get("/getspecialty", async (req, res) => {
  try {
    const specialty = await db.Specialties.findAll({
      attributes: ["id", "specialty"],
    });

    if (specialty.length > 0) {
      res.status(201).json(specialty);
    } else {
      res.status(422).json("Not found");
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;

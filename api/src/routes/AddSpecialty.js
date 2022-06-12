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

    await db.Specialties.bulkCreate(obj.specialities);
    obj.specialities = "";
    res.status(200).send("Specialties loaded");
  } catch {
    res.status(400).json({ error: "During specialities Loaded to DB!" });
  }
});

module.exports = router;

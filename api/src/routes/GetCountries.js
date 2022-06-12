const { Router } = require("express");
const express = require("express");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.get("/GetCountries", async (req, res) => {
  try {
    const contries = await db.Countries.findAll({
      attributes: ["name"],
    });
    res.status(200).json(contries);
  } catch {
    res.status(400).send("Error during GetCountries Process");
  }
});

module.exports = router;

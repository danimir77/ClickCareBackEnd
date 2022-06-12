const { Router } = require("express");
const express = require("express");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.post("/AddLocationsToDb", async (req, res) => {
  try {
    let obj = {
      countries: {},
      states: {},
      cities: {},
    };
    //COUNTRIES
    obj.countries = require("../JSONs/countries.json").countries;

    try {
      await db.Countries.bulkCreate(obj.countries);
      obj.countries = "";
    } catch (error) {
      res.status(400).json({ error: "During countries Loaded to DB!" });
    }

    //STATES
    obj.states = require("../JSONs/states.json").states;
    try {
      await db.States.bulkCreate(obj.states);
      obj.states = "";
    } catch (error) {
      res.status(400).json({ error: "During STATES Loaded to DB!" });
    }

    //CITIES
    obj.cities = require("../JSONs/cities.json").cities;
    try {
      await db.Cities.bulkCreate(obj.cities);
      obj = "";
      res
        .status(201)
        .send({ message: "Countryes States and Cities loaded in each TABLE!" });
    } catch (error) {
      res.status(400).json({ error: "During CITIES Loaded to DB!" });
    }
  } catch {
    res.status(400).send("Hubo un error ");
  }
});

module.exports = router;

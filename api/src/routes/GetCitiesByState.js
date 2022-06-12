const { Router } = require("express");
const express = require("express");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.get("/GetCitiesByState/:state", async (req, res) => {
  try {
    // Ageranges: ageranges,
    // Bankings: bankings,
    // Cities: cities,
    // Commissions: commissions,
    // Conditions: conditions,
    // Contracts: contracts,
    // Countries: countries,
    // Posts: posts,
    // Professionals: professionals,
    // Specialties: specialties,
    // States: states,
    // Taxes: taxes,
    // Users: users,
    const state = req.params.state;
    // console.log(state);
    if (state) {
      const cities = await db.States.findAll({
        where: { name: state },

        include: [
          {
            model: db.Cities,
            attributes: ["name"],
          },
        ],
      });
      res.status(200).json(cities);
    }
  } catch {
    res.status(400).send("Error during GetStatebyCountry Process");
  }
});

module.exports = router;

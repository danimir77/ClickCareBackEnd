const { Router } = require("express");
const express = require("express");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.get("/GetStatesByCountry/:country", async (req, res) => {
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
    const country = req.params.country;
    if (country) {
      const states = await db.Countries.findAll({
        where: { name: country },

        include: [
          {
            model: db.States,
            attributes: ["name"],
          },
        ],
      });
      res.status(200).json(states[0].states);
    }
  } catch {
    res.status(400).send("Error during GetStatebyCountry Process");
  }
});

module.exports = router;

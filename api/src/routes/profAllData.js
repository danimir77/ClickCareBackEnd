const { Router } = require("express");
const express = require("express");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.get("/professionals", async (req, res) => {
  try {
    const professional = await db.Professionals.findAll();

    if (professional.length > 0) {
      res.status(201).json(professional);
    } else {
      res.status(422).json("Not found");
    }
  } catch (e) {
    res.send(e);
  }
});

router.get("/professionalsById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id && Number.isInteger(parseInt(id))) {
      const professional = await db.Professionals.findAll({
        where: { id: id },
        include: [
          {
            model: db.Users,
            // required: true,
            include: [
              {
                model: db.Cities,
                attributes: ["name"],
                //required: true,
              },
              {
                model: db.States,
                attributes: ["name"],
                //required: true,
              },
              {
                model: db.Countries,
                attributes: ["name"],
                //required: true,
              },
            ],
          },
        ],
      });

      if (professional.length > 0) {
        res.status(201).json(professional);
      } else {
        res.status(422).json("Not found");
      }
    } else {
      res.status(422).send("No envió un ID");
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;

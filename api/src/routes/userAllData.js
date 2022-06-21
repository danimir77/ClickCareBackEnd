const { Router } = require("express");
const express = require("express");

const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.get("/users", async (req, res) => {
  try {
    const users = await db.Users.findAll({
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
    });

    if (users.length > 0) {
      res.status(201).json(users);
    } else {
      res.status(422).json("Not found");
    }
  } catch (e) {
    res.send(e);
  }
});

router.get("/user_professional", async (req, res) => {
  try {
    const usersProfessionals = await db.Users.findAll({
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
        {
          model: db.Professionals,
          // required: true,
        },
      ],
    });

    if (usersProfessionals.length > 0) {
      res.status(201).json(usersProfessionals);
    } else {
      res.status(422).json("Not found");
    }
  } catch (e) {
    res.send(e);
  }
});

router.get("/userDetalleById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id && Number.isInteger(parseInt(id))) {
      const usersProfessionals = await db.Users.findAll({
        where: { id: id },
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
          {
            model: db.Professionals,
            // required: true,
          },
        ],
      });

      if (usersProfessionals.length > 0) {
        res.status(201).json(usersProfessionals);
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

router.get("/userProfessionalByID/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id && Number.isInteger(parseInt(id))) {
      const usersProfessionals = await db.Users.findAll({
        where: { id: id },
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
          {
            model: db.Professionals,
            // required: true,
          },
        ],
      });

      if (usersProfessionals.length > 0) {
        res.status(201).json(usersProfessionals);
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

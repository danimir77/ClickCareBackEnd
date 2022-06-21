const { Router } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.post("/addContracts", async (req, res) => {
  try {
    const { date, offer, hour, postId, auctionsId } = req.body;
    const [contractCreates, created] = await db.Contracts.findOrCreate({
      where: {
        [Op.and]: [{ postId: postId }, { status: "active" }],
      },
      defaults: {
        date: date,
        price: offer,
        hour: hour,
        auctionsId: auctionsId,
        postsId: postsId,
      },
    });
    if (created) {
      await db.Auctions.update(
        {
          approved: true,
        },
        {
          where: {
            id: auctionsId,
          },
        }
      );
      res.status(200).send("Contract created");
    } else {
      res.status(422).send("Existing Contract ");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getContracts", async (req, res) => {
  try {
    const contracts = await db.Contracts.findAll({
      attributes: ["id", "price", "date", "hour", "postId"],
      include: [
        {
          model: db.Auctions,
          attributes: ["id", "offer", "comment", "approved"],

          include: [
            {
              model: db.Posts,
              attributes: [
                "date_post",
                "date_ini",
                "date_fin",
                "needs",
                "active",
                "locationReference",
                "contact_phone",
                "agePatient",
                "namePatient",
                "addressPatient",
              ],
              include: [
                {
                  model: db.Cities,
                  attributes: ["name"],
                },
                {
                  model: db.States,
                  attributes: ["name"],
                },
                {
                  model: db.Countries,
                  attributes: ["name"],
                },
                {
                  model: db.Users,
                  attributes: ["name", "surname", "email", "phone"],
                },
              ],
            },
            {
              model: db.Professionals,
              attributes: ["cvu", "photo"],
              include: [
                {
                  model: db.Users,
                  attributes: [
                    "name",
                    "surname",
                    "phone",
                    "age",
                    "document",
                    "email",
                  ],
                  include: [
                    {
                      model: db.Cities,
                      attributes: ["name"],
                    },
                    {
                      model: db.States,
                      attributes: ["name"],
                    },
                    {
                      model: db.Countries,
                      attributes: ["name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (contracts.length > 0) {
      res.status(201).json(contracts);
    } else {
      res.status(422).json("Not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/infoDetalleContracts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (id && Number.isInteger(parseInt(id))) {
      const contracts = await db.Contracts.findAll({
        where: { id: parseInt(id) },
        attributes: ["id", "price", "date", "hour", "postId"],
        include: [
          {
            model: db.Auctions,
            attributes: ["id", "offer", "comment", "approved"],

            include: [
              {
                model: db.Posts,
                attributes: [
                  "date_post",
                  "date_ini",
                  "date_fin",
                  "needs",
                  "active",
                  "locationReference",
                  "contact_phone",
                  "agePatient",
                  "namePatient",
                  "addressPatient",
                ],
                include: [
                  {
                    model: db.Cities,
                    attributes: ["name"],
                  },
                  {
                    model: db.States,
                    attributes: ["name"],
                  },
                  {
                    model: db.Countries,
                    attributes: ["name"],
                  },
                  {
                    model: db.Users,
                    attributes: ["name", "surname", "email", "phone"],
                  },
                ],
              },
              {
                model: db.Professionals,
                attributes: ["cvu", "photo"],
                include: [
                  {
                    model: db.Users,
                    attributes: [
                      "name",
                      "surname",
                      "phone",
                      "age",
                      "document",
                      "email",
                    ],
                    include: [
                      {
                        model: db.Cities,
                        attributes: ["name"],
                      },
                      {
                        model: db.States,
                        attributes: ["name"],
                      },
                      {
                        model: db.Countries,
                        attributes: ["name"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      if (contracts.length > 0) {
        res.status(201).json(contracts);
      } else {
        res.status(422).json("Not found");
      }
    } else {
      res.status(422).send("No envió un ID");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

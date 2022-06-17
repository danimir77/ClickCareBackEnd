const { Router } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.post("/Addpostulates", async (req, res) => {
  try {
    const { date, offer, comment, postId, professionalId, userId } = req.body;

    const [auctionCreated, created] = await db.Auctions.findOrCreate({
      where: {
        [Op.and]: [
          { postId: postId },
          { professionalId: professionalId },
          { userId: userId },
        ],
      },
      defaults: {
        date: date,
        offer: parseFloat(offer),
        comment: comment,
        postId: parseInt(postId),
        professionalId: parseInt(professionalId),
        userId: parseInt(userId),
      },
    });
    if (created) {
      res.status(200).send("Auction created");
    } else {
      res.status(422).send("Existing Auction ");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/traerPostByAuction/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      const posts = await db.Posts.findAll({
        where: { id: parseInt(id) },
        attributes: [
          "id",
          "hour_post",
          "date_post",
          "date_ini",
          "date_fin",
          "needs",
          "availableTime_0",
          "availableTime_1",
          "agePatient",
          "namePatient",
          "addressPatient",
          "locationReference",
          "contact_phone",
        ],
        include: [
          {
            model: db.Users,
            attributes: [
              "id",
              "name",
              "surname",
              "phone",
              "address",
              "age",
              "document",
              "email",
              "phone2",
            ],
            //required: true,
          },
          {
            model: db.Specialties,
            attributes: ["specialty"],
            //required: true,
          },
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
            //required: true,
          },
          {
            model: db.Auctions,
            attributes: ["date", "offer", "comment", "approved", "cancel"],
            include: [
              {
                model: db.Professionals,
                attributes: ["id", "trainings", "photo"],
                include: [
                  {
                    model: db.Users,
                    attributes: ["name", "surname", "age"],
                  },
                ],
              },
            ],
          },
        ],
      });
      res.status(201).json(posts);
    } else {
      res.status(422).send("No envió un ID");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/traerPostByProfessionals/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      const posts = await db.Auctions.findAll({
        where: { professionalId: id },
        attributes: ["id", "date", "offer", "comment"],
        include: [
          {
            model: db.Posts,
            attributes: [
              "date_post",
              "date_ini",
              "date_fin",
              "needs",
              "locationReference",
              "availableTime_0",
              "availableTime_1",
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
                //required: true,
              },
            ],
          },
        ],
      });

      res.status(201).json(posts);
    } else {
      res.status(422).send("No envió un ID");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

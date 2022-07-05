const { Router } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
const { sendAuctionEmail } = require("../nodemailer/nodemailer.js");

router.use(
  cors({
    origin: true, //process.env.URL_CLIENT,
    credentials: true,
    //allowedHeaders: "Content-Type, Authorization",
  })
);

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
      //busco el profesional por su id
      const professional = await db.Professionals.findOne({
        where: { id: professionalId },
      });
      //traigo las needs desde el posteo
      const post = await db.Posts.findOne({
        where: { id: postId },
        raw: true,
      });
      const users = await db.Users.findAll({
        where: { active: true },
        raw: true,
      });

      return Promise.all([professional, post, users]).then((res1, res2) => {
        // var profesional = res1[0];
        var posteo = res1[1];

        var usuario = res1[2].find((user) => user.id === posteo.userId);
        var profesional = res1[2].find((user) => user.id === res1[0].id);

        sendAuctionEmail(
          usuario.email,
          usuario.name,
          usuario.surname,
          offer,
          comment,
          profesional.name,
          profesional.surname,
          posteo.needs
        );
      });
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
              "photo",
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
            attributes: [
              "id",
              "date",
              "offer",
              "comment",
              "approved",
              "cancel",
            ],
            include: [
              {
                model: db.Professionals,
                attributes: ["id", "trainings"],
                include: [
                  {
                    model: db.Users,
                    attributes: ["name", "surname", "age", "photo"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (posts.length > 0) {
        res.status(201).json(posts);
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

      if (posts.length > 0) {
        res.status(201).json(posts);
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

router.get("/traerPostByProfessionalsByContract/:id", async (req, res) => {
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
            include: [
              {
                model: db.Contracts,
              },
            ],
          },
        ],
      });

      if (posts.length > 0) {
        res.status(201).json(posts);
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

router.get("/auctions", async (req, res) => {
  const auctions = await db.Auctions.findAll({});
  res.json(auctions);
});

router.get("/auctionsByProfessiona/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Number.isInteger(parseInt(id))) {
      return res.status(400).json("No ingresó id correcto");
    }

    const auctions = await db.Auctions.findAll({
      where: {
        [Op.and]: [{ cancel: 0 }, { professionalId: id }],
      },
      attributes: ["id", "approved", "date", "offer", "comment"],
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

        {
          model: db.Professionals,
        },
      ],
    });

    if (auctions.length > 0) {
      res.status(201).json(auctions);
    } else {
      res.status(422).json("Not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

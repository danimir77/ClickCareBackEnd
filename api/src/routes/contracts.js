const { Router } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(
  cors({
    origin: true,
    credentials: true,
    //allowedHeaders: "Content-Type, Authorization",
  })
);

router.post("/addContracts", async (req, res) => {
  try {
    const { date, offer, hour, postId, auctionId } = req.body;

    const [contractCreates, created] = await db.Contracts.findOrCreate({
      where: {
        [Op.and]: [{ postId: postId }, { status: "active" }],
      },
      defaults: {
        date: date,
        price: offer,
        hour: hour,
        auctionId: auctionId,
        postId: postId,
      },
    });
    if (created) {
      await db.Auctions.update(
        {
          approved: true,
        },
        {
          where: {
            id: auctionId,
          },
        }
      );
      await db.Posts.update(
        {
          active: false,
        },
        {
          where: {
            id: postId,
          },
        }
      );
      sender(postId, auctionId);
      res.status(200).send("Contract created");
    } else {
      res.status(422).send("Existing Contract ");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

const sender = async (postId, auctionId) => {
  try {
    const sender = await db.Users.findOne({
      where: {
        id: (
          await db.Posts.findOne({
            where: {
              id: postId,
            },
          })
        ).userId,
      },
    });
    const receiver = await db.Users.findOne({
      where: {
        id: (
          await db.Auctions.findOne({
            where: {
              id: auctionId,
            },
          })
        ).userId,
      },
    });
    const [userCreated, createdo] = await db.Conversations.findOrCreate({
      where: { senderId: sender.id, receiverId: receiver.id },
      defaults: {
        senderId: sender.id,
        senderName: sender.name,
        senderImg: sender.photo,
        receiverId: receiver.id,
        receiverName: receiver.name,
        receiverImg: receiver.photo,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

router.get("/getContracts", async (req, res) => {
  try {
    const contracts = await db.Contracts.findAll({
      attributes: [
        "id",
        "price",
        "date",
        "hour",
        "postId",
        "status",
        "paidout",
      ],
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
                  attributes: [
                    "id",
                    "name",
                    "surname",
                    "email",
                    "phone",
                    "photo",
                  ],
                },
              ],
            },
            {
              model: db.Professionals,
              attributes: ["id", "cvu"],
              include: [
                {
                  model: db.Users,
                  attributes: [
                    "id",
                    "name",
                    "surname",
                    "phone",
                    "age",
                    "document",
                    "email",
                    "photo",
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
        attributes: [
          "id",
          "price",
          "date",
          "hour",
          "postId",
          "status",
          "paidout",
        ],
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
                    attributes: [
                      "id",
                      "name",
                      "surname",
                      "email",
                      "phone",
                      "photo",
                    ],
                  },
                ],
              },
              {
                model: db.Professionals,
                attributes: ["id", "cvu"],
                include: [
                  {
                    model: db.Users,
                    attributes: [
                      "id",
                      "name",
                      "surname",
                      "phone",
                      "age",
                      "document",
                      "email",
                      "photo",
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

router.put("/score_a_Profesional", async (req, res) => {
  try {
    const { id, score, comments } = req.body;
    if (!id) {
      return res.status(400).send("No hay un  contrato seleccionado");
    }
    if (!score) {
      return res.status(400).send("No ingresó un score");
    }
    const scoreado = await db.Contracts.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ id: id }, { status: "activo" }],
          },
          {
            [Op.and]: [
              { id: id },
              { status: "terminado" },
              { score_professional: null },
            ],
          },
        ],
      },
    });

    if (scoreado) {
      await scoreado.update({
        score_professional: score,
        comments: comments,
      });
      return res
        .status(200)
        .send(`Socore de ${score} a professional por el usuario`);
    } else {
      return res
        .status(200)
        .send(`Ya fue calificado por el usuario y el contrato está terminado`);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/score_a_Usuario", async (req, res) => {
  try {
    const { id, score, comments } = req.body;
    if (!id) {
      return res.status(400).send("No hay un  contrato seleccionado");
    }
    if (!score) {
      return res.status(400).send("No ingresó un score");
    }
    const scoreado = await db.Contracts.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ id: id }, { status: "activo" }],
          },
          {
            [Op.and]: [
              { id: id },
              { status: "terminado" },
              { score_professional: null },
            ],
          },
        ],
      },
    });

    if (scoreado) {
      await scoreado.update({
        score_user: score,
        comments: comments,
      });
      return res
        .status(200)
        .send(`Socore de ${score} a usuario por el professional`);
    } else {
      return res
        .status(200)
        .send(
          `Ya fue calificado por el profesional y el contrato está terminado`
        );
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

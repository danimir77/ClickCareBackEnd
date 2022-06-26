const { Router } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

router.post("/postgenerator", async (req, res) => {
  try {
    const {
      date_post,
      hour_post,
      date_ini,
      date_fin,
      needs,
      active,
      locationReference,
      contact_phone,
      id_users,
      city,
      state,
      country,
      specialtyPatient,
      agePatient,
      namePatient,
      availableTime_0,
      availableTime_1,
      addressPatient,
    } = req.body;

    const [postCreated, created] = await db.Posts.findOrCreate({
      where: {
        [Op.and]: [{ userId: id_users }, { needs: needs }, { active: true }],
      },

      defaults: {
        date_post: date_post,
        hour_post: hour_post,
        date_ini: date_ini,
        date_fin: date_fin,
        needs: needs,
        active: active,
        locationReference: locationReference,
        contact_phone: contact_phone,
        userId: id_users,
        stateId: state
          ? (
              await db.States.findOne({ where: { name: state } })
            )?.id
          : null,
        cityId: city
          ? (
              await db.Cities.findOne({ where: { name: city } })
            )?.id
          : null,
        countryId: country
          ? (
              await db.Countries.findOne({ where: { name: country } })
            )?.id
          : null,
        specialtyId: specialtyPatient
          ? (
              await db.Specialties.findOne({
                where: { specialty: specialtyPatient },
              })
            )?.id
          : null,
        //raw: true,
        agePatient: agePatient,
        namePatient: namePatient,
        availableTime_0: availableTime_0,
        availableTime_1: availableTime_1,
        addressPatient: addressPatient,
      },
    });

    if (created) {
      res.status(200).send("Post created");
    } else {
      res.status(422).send("Existing Post ");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/infoDetallePost/:id", async (req, res) => {
  try {
    const id = req.params.id;

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
          "locationReference",
          "contact_phone",
          "addressPatient",
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

router.get("/infoCardPost", async (req, res) => {
  try {
    const posts = await db.Posts.findAll({
      where: { active: 1 },
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
      ],

      include: [
        {
          model: db.Users,
          attributes: ["id", "name", "surname", "age", "photo"],

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
      ],
    });

    if (posts.length > 0) {
      res.status(201).json(posts);
    } else {
      res.status(422).json("Not found");
    }
  } catch (error) {
    res.send(error);
  }
});

router.delete("/deletePost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Posts.destroy({
        where: {
          id: id,
        },
      });
      return res.status(200).send("Post deleted");
    } else {
      return res.status(400).json({
        error: "information required for post validation",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/activeFalsePost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      const postFound = await db.Posts.findOne({
        where: {
          id: id,
        },
        raw: true,
      });
      if (!postFound) {
        return res.status(401).json({
          error: "Post not found",
        });
      }
      await db.Posts.update(
        {
          active: false,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Active false");
    } else {
      return res.status(422).send("No se envió ID");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/activeTruePost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      const postFound = await db.Posts.findOne({
        where: {
          id: id,
        },
        raw: true,
      });
      if (!postFound) {
        return res.status(401).json({
          error: "Post not found",
        });
      }
      await db.Posts.update(
        {
          active: true,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Active true");
    } else {
      return res.status(422).send("No se envió ID");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/posteosUsersByUserID/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (id && Number.isInteger(parseInt(id))) {
      const postFound = await db.Posts.findAll({
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
          "locationReference",
          "contact_phone",
          "addressPatient",
        ],

        include: [
          {
            model: db.Users,
            where: { id: parseInt(id) },
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
            attributes: ["date", "offer", "comment", "approved", "cancel"],
            include: [
              {
                model: db.Professionals,
                attributes: ["id", "trainings"],
                // include: [
                //   {
                //     model: db.Users,
                //     attributes: ["name", "surname", "age"],
                //   },
                // ],
              },
            ],
          },
        ],
      });
      if (postFound.length > 0) {
        res.status(201).json(postFound);
      } else {
        res.status(422).json("Not found");
      }
    } else {
      return res.status(422).send("No se envió ID");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;

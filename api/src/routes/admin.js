const { Router } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const db = require("../db.js");
const router = Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());

//?----POSTS---------------------------------------
router.get("/AllpostsActive", async (req, res) => {
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
          attributes: ["id", "name", "surname", "age"],

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

router.get("/AllpostsCancel", async (req, res) => {
  try {
    const posts = await db.Posts.findAll({
      where: { active: 0 },
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
          attributes: ["id", "name", "surname", "age"],

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

router.put("/cancelPost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
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
      return res.status(200).send("Post cancel");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/activePost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
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
      return res.status(200).send("Post active");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//?--------------------------------------------------

//?**----USERS-----------------------------------
router.get("/AllusersActive", async (req, res) => {
  try {
    const users = await db.Users.findAll({
      where: { active: 1 },
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
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/AllusersCancel", async (req, res) => {
  try {
    const users = await db.Users.findAll({
      where: { active: 0 },
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
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/AllusersValidated_email", async (req, res) => {
  try {
    const users = await db.Users.findAll({
      where: { validated_email: 1 },
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
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/AllusersNOValidated_email", async (req, res) => {
  try {
    const users = await db.Users.findAll({
      where: { validated_email: 0 },
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
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/cancelUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Users.update(
        {
          active: false,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("User cancel");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/activeUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Users.update(
        {
          active: true,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("User active");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/validatedEmailUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Users.update(
        {
          validated_email: true,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("User validated Email");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/NOvalidatedEmailUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Users.update(
        {
          validated_email: false,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("User NO validated Email");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/userAdmin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Users.update(
        {
          userType: "admin",
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("User administrador");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/userUsuario/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Users.update(
        {
          userType: "usuario",
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("User sin permisos");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//?**---------------------------------------------

//?-----PROFESSIONALS------------------------------------
router.get("/AllprofessionalsActive", async (req, res) => {
  try {
    const professional = await db.Professionals.findAll({
      where: { active: true },
    });

    if (professional.length > 0) {
      res.status(201).json(professional);
    } else {
      res.status(422).json("Not found");
    }
  } catch (e) {
    res.send(e);
  }
});

router.get("/AllprofessionalsCancel", async (req, res) => {
  try {
    const professional = await db.Professionals.findAll({
      where: { active: false },
    });

    if (professional.length > 0) {
      res.status(201).json(professional);
    } else {
      res.status(422).json("Not found");
    }
  } catch (e) {
    res.send(e);
  }
});

router.put("/cancelProfessional/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Professionals.update(
        {
          active: false,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Professional cancel");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/activeProfessional/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Professionals.update(
        {
          active: true,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Professional actived");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/balance_0/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Professionals.update(
        {
          balance: 0,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Balance 0");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/balance_1/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Professionals.update(
        {
          balance: 1,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Balance 1");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//?---------------------------------------------------------------

//?**----CONTRACTS -------------------------------------
router.get("/AllContractsActivo", async (req, res) => {
  try {
    const contracts = await db.Contracts.findAll({
      where: { status: "activo" },
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
                  attributes: ["name", "surname", "email", "phone", "photo"],
                },
              ],
            },
            {
              model: db.Professionals,
              attributes: ["cvu"],
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
router.get("/AllContractsTerminado", async (req, res) => {
  try {
    const contracts = await db.Contracts.findAll({
      where: { status: "terminado" },
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
                  attributes: ["name", "surname", "email", "phone", "photo"],
                },
              ],
            },
            {
              model: db.Professionals,
              attributes: ["cvu"],
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
router.get("/AllContractsCancelado", async (req, res) => {
  try {
    const contracts = await db.Contracts.findAll({
      where: { status: "cancelado" },
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
                  attributes: ["name", "surname", "email", "phone", "photo"],
                },
              ],
            },
            {
              model: db.Professionals,
              attributes: ["cvu"],
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
router.put("/activoContract/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Contracts.update(
        {
          status: "activo",
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Contrato activo");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/terminadoContract/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Contracts.update(
        {
          status: "terminado",
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Contrato terminado");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/canceladoContract/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Contracts.update(
        {
          status: "cancelado",
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Contrato cancelado");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//?**-------------------------------------------------------

//?-----OFFERS-------------------------------------------
router.get("/AllAuctions", async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await db.Auctions.findAll({
      where: { cancel: 0 },
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

        {
          model: db.Professionals,
        },
      ],
    });

    if (posts.length > 0) {
      res.status(201).json(posts);
    } else {
      res.status(422).json("Not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/AllAuctionsNOApproved", async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await db.Auctions.findAll({
      where: { [Op.and]: [{ approved: 0 }, { cancel: 0 }] },
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

        {
          model: db.Professionals,
        },
      ],
    });

    if (posts.length > 0) {
      res.status(201).json(posts);
    } else {
      res.status(422).json("Not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/AllAuctionsApproved", async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await db.Auctions.findAll({
      where: { [Op.and]: [{ approved: 1 }, { cancel: 0 }] },
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

        {
          model: db.Professionals,
        },
      ],
    });

    if (posts.length > 0) {
      res.status(201).json(posts);
    } else {
      res.status(422).json("Not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/AllCancel", async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await db.Auctions.findAll({
      where: { cancel: 1 },
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

        {
          model: db.Professionals,
        },
      ],
    });

    if (posts.length > 0) {
      res.status(201).json(posts);
    } else {
      res.status(422).json("Not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/cancelAuction/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Auctions.update(
        {
          cancel: 1,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Oferta cancelada");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/activeAuction/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && Number.isInteger(parseInt(id))) {
      await db.Auctions.update(
        {
          cancel: 0,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send("Oferta activada");
    } else {
      return res.status(400).json({
        error: "no se envió id",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//?--------------------------------------------------------

module.exports = router;

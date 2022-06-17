// const router = require("express").Router();
const express = require("express");
const router = express.Router();
const passport = require("../passport/passport.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { userValidShortReg, validate } = require("../middleware/validator.js");
//----
const db = require("../db.js");
const cors = require("cors");
router.use(
  cors({
    origin: process.env.URL_CLIENT,
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);
router.use(cookieParser());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/userdblogin", userValidShortReg(), validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await db.Users.findOne({
      where: {
        email: email,
      },
      include: [
        {
          model: db.Cities,
          attributes: ["name"],
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
      raw: true,
    });

    if (!userFound) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    if (userFound.active === 0) {
      return res.status(401).json({ error: "User is inactive" });
    }
    if (userFound.validated_email === 0) {
      return res
        .status(401)
        .json({ error: "User email is not validated", id: userFound.id });
    }

    bcrypt.compare(password, userFound.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          error: "Error checking password",
        });
      }
      if (!result) {
        return res.status(401).json({ error: "Wrong password" });
      }
      // console.log("SEQUELIZE userFound", userFound);
      // TOKEN JWT
      const userInfoFront = {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
        lastname: userFound.lastname,
        phone: userFound.phone,
        address: userFound.address,
        // countryId: userFound.countryId,
        countryName: userFound["country.name"],
        city: userFound["city.name"],
        state: userFound["state.name"],
        professionalId: userFound["professionals.id"],
        professionalTuition: userFound["professionals.tuition"],
        professionalTrainings: userFound["professionals.trainings"],
        professionalActive: userFound["professionals.active"],
        professionalPhoto: userFound["professionals.photo"],
        professionalCvu: userFound["professionals.cvu"],
        professionalBalance: userFound["professionals.balance"],
        professionalCreatedAt: userFound["professionals.createdAt"],
        professionalUpdatedAt: userFound["professionals.updatedAt"],
      };
      // console.log("userInfoFront", userInfoFront);
      const tokenFront = jwt.sign(userInfoFront, process.env.TOKENKEY, {
        expiresIn: "3h",
      });
      const tokenBack = jwt.sign({ id: userFound.id }, process.env.TOKENKEY, {
        expiresIn: "3h",
      });

      // COOKIE BACKEND
      res.cookie("userBackend", tokenBack, {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000), //3 hours expiration
        httpOnly: true,
      });
      // COOKIE FRONTEND
      res.cookie(
        "SessionUserClickCare",
        { userId: userFound.id },
        {
          expires: new Date(Date.now() + 3 * 60 * 60 * 1000), //3 hours expiration
          httpOnly: false,
        }
      );

      // RESPONSE
      res.status(200).json({
        message: "Login success",
        token: tokenFront,
        // userInformation: userInfoFront,
      });
    });
  } catch (e) {
    return res.status(401).json({
      error: e,
    });
  }
});

//RUTA SOLO PARA PROBAR LECTURA DE COOKIE con jwt.verify
router.get("/cookieBackendRead", (req, res) => {
  try {
    console.log("req.cookies", req.cookies);
    const token = req.cookies.userBackend;
    const decoded = jwt.verify(token, process.env.TOKENKEY);

    console.log("decoded", decoded);

    res.status(200).json({
      message: "Cookie read",
    });
  } catch (e) {
    res.status(401).json({
      error: e,
    });
  }
});

module.exports = router;

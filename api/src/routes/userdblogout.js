// const router = require("express").Router();
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const cors = require("cors");
router.use(cors());

//----
router.use(cookieParser());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/userdblogout", async (req, res) => {
  try {
    res.clearCookie("userBackend");
    res.clearCookie("SessionUserClickCare");
    res.status(200).json({
      message: "Logout success",
    });
  } catch (e) {
    return res.status(401).json({
      error: e,
    });
  }
});

module.exports = router;

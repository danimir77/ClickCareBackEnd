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

    res.status(201).json(professional);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;

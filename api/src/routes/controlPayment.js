const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const db = require("../db.js");

const { ACCESS_TOKEN } = process.env;

//https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/retrieving-payments
router.get("/controlPayment", async function (req, res, next) {
  const { paymentId } = req.body;
  //https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/retrieving-payments#bookmark_buscar_pagos
  const url =
    "https://api.mercadopago.com/v1/payments/search?limit=50&sort=id&criteria=desc";

  // const url =
  // "https://api.mercadopago.com/v1/payments/search?id=23416886968";

  //PROCESO MERCADO PAGO
  try {
    await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      })
      .then((resp) => {
        if (resp.status < 300) {
          console.log("AXIOS RESP:", resp.status);

          const devolucion = resp.data.results.map((x) => ({
            id_Operacion: x.id,
            payerId: x.payer.id,
            monto: x.transaction_amount,
            status: x.status,
          }));
          // let arr4 = arr.map((x)=>({id:x.id,monto:x.transaction_amount,status:x.status}))

          // console.log(resp.data);
          res.status(200).json(devolucion);
        } else {
          res.status(406).json({
            error: "Problema al procesar MercadoPago. Status:" + resp.status,
          });
        }
      })
      .catch((err) => {
        res.status(404).json({
          error:
            "Problema al procesar MercadoPago. Status: AXIOS CATCH " +
            err.message,
        });
      });
  } catch (error) {
    console.log("AXIOS TRYCATCH:", error);
    res.status(500).json({
      error: "Problema trycatch" + err.message,
    });
  }
});

module.exports = router;

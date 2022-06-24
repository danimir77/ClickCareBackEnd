const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const db = require("../db.js");

const { ACCESS_TOKEN } = process.env;

router.put("/validatePremium", async function (req, res, next) {
  try {
    let { collection_id, collection_status, idPROFESIONAL } = req.body;

    // collection_id = "23416886968";
    // idPROFESIONAL = 5;

    const url = `https://api.mercadopago.com/v1/payments/search?id=${collection_id}`;

    //PROCESO MERCADO PAGO
    let processToValidate = false;
    await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      })
      .then((resp) => {
        // console.log(resp.status);
        console.log(resp.data);
        if (resp.data.paging.total === 0) {
          res
            .status(404)
            .json({ message: `El id ${collection_id} no se encuentra.` });
        }
        if (resp.data.results[0].status !== "approved") {
          res.status(401).json({
            error: `MercadoPago informa que el pago ${collection_id} no está aprobado. Status: AXIOS-IF`,
          });
        }
        processToValidate = true;
      })
      .catch((err) => {
        res.status(404).json({
          error:
            "Problema al procesar MercadoPago. Status: AXIOS CATCH " +
            err.message,
        });
      });

    //AXIOS OK -->> execute validation PUT Process
    if (processToValidate) {
      const prof = await db.Professionals.findOne({
        where: { id: idPROFESIONAL },
      });
      if (!prof) {
        res.status(404).json({
          error: "Profesional no existe",
        });
      }
      prof.update({
        balance: 1,
        fecha_nacimiento: new Date(),
      });

      res.status(200).json({ message: "Membresía Profesional Validada" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

//collection_id=23416886968
//collection_status=approved
//idPROFESIONAL........REDUX.

// /validatePremium
// {
//   collection_id: 23416886968,
//   collection_status: 'approved',
//   idPROFESIONAL_REDUX: 5,
// }
// // BALANCE = 1 --->> PROFESIONAL PUEDE CERRAR CONTRATO.

//https://felicitado/?collection_id=23416886968&collection_status=approved&payment_id=23416886968&status=approved&external_reference=null&payment_type=credit_card&merchant_order_id=5039914075&preference_id=1147082622-34dfac96-14e4-4517-9aa5-4b13b434e8d7&site_id=MLA&processing_mode=aggregator&merchant_account_id=null
// auto_return: "approved",
// notification_url: "https://www.myapp.com/info"

//success/?collection_id=23395909403&collection_status=approved&payment_id=23395909403&status=approved&external_reference=null&payment_type=credit_card&merchant_order_id=5034292498&preference_id=1147082622-160a0c4f-9705-4557-b4fc-6c25c9fcf439&site_id=MLA&processing_mode=aggregator&merchant_account_id=null

module.exports = router;

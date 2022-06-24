const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const db = require("../db.js");

const { ACCESS_TOKEN,RUTAS_MERCADOPAGO_SUCC,RUTAS_MERCADOPAGO_PEND,RUTAS_MERCADOPAGO_FAIL } = process.env;

router.post("/checkoutPayment", async function (req, res, next) {
  try {
    const { professionalId } = req.body;

    const profFinded = await db.Professionals.findOne({
      where: { id: professionalId },
      include: [
        {
          model: db.Users,
          // required: true,
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
        },
      ],
      raw: true,
      nest: true,
    }).catch((err) => {
      res.status(500).json({
        error: "AXIOS ERROR" + err.message,
      });
    });
    // console.log(profFinded);
    if (!profFinded) {
      return res.status(404).json({ error: "Profesional no existente." });
    }
    if (profFinded.active === 0) {
      return res.status(401).json({ error: "Profesional no Activo." });
    }
    if (profFinded.user.active === 0) {
      return res.status(401).json({ error: "Usuario no Activo." });
    }
    if (profFinded.user.validated_email === 0) {
      return res.status(401).json({ error: "Email del usuario no validado." });
    }
    if (profFinded.balance === 1) {
      return res
        .status(406)
        .json({ error: "Profesional con membresía vigente." });
    }

    // res.status(200).json(profFinded)
    // console.log(profFinded);
    //Si llega hasta aquí es porque Puede pagar.
    const url = "https://api.mercadopago.com/checkout/preferences";
    let datesFromTo = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toLocaleDateString("be-BY");

    const bodyToBeSent = {
      //   payer_email: "test_user_64324497@testuser.com",
      payer_email: profFinded.user.email, //Usuario de EMAIL valido para MercadoPago.
      items: [
        {
          title: "Membresía anual ClickCare",
          description: `Válido hasta el ${datesFromTo}`,
          // picture_url: 'http://www.myapp.com/myimage.jpg'
          // category_id:'xxxxxx',
          quantity: 1, //el unit_price es por trabajo.
          unit_price: 10000,
        },
      ],
      back_urls: {
        failure: RUTAS_MERCADOPAGO_FAIL,
        pending: RUTAS_MERCADOPAGO_PEND,
        success: RUTAS_MERCADOPAGO_SUCC,
      },

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
      auto_return: "approved",
      // notification_url: "https://www.myapp.com/info"
    };

    //success/?collection_id=23395909403&collection_status=approved&payment_id=23395909403&status=approved&external_reference=null&payment_type=credit_card&merchant_order_id=5034292498&preference_id=1147082622-160a0c4f-9705-4557-b4fc-6c25c9fcf439&site_id=MLA&processing_mode=aggregator&merchant_account_id=null

    //PROCESO MERCADO PAGO
    try {
      await axios
        .post(url, bodyToBeSent, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
        .then((resp) => {
          if (resp.status < 300) {
            //BALANCE 1 -->> sequelize /////////////////////////////////////////////////////////
            console.log(resp);
            console.log("AXIOS RESP:", resp.status);
            const information = {
              items: resp.data.items,
              redirectTo: resp.data.init_point,
            };
            res.status(201).json(information);
          } else {
            res.status(406).json({
              error: "Problema al procesar MercadoPago. Status:" + resp.status,
            });
          }
        })
        .catch((err) => {
          //   console.log("AXIOS CATCH:", err);
          res.status(404).json({
            error:
              "Problema al procesar MercadoPago. Status: AXIOS CATCH " +
              err.message,
          });
        });
    } catch (error) {
      console.log("AXIOS TRYCATCH:", error);
      res.status(500).json({
        error: "AXIOS TRYCATCH " + err.message,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "TRYCATCH GENERAL" + err.message,
    });
  }
});

// router.get("/subscription", function (req, res, next) {});
module.exports = router;

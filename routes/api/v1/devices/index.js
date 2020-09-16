let axios = require("axios");
require("dotenv").config();
let debug = require("debug")("debug");
let express = require("express");
let https = require("https");
let router = express.Router();
let checkQueryDevices = require("../../../../middleware/checkQueryDevices");
let errorValidator = require("../../../../middleware/errorValidator.js");
const { param,query, validationResult } = require("express-validator/check");


const INSTANCE = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});


router.get(
  "/:devEUI",
  [
    param("devEUI")
      .exists()
      .isHexadecimal()
      .withMessage("DevEUI should be hexadecimal")
      .isLength({ min: 16, max: 16 })
  ],
  checkQueryDevices,
  errorValidator,
  (req, res, next) => {
    INSTANCE.get(
      process.env.LORA_APP_SERVER_URL + "/api/devices/" + req.params.devEUI,
      {
        headers: { Authorization: req.loraToken },
        params: {
          devEUI: req.params.devEUI
        }
      }
    )
      .then(response => {
        req.monobj = {result:[response.data]};
        next();
      })
      .catch(error => {
        next(error);
      });
  },
  (req, res, next) => {
    res.status(200);
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    let count = Object.keys(req.monobj.result).length;
    let tmp = { devices: req.monobj};
    res.json(tmp);

  }
);

router.get(
  "/",
  [
    query("limit")
      .isInt()
      .optional()
      .withMessage("Limit should be a integer"),
    query("offset")
      .isInt()
      .optional()
      .withMessage("Offset should be a integer"),
    query("search")
      .optional()
  ],
  checkQueryDevices,
  errorValidator,
  (req, res, next) => {
    INSTANCE.get(
      process.env.LORA_APP_SERVER_URL + "/api/applications/1/devices",
      {
        headers: { Authorization: req.loraToken },
        params: {
          limit: req.query.limit,
          offset: req.query.offset,
          search: req.query.search
        }
      }
    )
      .then(response => {
        req.monobj = response.data;
        next();
      })
      .catch(error => {
        next(error);
      });
  },
  (req, res, next) => {
    res.status(200);
    let count = Object.keys(req.monobj.result).length;
    let tmp = { devices: req.monobj};
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.json(tmp);
  }
);

// Middleware de gestion d'erreur
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err, status: err.status });
});

module.exports = router;

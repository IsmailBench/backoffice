let axios = require('axios');
require('dotenv').config();
let debug = require('debug')('debug');
let express = require('express');
let https = require('https');
let router = express.Router();
let errorValidator = require('../../../../middleware/errorValidator.js');
const { query, validationResult } = require('express-validator/check');
let checkBodyGateways = require('../../../../middleware/checkBodyGateways.js');


const INSTANCE = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

router.get(
  '/:mac',
  query('mac').isMACAddress().withMessage('Should be a MAC adresse'),
   // Envoi des erreurs
  errorValidator,
  (req, res, next) => {
    INSTANCE.get(
      process.env.LORA_APP_SERVER_URL + '/api/gateways/' + req.params.mac,
      {
        headers: { Authorization: req.loraToken },
        params: {
          mac: req.params.mac,
        },
      }
    )
      .then((response) => {
        req.monobj = { result: [response.data] };
        next();
      })
      .catch((error) => {
        next(error);
      });
  },
  (req, res, next) => {
    res.status(200);
    res.setHeader('Last-Modified', new Date().toUTCString());
    let count = Object.keys(req.monobj.result).length;
    let tmp = { gateways: req.monobj, count: count };
    res.json(tmp);
  }
);

router.delete(
  "/:mac",
   // Envoi des erreurs
  errorValidator,
  (req,res,next)=>{
    INSTANCE.delete(
      process.env.LORA_APP_SERVER_URL + '/api/gateways/'+req.params.mac,
      {
        headers: { Authorization: req.loraToken },
      }
    ).then((response)=>{
      req.monobj = response.data;
      next()
    }).catch((error)=>{
      next(error)
    })
  },
  (req,res,next)=>{
    res.status(200);
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.json(req.monobj);
  }
)

router.post(
  '/',
  //Verif les saisis utilisateur
  checkBodyGateways,
   // Envoi des erreurs
  errorValidator,
  (req, res, next) => {
    INSTANCE.post(
      process.env.LORA_APP_SERVER_URL + '/api/gateways',
      {
        altitude: 0,
        chanelConfigurationID: '',
        description: new Date() + 'backoffice',
        name: req.body.name,
        mac: req.body.mac,
        latitude: 0,
        longitude: 0,
        networkServerID: process.env.NETWORK_SERVER_ID,
        organizationID: process.env.ORGANIZATION_ID,
        ping: true,
      },
      {
        headers: { Authorization: req.loraToken },
      }
    )
      .then((response) => {
        req.monobj = response.data;
        next();
      })
      .catch((error) => {
        next(error);
      });
  },
  (req, res, next) => {
    res.status(200);
    res.json(req.monobj);
  }
);

router.get(
  '/',
  query('limit').isInt().optional().withMessage('Limit should be a integer'),
  query('offset').isInt().optional().withMessage('Offset should be a integer'),
  query('organizationID').isInt().optional(),
   // Envoi des erreurs
  errorValidator,
  (req, res, next) => {
    INSTANCE.get(process.env.LORA_APP_SERVER_URL + '/api/gateways', {
      headers: { Authorization: req.loraToken },
      params: {
        limit: req.query.limit,
        offset: req.query.offset,
        search: req.query.organizationID,
      },
    })
      .then((response) => {
        req.monobj = response.data;
        next();
      })
      .catch((error) => {
        next(error);
      });
  },
  (req, res, next) => {
    res.status(200);
    res.setHeader('Last-Modified', new Date().toUTCString());
    let count = Object.keys(req.monobj.result).length;
    let tmp = { gateways: req.monobj, count: count };
    res.json(tmp);
  }
);

// Middleware de gestion d'erreur
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message, status: err.status });
});

module.exports = router;

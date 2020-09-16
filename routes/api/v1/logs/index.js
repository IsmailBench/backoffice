require ('dotenv').config ();
let debug = require ('debug') ('debug');
let express = require ('express');
let assert = require ('assert');
let atob = require ('atob');
let router = express.Router ();
const {query, validationResult} = require ('express-validator/check');
let checkQueryLogs = require ('../../../../middleware/checkQueryLogs');
let errorValidator = require ('../../../../middleware/errorValidator.js');
let createObj = require ('../../../../middleware/createObj.js');
let sendReq = require ('../../../../middleware/sendReq.js');

router.get (
  '/',
  //Vérification de la route
  query ('timeStart').toDate(),
  query ('timeEnd').optional().toDate().withMessage('timeEnd should be a valid ISO date'),
  query ('devUi').optional ().isHexadecimal ().withMessage ('devUi should be a Hexadecimal'),
  query ('type').optional ().isInt ().withMessage ('Type should be a Integer').isLength ({max: 1}).withMessage ("Type's lenght should be 1"),
  query ('limit').optional ().isInt ().withMessage ('Limit should be a number'),
  // Création des erreurs pour chaque cas possible
  checkQueryLogs,
  // Envoi des erreurs
  errorValidator,
  // Création de l'objet pour la requête
  createObj,
  // Préparation de la requête et envoi
  sendReq,
  (req, res, next) => {
    let count;
    count = req.resultLogs.length;
    res.status (200);
    res.setHeader ('Last-Modified', new Date ().toUTCString ());
    let tmp = {logs: req.resultLogs, count: count};
    res.json (tmp);
  }
);
// Middleware de gestion d'erreur
router.use ((err, req, res, next) => {
  res.status (err.status || 500);
  res.json ({error: err, status: err.status});
});

module.exports = router;

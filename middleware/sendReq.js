"use strict";
require("dotenv").config();
let debug = require("debug")("debug");



/**
 * Envoi de la requete a la base de donée et reception de la réponse
 * @param {*} dbo choix de la base de donée "kimo"
 * @param {*} req.resultLogs Variable utilisé pour transmettre les données de middleware en middleware
 * @param {*} req.query.limit Permet de définir le nombre de log renvoyé pour une requete
 */
module.exports = (req, res, next) => {
  let db = req.app.locals.db;
  let dbo = db.db("kimo");
  let limit = 10;
  req.query.limit === undefined ? limit : limit = req.query.limit;
  dbo
    .collection("server_logs")
    .find(req.monobj)
    .limit(+limit)
    .toArray((err, documents) => {
      req.resultLogs = documents;
      next();
    });
};

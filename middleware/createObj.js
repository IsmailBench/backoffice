"use strict";
require("dotenv").config();
let debug = require("debug")("debug");
/**
 * Crée l'objet qui sera traité par la base de donnée
 * @param {*} req.query.devUi L'identifiant de l'appreil emmeteur (héxadécimal de 16 caractères ex:"323831395f369016" )
 * @param {*} req.query.type  Type de message envoyé (0 OK ou 1 ERROR)
 * @param {*} req.query.timeStart Debut de l'intervalle (obligatoire)
 * @param {*} req.query.timeEnd Fin de l'intervalle (optionnel)
 * @param {*} req.query.rx  Type d'action effectué par l'appareil emmeteur au moment de l'envoi de donnée (ne peut etre que "data", "zerodata", "alldata")
 * @param {*} req.monobj  Objet final crée contenant les paramètres entré par l'utilisateur si il sont valides
 */
module.exports = (req, res, next) => {
  req.monobj = {};
  if (req.query.devEUI !== undefined) {
    req.monobj["meta.slave"] = req.query.devEUI;
  };
  if (req.query.type !== undefined) {
    req.monobj["meta.type"] = +req.query.type;
  };
  if (req.query.timeEnd === undefined) {
    req.monobj["timestamp"] = {
      $gt: new Date(req.query.timeStart)
    };
  };
  if (req.query.timeEnd !== undefined) {
    req.monobj["timestamp"] = {
      $gt: new Date(req.query.timeStart),
      $lt: new Date(req.query.timeEnd)
    };
  };
  if (req.query.rx !== undefined) {
    if (req.query.rx == "alldata") {
      req.monobj["meta.rx"] = {
        $gte: 3,
        $lte: 4
      };
    }
    if (req.query.rx == "data") {
      req.monobj["meta.rx"] = 3;
    }
    if (req.query.rx == "zerodata") {
      req.monobj["meta.rx"] = 4;
    }
  };
  next();
};

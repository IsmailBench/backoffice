"use strict";
/**
 * Vérifie les paramatrès saisie par l'utilisateur
 * @param {*} req.query.devUi L'identifiant de l'appreil emmeteur (héxadécimal de 16 caractères ex:"323831395f369016" )
 * @param {*} req.query.type  Type de message envoyé (0 OK ou 1 ERROR)
 * @param {*} req.query.timeStart Debut de l'intervalle de temps (obligatoire)
 * @param {*} req.query.timeEnd Fin de l'intervalle de temps (optionnel)
 * @param {*} req.query.rx  Type d'action effectué par l'appareil emmeteur au moment de l'envoi de donnée (ne peut etre que "data", "zerodata", "alldata")
 */
module.exports = (req, res, next) => {
  if (req.query.devEUI !== undefined) {
    if (req.query.devEUI.length != 16) {
      return next({
        message: "devEUI's length should be 16",
        status: 400
      });
    }
    if (req.query.type !== undefined) {
      return next({
        message: "If a devUi is enter, a type cannot be enter",
        status: 400
      });
    }
  }
  if (req.query.timeEnd !== undefined) {
    if (req.query.timeStart === undefined) {
      return next({
        message: "A timeStart should be enter with a timeEnd",
        status: 400
      });
    }
  }
  if (req.query.type !== undefined) {
    if (isNaN(req.query.type)) {
      return next({
        message: "Type should be a number",
        status: 400
      });
    }
    if (req.query.type > 1 || req.query.type < 0) {
      return next({
        message: "Type should be 0 or 1",
        status: 400
      });
    }
    if (req.query.timeStart == undefined) {
      return next({
        message: "A timeStart should be enter with a type",
        status: 400
      });
    }
    if (req.query.devUi !== undefined) {
      return next({
        message: "If a Type is enter, a devUi cannot be enter",
        status: 400
      });
    }
  }
  if (req.query.rx !== undefined) {
    if (
      req.query.rx !== "alldata" &&
      req.query.rx !== "data" &&
      req.query.rx !== "zerodata"
    ) {
      return next({
        message: "Rx should be alldata or data or zerodata",
        status: 400
      });
    }
  }
  next();
};

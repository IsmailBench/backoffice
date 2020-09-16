"use strict";
let regEx = /[0-9A-Fa-f]{6}/g;
let regEx2 = /[0-9]{11}[K][0-9]{9}/g;
/**
 * Vérifie les paramatrès saisie par l'utilisateur
 * @param {*} req.params.devEUI L'identifiant de l'appreil emmeteur (héxadécimal de 16 caractères ex:"323831395f369016" )
 * @param {*} req.query.search Peut etre soit un identifiant héxadecimal ou un identifiant autre . 
 * @param {*} req.query.offset debut de l'intervalle de recherche, la recherche ira de l'index offset a a l'index limit
 * @param {*} req.query.limit  Limite le nombre de devices demander a la base de donnée
 */
module.exports = (req, res, next) => {
  if ((req.params.devEUI !== undefined) && (req.params.devEUI !== "")) {
    if (req.params.devEUI.length < 16 || req.params.devEUI.length > 16) {
      return next({
        message: "devEUI's length should be equal to 16",
        status: 400
      });
    }
  }
  if (req.query.limit !== undefined && req.query.limit !== "") {
    if (req.query.limit < 0) {
      return next({
        message: "limit should be greater than 0",
        status: 400
      });
    }
    if (isNaN(req.query.limit)) {
      return next({
        message: "limit should be a number",
        status: 400
      });
    }
  }
  if (req.query.offset !== undefined && req.query.offset !== "") {
    if (req.query.offset < 0) {
      return next({
        message: "offset should be greater than 0",
        status: 400
      });
    }
    if (isNaN(req.query.offset)) {
      return next({
        message: "offset should be a number",
        status: 400
      });
    }
  }
  if (req.query.search !== undefined && req.query.search !== "") {
    if (!regEx.test(req.query.search) && !regEx2.test(req.query.search)) {
      if (!regEx.test(req.query.search)) {
        return next({
          message: "Enter a valid hexadecimal DevEUI ",
          status: 400
        });
      }
    }
  }
  next();
};

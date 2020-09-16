"use strict";
const { query, validationResult } = require("express-validator/check");
require("dotenv").config();
let debug = require("debug")("debug");
/**
 *  Verifie si il y a des erreurs
 * @param {*} error Objet possedant un status et un message
*/
module.exports = (req, res, next) => {
  let error = validationResult(req);
  if (!error.isEmpty()) {
    return next({
      status: 500,
      message: error.mapped()
    })
  }
  next();
};

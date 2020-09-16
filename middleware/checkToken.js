"use strict";
require("dotenv").config();
let debug = require("debug")("debug");
let jwt = require("jsonwebtoken");
let express = require("express");
let https = require("https");
let router = express.Router();
let axios = require("axios");

const INSTANCE = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

let token = null;
let validity = 0;

//verifie l'existence d'un token et sa durée d'expiration, dans le cas contraire crée le token
/**
 * 
 * @param {*} currentTime crée une variable a date a l'instant T 
 * @param {*} validity date d'expiration du token 
 * @param {*} decode token décodé
 * @param {*} req.loraToken variable utilisé pour faire passer le token de middleware en middleware
 * @param {*} INSTANCE crée une instance d'axios pour commyniquer a l'aide du protocole HTTPS
 */
module.exports = (req, res, next) => {
  let currentTime = Date.now() / 1000;
  if (validity < currentTime) {
    INSTANCE.post(process.env.LORA_APP_SERVER_URL + "/api/internal/login", {
      password: "admin",
      username: "admin"
    })
      .then(response => {
        token = response.data.jwt;
        req.loraToken = token ;
        let decode = jwt.decode(token);
        validity = decode.exp;
        next();
      })
      .catch(error => {
        next(error);
      });
  }
  else{
      req.loraToken = token;
      next();
  }
};

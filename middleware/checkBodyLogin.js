"use strict";

module.exports=(req, res, next) => {
    if (req.body.identifiant !== undefined) {
      if (req.body.identifiant.length < 6) {
        return next({
          status: 400,
          message: "identifiant's length should be at least 6 characteres"
        });
      }
      if (req.body.password === undefined) {
        return next({
          status: 400,
          message: "password need to be enter with a identifiant"
        });
      }
    }
    if (req.body.identifiant === undefined) {
      return next({
        status: 403,
        message: "A identifiant should be always enter"
      });
    }
    if (req.body.password === undefined) {
      return next({
        status: 403,
        message: "A password should be always enter"
      });
    }
    if (req.body.password.length < 6) {
      return next({
        status: 400,
        message: "password's length should be at least 6 characteres"
      });
    }
    next();
}
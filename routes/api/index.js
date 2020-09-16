require ('dotenv').config ();
let express = require ('express');
let router = express.Router ();
let passport = require ('passport');
let debug = require ('debug') ('debug');
const {query, validationResult} = require ('express-validator/check');
let jwt = require ('jsonwebtoken');
let checkBodyLogin = require ('../../middleware/checkBodyLogin');

router.post (
  '/login',
  checkBodyLogin,
  (req, res, next) => {
    req.obj = {
      identifiant: req.body.identifiant,
      password: req.body.password,
    };
    next ();
  },
  (req, res, next) => {
    token = jwt.sign (req.obj, 'KINGLEBRON', {
      audience: 'localhost',
      expiresIn: '1h',
    });
    res.status (200);
    res.end ();
  }
);

router.use (
  '/v1',
  //passport.authenticate("jwt", { session: false }), Non utilisé
  require ('./v1')
);

module.exports = router;

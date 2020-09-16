require("dotenv").config();
let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let MongoClient = require("mongodb").MongoClient;
let assert = require("assert");
let debug = require("debug")("debug");
let mongoSanitize = require("express-mongo-sanitize");
let validator = require("express-validator");
let jwt = require("jsonwebtoken");
var hbs = require('hbs');
var fs = require('fs');
let apiRouter = require("./routes/api");
var vue = require('vue')
let cors = require("cors")

let passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;

require("./hbs.init");

//Strategie authentification
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "KINGLEBRON";
opts.passReqToCallback = true;
passport.use(
  "jwt",
  new JwtStrategy(opts, (req, jwt_payload, done) => {
    return done (null, jwt_payload);
  })
);

let app = express();
//Gestion pool connection
MongoClient.connect(
  process.env.MONGO_URL,
  (err, db) => {
    if (err) throw err;
    app.locals.db = db;
  }
);
app.use(cors())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(__dirname + "/public"));
app.use(validator());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);




// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { error: err });
});
module.exports = app;

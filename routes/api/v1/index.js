let express = require('express');
let router = express.Router();
let checkToken = require("../../../middleware/checkToken")


/* GET  page. */
router.use('/logs', require('./logs'));
router.use("/devices",checkToken,require("./devices"));
router.use("/gateways",checkToken,require("./gateways"))

module.exports = router;

"use strict";

var express = require('express');

var router = express.Router();

var _require = require('./../middlewares/validation'),
    registerValidationRules = _require.registerValidationRules;

var clientController = require("./../controllers/client.controller"); //client register


router.post("/register", registerValidationRules(), clientController.register);
router.get("/testt", clientController.testt);
module.exports = router;
"use strict";

var express = require("express");

var router = express.Router();

var webhookController = require("./../controllers/webhook.controller"); // casio bet/win/refund webhook


router.post("/casino-webhook", webhookController.casinowebhook);
router.post("/casino-webhook-bal", webhookController.casinobalwebhook);
module.exports = router;
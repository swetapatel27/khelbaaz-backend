const express = require("express");
const router = express.Router();
const webhookController = require("./../controllers/webhook.controller");

// casio bet/win/refund webhook
router.post(
  "/casino-webhook",
  webhookController.casinowebhook
);

router.post(
  "/casino-webhook-bal",
  webhookController.casinobalwebhook
);

module.exports = router;

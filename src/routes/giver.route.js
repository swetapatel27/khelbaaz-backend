const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const giverController = require("./../controllers/giver.controller");

//get givers by role
router.get(
  "/get-givers/:creator_id/:role/:type?",
  isLoggedIn,
  giverController.getGiversByRole
);
//get givers for self by event id
router.get(
  "/get-self-givers/:creator_id/:event_id/:type?",
  isLoggedIn,
  giverController.getSelfGiversByEvent
);
//get receivers by role
router.get(
  "/get-receivers/:creator_id/:role/:type?",
  isLoggedIn,
  giverController.getReceiversByRole
);

// get receivers for self by event id
router.get(
  "/get-self-receivers/:creator_id/:event_id/:type?",
  isLoggedIn,
  giverController.getSelfReceiversByEvent
);

module.exports = router;

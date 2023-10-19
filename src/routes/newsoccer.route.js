const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const soccerController = require("./../controllers/newsoccer.controller");

router.get(
  "/soccer/test",
  // isLoggedIn,
  soccerController.testing
);


module.exports = router;

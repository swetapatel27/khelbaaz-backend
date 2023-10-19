const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/verify");
const teenpatti20Controller = require("../../controllers/casino/teenpatti20.controller");

router.get(
    "/get-teenpatti20",
    isLoggedIn,
    teenpatti20Controller.getTeenpatti20
  );
router.get(
  "/get-teenpatti20-result-history",
  isLoggedIn,
  teenpatti20Controller.getResultHistory
);

module.exports = router;

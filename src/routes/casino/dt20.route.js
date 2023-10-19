const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/verify");
const dt20Controller = require("../../controllers/casino/dt20.controller");

router.get("/get-dt20", isLoggedIn, dt20Controller.getDt20);
router.get(
  "/get-dt20-result-history",
  isLoggedIn,
  dt20Controller.getResultHistory
);

module.exports = router;

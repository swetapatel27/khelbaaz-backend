const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { isLoggedIn } = require("../middlewares/verify");

router.get(
  "/get-company-report/:creator_id/:event_id",
  isLoggedIn,
  reportController.getCompanyReport
);

router.get(
  "/get-agent-stats/:creator_id/:event_id",
  isLoggedIn,
  reportController.getAgentStats
);
module.exports = router;

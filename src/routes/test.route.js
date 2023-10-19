const express = require("express");
const router = express.Router();
const TestController = require("../controllers/test.controller");
const { getcompetitions, addMatchOdd } = require("../cron/matcheCron");

// router.get("/cron", addMatchOdd);
router.post("/test-tran", TestController.addTest);
router.post("/test-roll", TestController.rollBackResult);

module.exports = router;

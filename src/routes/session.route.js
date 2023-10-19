const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");

const sessionController = require("../controllers/session.controller");

router.get("/session/:event_id", isLoggedIn, sessionController.getSesionById);
router.get(
  "/test-session/:event_id",
  isLoggedIn,
  sessionController.getTestSessionById
);
router.patch("/session-active", isLoggedIn, sessionController.setSessionActive);
router.patch(
  "/session-suspend",
  isLoggedIn,
  sessionController.setSessionSuspend
);
router.get(
  "/check-session-change/:event_id/:runner_name/:type/:price",
  sessionController.checkSessionPriceChange
);

module.exports = router;

const express = require("express");
const router = express.Router();
const sessionBetsController = require("../controllers/sessionbets.controller");
const { isLoggedIn } = require("../middlewares/verify");
const sessionBetValidate = require("../middlewares/betValidation");

router.get(
  "/sessionbets-byevent/:event_id/:user_id",
  isLoggedIn,
  sessionBetsController.getSessionBetsByEventId
);
router.post(
  "/add-sessionbets",
  [isLoggedIn, sessionBetValidate.validateSessionBet],
  sessionBetsController.addSessionbets
);
// router.patch(
//   "/update-sessionbets",
//   isLoggedIn,
//   sessionBetsController.updateSessionBet
// );
router.get(
  "/get-sessionbets-byrunner",
  isLoggedIn,
  sessionBetsController.getSessionBetsByRunner
);
router.get(
  "/get-sessionbets-byuserid/:user_id",
  isLoggedIn,
  sessionBetsController.getSessionBetsByUserID
);

router.get(
  "/get-bethistory-byeventid/:event_id",
  isLoggedIn,
  sessionBetsController.getBetHistoryByEventId
);

router.get(
  "/get-sessionbethistory-byrunner/:runner_name/:event_id",
  isLoggedIn,
  sessionBetsController.getBetHistoryByRunner
);

//get session bets by date filter for current users
router.get(
  "/get-sessionbets-byfilter/:user_id/:from/:to",
  isLoggedIn,
  sessionBetsController.getSessionBetByDateFilter
);

//get open session bets by userid
router.get(
  "/get-opensessionbets/:user_id/:status?/:days?",
  isLoggedIn,
  sessionBetsController.getOpenSessionBets
);

//get open session bets by userid in admin
router.get(
  "/get-opensessionbets-inadmin/:user_id",
  isLoggedIn,
  sessionBetsController.getOpenSessionBetsInAdmin
);
module.exports = router;

//get bets list by event id based on admin user
router.get(
  "/get-sessionbetsplaced/:creator_id/:event_id",
  isLoggedIn,
  sessionBetsController.getSessionBetsPlaced
);

//get session exposure for each admin
router.get(
  "/get-admin-session-exp/:admin_id/:event_id",
  isLoggedIn,
  sessionBetsController.getSessionAdminExp
);

//get session bet by runnername, eventid and userid
router.get(
  "/get-session-byrunner-event/:user_id/:event_id/:runner_name",
  isLoggedIn,
  sessionBetsController.getSessionByRunnerEvent
);

//add and delete session bets to deletedsessionbets table
router.delete(
  "/delete-add-sessionbets/:event_id/:runner_name",
  isLoggedIn,
  sessionBetsController.addAndDeleteSessionBets
);

//delete selected session bets
router.delete(
  "/delete-selected-sessionbets",
  isLoggedIn,
  sessionBetsController.deleteSessionbets
);


module.exports = router;

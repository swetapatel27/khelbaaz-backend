const express = require("express");
const router = express.Router();
const soccerBetsController = require("../controllers/soccerbets.controller");
const { isLoggedIn } = require("../middlewares/verify");
const soccerBetValidate = require("../middlewares/betValidation");

//add soccer bets
router.post(
  "/add-soccerbet",
  [isLoggedIn, soccerBetValidate.validateMatchBet],
  soccerBetsController.addSoccerbets
);

//get matchbets by userid and event id
router.get(
  "/get-soccerbet-byeventid-foruser/:event_id/:user_id",
  isLoggedIn,
  soccerBetsController.getSoccerBetByEventIdByUserID
);

//get soccer bets by userid and eventId
router.get(
  "/soccerbets-byevent/:event_id/:user_id",
  isLoggedIn,
  soccerBetsController.getSoccerBetsByEventId
);
//get soccer bets list by event id based on admin user
router.get(
  "/get-soccerbetsplaced/:creator_id/:event_id",
  isLoggedIn,
  soccerBetsController.getSoccerBetsPlaced
);

//get all open soccer bets for user
router.get(
  "/get-opensoccerbets/:user_id/:status?/:days?",
  isLoggedIn,
  soccerBetsController.getOpenSoccerBets
);

//get all open soccer bets for user in admin
router.get(
  "/get-opensoccerbets-inadmin/:user_id",
  isLoggedIn,
  soccerBetsController.getOpenSoccerBetsInAdmin
);

//summation of exp_amount1,exp_amount2,exp_amount3 for specific event_id
router.get(
  "/get-soccer_sum_exp/:creator_id/:event_id",
  isLoggedIn,
  soccerBetsController.getSumExpBySoccerEvent
);

//eventwise summation of exposures for respective admin/agents but for inplay matches only
router.get(
  "/get-inplay-soccer_sum_exp/:creator_id",
  isLoggedIn,
  soccerBetsController.getSumExpInPlaySoccerEvents
);

//get exposure status of users for particular event for agents
router.get(
  "/get-user-soccer-expstatus/:creator_id/:event_id",
  isLoggedIn,
  soccerBetsController.getUserExpStatus
);
module.exports = router;

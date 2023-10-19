"use strict";

var express = require("express");

var router = express.Router();

var matchBetsController = require("../controllers/matchbets.controller");

var _require = require("../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var matchBetValidate = require("../middlewares/betValidation");

router.post("/add-matchbet", [isLoggedIn, matchBetValidate.validateMatchBet], matchBetsController.addMatchbets);
router.get("/matchbets-byevent/:event_id/:user_id", isLoggedIn, matchBetsController.getMatchBetsByEventId);
router.get("/get-matchbets-byuserid/:user_id", isLoggedIn, matchBetsController.getMatchBetsByUserID);
router.get("/get-matchbethistory-byeventid/:event_id", isLoggedIn, matchBetsController.getMatchBetHistoryByEventId); //get matchbets by userid and event id

router.get("/get-matchbet-byeventid-foruser/:event_id/:user_id", isLoggedIn, matchBetsController.getMatchBetByEventIdByUserID); //get matchbets by filtered for userid

router.get("/get-matchbet-byfilter/:user_id/:from/:to", isLoggedIn, matchBetsController.getMatchBetByFilter); //get open match bets by userid

router.get("/get-openmatchbets/:user_id/:status?/:days?", isLoggedIn, matchBetsController.getOpenMatchBets); //get open match bets by userid in admin

router.get("/get-openmatchbets-inadmin/:user_id", isLoggedIn, matchBetsController.getOpenMatchBetsInadmin); //get match list for placed bets only

router.get("/get-betplaced_matches", isLoggedIn, matchBetsController.getBetPlacedMatches); //get bets list by event id based on admin user

router.get("/get-matchbetsplaced/:creator_id/:event_id", isLoggedIn, matchBetsController.getMatchBetsPlaced); //get exposure for each admin

router.get("/get-admin-exp/:admin_id/:event_id", isLoggedIn, matchBetsController.getAdminExp); // get latest bets of each user for admin

router.get("/get-latestbet/:creator_id/:event_id", isLoggedIn, matchBetsController.getLatestMatchBet); //summation of exp_amount1,exp_amount2,exp_amount3 for specific event_id

router.get("/get-match_sum_exp/:creator_id/:event_id", isLoggedIn, matchBetsController.getSumExpByEvent); //eventwise summation of exposures for respective admin/agents but for inplay matches only

router.get("/get-inplay-match_sum_exp/:creator_id", isLoggedIn, matchBetsController.getSumExpInPlayEvents); //get exposure status of users for particular event for agents

router.get("/get-user-expstatus/:creator_id/:event_id", isLoggedIn, matchBetsController.getUserExpStatus); //get all bets by event_id

router.get("/get-allmatchbets/:event_id", isLoggedIn, matchBetsController.getAllBetsByEventId); //delete selected match bets

router["delete"]("/delete-selected-matchbets", isLoggedIn, matchBetsController.deleteMatchbets); //test route for Match bets
// router.post(
//   "/add-bet",
//   matchBetValidate.validateMatchBet,
//   matchBetsController.testBet
// );

module.exports = router;
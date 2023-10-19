const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const matchBetValidate = require("../middlewares/betValidation");
const BookmakerBetController = require("../controllers/bookmakerbets.controller");

router.post(
  "/add-bookmakerbet",
  [isLoggedIn, matchBetValidate.validateBookmakerBet],
  isLoggedIn,
  BookmakerBetController.addBookmakerbet
);

router.get(
  "/allmatchbets-byevent/:event_id/:user_id",
  isLoggedIn,
  BookmakerBetController.getAllMatchBetsByEventId
);

router.get(
  "/bookmakerbets-byeventbyuser/:event_id/:user_id",
  isLoggedIn,
  BookmakerBetController.getBookBetByEventIdByUserID
);

//get bookmaker bets list by event id based on admin user
router.get(
  "/get-bookmakerbetsplaced/:creator_id/:event_id",
  isLoggedIn,
  BookmakerBetController.getBookmakerBetsPlaced
);

//summation of exp_amount1,exp_amount2,exp_amount3 for specific event_id
router.get(
  "/get-bookmaker_sum_exp/:creator_id/:event_id",
  isLoggedIn,
  BookmakerBetController.getBookmakerSumExpByEvent
);

//get open match bets by userid
router.get(
  "/get-openbookmakerbets/:user_id/:status?/:days?",
  isLoggedIn,
  BookmakerBetController.getOpenMatchBets
);

//get all open tennis bets for user in admin
router.get(
  "/get-openbookmakerbets-inadmin/:user_id",
  isLoggedIn,
  BookmakerBetController.getOpenBookmakerBetsInAdmin
);
module.exports = router;

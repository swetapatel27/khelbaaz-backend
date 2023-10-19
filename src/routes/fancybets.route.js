const express = require("express");
const router = express.Router();
const fancyBetsController = require("../controllers/fancybets.controller");
const { isLoggedIn } = require("../middlewares/verify");
const fancyBetValidate = require("../middlewares/betValidation");

//add fancy bets
router.post("/add-fancybet", [isLoggedIn], fancyBetsController.addFancybets);

//get matchbets by userid and event id
router.get(
  "/get-fancybet-byeventid-foruser/:event_id/:user_id",
  isLoggedIn,
  fancyBetsController.getFancyBetByEventIdByUserID
);

//get fancy bet by runnername, eventid and userid
router.get(
  "/get-fancy-byrunner-event/:user_id/:event_id/:runner_name",
  isLoggedIn,
  fancyBetsController.getFancyByRunnerEvent
);

//get fancy bets by userid and eventId
router.get(
  "/fancybets-byevent/:event_id/:user_id",
  isLoggedIn,
  fancyBetsController.getFancyBetsByEventId
);
//get fancy bets list by event id based on admin user
router.get(
  "/get-fancybetsplaced/:creator_id/:event_id",
  isLoggedIn,
  fancyBetsController.getFancyBetsPlaced
);

//get all open fancy bets for user
router.get(
  "/get-openfancybets/:user_id/:status?/:days?",
  isLoggedIn,
  fancyBetsController.getOpenFancyBets
);

//get fancy exposure for each admin
router.get(
  "/get-admin-fancy-exp/:admin_id/:event_id",
  isLoggedIn,
  fancyBetsController.getFancyAdminExp
);

//get all open fancy bets for user in admin
router.get(
  "/get-openfancybets-inadmin/:user_id",
  isLoggedIn,
  fancyBetsController.getOpenFancyBetsInAdmin
);

//summation of exp_amount1,exp_amount2,exp_amount3 for specific event_id
router.get(
  "/get-fancy_sum_exp/:creator_id/:event_id",
  isLoggedIn,
  fancyBetsController.getSumExpByFancyEvent
);

//eventwise summation of exposures for respective admin/agents but for inplay matches only
router.get(
  "/get-inplay-fancy_sum_exp/:creator_id",
  isLoggedIn,
  fancyBetsController.getSumExpInPlayFancyEvents
);

//get exposure status of users for particular event for agents
router.get(
  "/get-user-fancy-expstatus/:creator_id/:event_id",
  isLoggedIn,
  fancyBetsController.getUserExpStatus
);

//add and delete fancy bets to deletedfancybets table
router.delete(
  "/delete-add-fancybets/:event_id/:runner_name",
  isLoggedIn,
  fancyBetsController.addAndDeleteFancyBets
);
module.exports = router;

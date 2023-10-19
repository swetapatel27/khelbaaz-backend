"use strict";

var express = require("express");

var router = express.Router();

var tennisBetsController = require("../controllers/tennisbets.controller");

var _require = require("../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var tennisBetValidate = require("../middlewares/betValidation"); //add tennis bets


router.post("/add-tennisbet", [isLoggedIn, tennisBetValidate.validateMatchBet], tennisBetsController.addTennisbets); //get matchbets by userid and event id

router.get("/get-tennisbet-byeventid-foruser/:event_id/:user_id", isLoggedIn, tennisBetsController.getTennisBetByEventIdByUserID); //get tennis bets by userid and eventId

router.get("/tennisbets-byevent/:event_id/:user_id", isLoggedIn, tennisBetsController.getTennisBetsByEventId); //get tennis bets list by event id based on admin user

router.get("/get-tennisbetsplaced/:creator_id/:event_id", isLoggedIn, tennisBetsController.getTennisBetsPlaced); //get all open tennis bets for user

router.get("/get-opentennisbets/:user_id/:status?/:days?", isLoggedIn, tennisBetsController.getOpenTennisBets); //get all open tennis bets for user in admin

router.get("/get-opentennisbets-inadmin/:user_id", isLoggedIn, tennisBetsController.getOpenTennisBetsInAdmin); //summation of exp_amount1,exp_amount2,exp_amount3 for specific event_id

router.get("/get-tennis_sum_exp/:creator_id/:event_id", isLoggedIn, tennisBetsController.getSumExpByTennisEvent); //eventwise summation of exposures for respective admin/agents but for inplay matches only

router.get("/get-inplay-tennis_sum_exp/:creator_id", isLoggedIn, tennisBetsController.getSumExpInPlayTennisEvents); //get exposure status of users for particular event for agents

router.get("/get-user-tennis-expstatus/:creator_id/:event_id", isLoggedIn, tennisBetsController.getUserExpStatus);
module.exports = router;
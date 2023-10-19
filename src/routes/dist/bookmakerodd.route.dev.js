"use strict";

var express = require("express");

var router = express.Router();

var BookmakerController = require("../controllers/bookmaker.controller");

var _require = require("../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var matchBetValidate = require("../middlewares/betValidation");

router.get("/get-booklist", BookmakerController.getBookList);
router.get("/book-maker/:event_id", isLoggedIn, BookmakerController.getBookmakers);
router.get("/check-bookmaker-change/:market_id/:runner_name/:type/:price", BookmakerController.checkBookmakerPriceChange);
router.post("/add-bookmakerbet", //[isLoggedIn, matchBetValidate.validateBookmakerBet],
isLoggedIn, BookmakerController.addBookmaketbet);
router.get("/bookmakerbets-byevent/:event_id/:user_id", isLoggedIn, BookmakerController.getBookmakerBetsByEventId);
router.get("/get-inplay-bookmaker_sum_exp/:creator_id", isLoggedIn, BookmakerController.getSumExpInPlayEvents);
router.get("/get-book_sum_exp/:creator_id/:event_id", isLoggedIn, BookmakerController.getSumExpByEvent);
router.get("/markets", isLoggedIn, BookmakerController.getBookmakerslist);
router.get("/book-maker-byevent/:event_id", isLoggedIn, BookmakerController.getBookMakerByEvent);
router.get("/get-bookbetsplaced/:creator_id/:event_id", isLoggedIn, BookmakerController.getBookBetsPlaced);
router.patch("/bookmark-suspend", isLoggedIn, BookmakerController.setBookMakerSuspend);
module.exports = router;
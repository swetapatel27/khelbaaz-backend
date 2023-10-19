"use strict";

var express = require("express");

var router = express.Router();

var exposureController = require("../controllers/exposure.controller");

var _require = require("../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

router.post("/add-exposure", isLoggedIn, exposureController.addExposure);
router.get("/get-exposure/:user_id", isLoggedIn, exposureController.getExposureByUserId);
router.get("/get-exposure-byrunner/:user_id/:runner_name", isLoggedIn, exposureController.getExposureByRunner);
router.get("/get-exposureamt-byrunnergrp/:user_id/:event_id", isLoggedIn, exposureController.getExposureAmtByGroup);
router.get("/get-allsessionexposure/:user_id/", isLoggedIn, exposureController.getAllSessionExposure);
router.get("/get-allmatchexposure/:user_id/", isLoggedIn, exposureController.getAllMatchExposure); //get total exp admin wise

router.get("/get-total_exp/:creator_id/", isLoggedIn, exposureController.getTotalAdminExposure);
router.get("/get-fancyexposureamt-byrunnergrp/:user_id/:event_id", isLoggedIn, exposureController.getFancyExposureAmtByGroup);
router.get("/get-exposure-overview-inadmin/:user_id", isLoggedIn, exposureController.getExposureOverviewInAdmin); //get all undeclared sessions

router.get("/get-undeclared-session", isLoggedIn, exposureController.getAllUndeclaredSession); //get all undeclared fancy

router.get("/get-undeclared-fancy", isLoggedIn, exposureController.getAllUndeclaredFancy); //get all undeclared bookmaker

router.get("/get-undeclared-bookmaker", isLoggedIn, exposureController.getAllUndeclaredBookmaker);
module.exports = router;
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const videoController = require("../controllers/video.controller");

router.get("/get-video", videoController.getVideo);
module.exports = router;

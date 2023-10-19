"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var imageController = require("../controllers/images.controller");

var multer = require("multer");

var path = require("path");

var storage = multer.diskStorage({
  destination: function destination(req, file, callBack) {
    callBack(null, "./public/images/"); // './public/images/' directory name where save the file
  },
  filename: function filename(req, file, callBack) {
    callBack(null, file.fieldname + "Banner-" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
router.post("/upload-banner", isLoggedIn, upload.array("files", 10), imageController.uploadBanner);
router.get("/get-banner", isLoggedIn, imageController.getBanner);
router["delete"]("/delete-banner/:id", isLoggedIn, imageController.deleteBanner);
module.exports = router;
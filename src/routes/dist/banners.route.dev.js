"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var bannerController = require("../controllers/banners.controller");

var multer = require("multer");

var path = require("path");

var storage = multer.diskStorage({
  destination: function destination(req, file, callBack) {
    callBack(null, "./public/banners/"); // './public/banners/' directory name where save the file
  },
  filename: function filename(req, file, callBack) {
    callBack(null, file.fieldname + "Banner-" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
router.post("/upload-frontbanner", isLoggedIn, upload.array("files", 10), bannerController.uploadBanner);
router.put("/update-frontbanner/:id", isLoggedIn, upload.single("files"), bannerController.updateBanner);
router.get("/get-frontbanner", bannerController.getBanner);
router["delete"]("/delete-frontbanner/:id", isLoggedIn, bannerController.deleteBanner);
module.exports = router;
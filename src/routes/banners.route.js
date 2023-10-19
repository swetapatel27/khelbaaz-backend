const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const bannerController = require("../controllers/banners.controller");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/banners/"); // './public/banners/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "Banner-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
});

router.post(
  "/upload-frontbanner",
  isLoggedIn,
  upload.array("files", 10),
  bannerController.uploadBanner
);

router.put(
  "/update-frontbanner/:id",
  isLoggedIn,
  upload.single("files"),
  bannerController.updateBanner
);

router.get("/get-frontbanner", bannerController.getBanner);
router.delete(
  "/delete-frontbanner/:id",
  isLoggedIn,
  bannerController.deleteBanner
);

module.exports = router;

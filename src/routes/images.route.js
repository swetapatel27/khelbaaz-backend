const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const imageController = require("../controllers/images.controller");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/images/"); // './public/images/' directory name where save the file
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
  "/upload-banner",
  isLoggedIn,
  upload.array("files", 10),
  imageController.uploadBanner
);

router.get("/get-banner", imageController.getBanner);
router.delete("/delete-banner/:id", isLoggedIn, imageController.deleteBanner);

module.exports = router;

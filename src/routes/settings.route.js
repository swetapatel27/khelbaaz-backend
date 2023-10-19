const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const settingController = require("../controllers/settings.controller");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "./public/popup/"); // './public/banners/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(
        null,
        file.fieldname + "Popup-" + Date.now() + path.extname(file.originalname)
        );
    },
});

var upload = multer({
    storage: storage,
});

router.post("/add-popupform",upload.single("files"), settingController.addPopup);
router.get("/get-popup", settingController.getPopup);
module.exports = router;

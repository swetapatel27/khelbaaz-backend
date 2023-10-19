const express = require("express");
const router = express.Router();
const Version = require("../version/version");

router.get("/get-version", Version.getVersion);

module.exports = router;

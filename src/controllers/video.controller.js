const Video = require("../models/video");
exports.getVideo = async function (req, res) {
  try {
    const name = "sweta";
    res.render("video", { name });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data", err);
  }
};

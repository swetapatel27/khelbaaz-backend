const Score = require("../models/score");

exports.getScoreById = async function (req, res) {
  try {
    const data = await Score.getScoreById(req.params.event_id);
    res.send(data.data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

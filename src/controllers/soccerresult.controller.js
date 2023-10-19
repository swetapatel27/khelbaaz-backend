const soccerResult = require("../models/soccerresult");

exports.addSoccerResult = async function (req, res) {
  try {
    console.log("soccer_bet------------->", req.body);
    const result = new soccerResult(req.body.session_details);
    const manual_session = req.body.manual_session;
    console.log("soccer_result--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await soccerResult.addSoccerResult(result, manual_session);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.rollBackSoccerResult = async function (req, res) {
  try {
    const result = new soccerResult(req.body);
    console.log("roleback_soccer--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await soccerResult.rollBackSoccerResult(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getSoccerAllBetsPL = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const all_bets_pl = await soccerResult.getSoccerAllBetsPL(user_id);
    res.status(200).send(all_bets_pl);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

const tennisResult = require("../models/tennisresult");

exports.addTennisResult = async function (req, res) {
  try {
    console.log("tennis_bet------------->", req.body);
    const result = new tennisResult(req.body.session_details);
    const manual_session = req.body.manual_session;
    console.log("tennis_result--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await tennisResult.addTennisResult(result, manual_session);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.rollBackTennisResult = async function (req, res) {
  try {
    const result = new tennisResult(req.body);
    console.log("roleback_tennis--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await tennisResult.rollBackTennisResult(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getTennisAllBetsPL = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const all_bets_pl = await tennisResult.getTennisAllBetsPL(user_id);
    res.status(200).send(all_bets_pl);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

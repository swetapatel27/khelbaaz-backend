const fancyResult = require("../models/fancyresult");

exports.addFancyResult = async function (req, res) {
  try {
    console.log('fancy_bet---->',req.body);
    const result = new fancyResult(req.body.session_details);
    const manual_session = req.body.manual_session;
    console.log('fancy_result---->',result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await fancyResult.addFancyResult(result, manual_session);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.rollBackFancyResult = async function (req, res) {
  try {
    const result = new fancyResult(req.body);
    console.log("result_data--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await fancyResult.rollBackFancyResult(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getFancyAllBetsPL = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const all_bets_pl = await fancyResult.getFancyAllBetsPL(user_id);
    res.status(200).send(all_bets_pl);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

const bookmakerResult = require("../models/bookmakeresult");

exports.addBookmakerResult = async function (req, res) {
  try {
    //console.log("data------------->", req.body);
    console.log('bookmaker_bet---->',req.body);
    const result = new bookmakerResult(req.body.session_details);
    console.log('matchodds_result---->',result);
    const manual_session = req.body.manual_session;
    //console.log("result_data--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await bookmakerResult.addBookmakerResult(
        result,
        manual_session
      );
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.rollBackBookmakerResult = async function (req, res) {
  try {
    const result = new bookmakerResult(req.body);
    console.log("result_data--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await bookmakerResult.rollBackBookmakerResult(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getBookmakerAllBetsPL = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const all_bets_pl = await bookmakerResult.getBookmakerAllBetsPL(user_id);
    res.status(200).send(all_bets_pl);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

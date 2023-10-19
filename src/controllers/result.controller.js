const Result = require("../models/result");

exports.addResult = async function (req, res) {
  try {
    console.log('matchodds_bet---->',req.body);
    //console.log("data------------->", req.body);
    const result = new Result(req.body.session_details);
    console.log('matchodds_result---->',result);
    const manual_session = req.body.manual_session;
    //console.log("result_data--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Result.addResult(result, manual_session);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.rollBackResult = async function (req, res) {
  try {
    const result = new Result(req.body);
    console.log("roleback_match--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Result.rollBackResult(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.declareDraw = async function (req, res) {
  try {
    const result = new Result(req.body);
    console.log("declareDraw--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Result.declareDraw(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.clearBookResults = async function (req, res) {
  try {
    const result = new Result(req.body);
    console.log("result_data--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Result.clearBookmaker(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAllBetsPL = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const all_bets_pl = await Result.getAllBetsPL(user_id);
    res.status(200).send(all_bets_pl);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAllBetsPLOverview = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const all_bets_pl_overview = await Result.getAllBetsPLOverview(user_id);
    res.status(200).send(all_bets_pl_overview);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

const TennisOdd = require("../models/tennisodd");

exports.getTennisOdds = async function (req, res) {
  try {
    const data = await TennisOdd.getTennisOdds();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getTennistoddByMarketId = async function (req, res) {
  try {
    const data = await TennisOdd.getTennistoddByMarketId(req.params.market_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getTennisOddByEvent = async function (req, res) {
  try {
    const data = await TennisOdd.getTennisOddByEvent(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

// tennis active
exports.setTennisOddActive = async function (req, res) {
  try {
    const data = await TennisOdd.setTennisOddActive(
      req.body.market_id,
      req.body.is_active,
      req.body.col
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

//tennis suspend
exports.setTennisOddSuspend = async function (req, res) {
  try {
    const data = await TennisOdd.setTennisOddSuspend(
      req.body.market_id,
      req.body.is_suspended,
      req.body.col
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.checkTennisOddPriceChange = async function (req, res) {
  try {
    const market_id = req.params.market_id;
    const runner_name = req.params.runner_name;
    const type = req.params.type;
    const price = req.params.price;

    const data = await TennisOdd.checkTennisOddPriceChange(
      market_id,
      runner_name,
      type,
      price
    );
    console.log("change--->", { change: data });
    res.send({ change: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

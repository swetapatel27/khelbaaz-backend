const SoccerOdd = require("../models/soccerodds");

exports.getSoccerOdds = async function (req, res) {
  try {
    const data = await SoccerOdd.getSoccerOdds();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getSoccertoddByMarketId = async function (req, res) {
  try {
    const data = await SoccerOdd.getSoccertoddByMarketId(req.params.market_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getSoccerOddByEvent = async function (req, res) {
  try {
    const data = await SoccerOdd.getSoccerOddByEvent(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

// soccer active
exports.setSoccerOddActive = async function (req, res) {
  try {
    const data = await SoccerOdd.setSoccerOddActive(
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

//soccer suspend
exports.setSoccerOddSuspend = async function (req, res) {
  try {
    const data = await SoccerOdd.setSoccerOddSuspend(
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

exports.checkSoccerOddPriceChange = async function (req, res) {
  try {
    const market_id = req.params.market_id;
    const runner_name = req.params.runner_name;
    const type = req.params.type;
    const price = req.params.price;

    const data = await SoccerOdd.checkSoccerOddPriceChange(
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

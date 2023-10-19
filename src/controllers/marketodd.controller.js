const MarketOdd = require("../models/marketodd");

exports.getMarketOdds = async function (req, res) {
  try {
    const data = await MarketOdd.getMarketodds();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getMarketOdd = async function (req, res) {
  try {
    const data = await MarketOdd.getMarketodd(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getLiveMarketOdd = async function (req, res) {
  try {
    const data = await MarketOdd.getLiveMarketodd(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getMarketOddByEvent = async function (req, res) {
  try {
    const data = await MarketOdd.getMarketOddByEvent(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.setMarketOddActive = async function (req, res) {
  try {
    const data = await MarketOdd.setMarketOddActive(
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

exports.setMarketOddSuspend = async function (req, res) {
  try {
    const data = await MarketOdd.setMarketOddSuspend(
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

exports.addMarketTVLink = async function (req, res) {
  try {
    console.log("data-->", req.body.event_id);
    const data = await MarketOdd.addMarketTVLink(
      req.body.event_id,
      req.body.link
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.checkMatchOddPriceChange = async function (req, res) {
  try {
    const market_id = req.params.market_id;
    const runner_name = req.params.runner_name;
    const type = req.params.type;
    const price = req.params.price;

    const data = await MarketOdd.checkMatchOddPriceChange(
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

const BookmakerOdd = require("../models/bookmakerodds");

exports.getBookmakerodds = async function (req, res) {
  try {
    const data = await BookmakerOdd.getBookmakerodds(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.checkBookmakerPriceChange = async function (req, res) {
  try {
    const market_id = req.params.market_id;
    const runner_name = req.params.runner_name;
    const type = req.params.type;
    const price = req.params.price;

    const data = await BookmakerOdd.checkBookmakerPriceChange(
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

exports.setBookmakerOddSuspend = async function (req, res) {
  try {
    const data = await BookmakerOdd.setBookmakerOddSuspend(
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

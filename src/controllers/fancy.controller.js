const Fancy = require("../models/fancy");

exports.getSesionById = async function (req, res) {
  try {
    const data = await Fancy.getFancyById(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.setFancyActive = async function (req, res) {
  try {
    const data = await Fancy.setFancyActive(
      req.body.runner_name,
      req.body.is_active
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.setFancySuspend = async function (req, res) {
  try {
    const data = await Fancy.setFancySuspend(
      req.body.runner_name,
      req.body.is_suspended,
      req.body.event_id
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getTestFancyById = async function (req, res) {
  try {
    const data = await Fancy.getTestFancyById(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.checkFancyPriceChange = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const runner_name = req.params.runner_name;
    const type = req.params.type;
    const price = req.params.price;

    const data = await Fancy.checkOddChange(event_id, runner_name, type, price);
    console.log("change--->", { change: data });
    res.send({ change: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

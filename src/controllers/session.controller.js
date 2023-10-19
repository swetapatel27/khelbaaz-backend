const Session = require("../models/session");

exports.getSesionById = async function (req, res) {
  try {
    const data = await Session.getSessionById(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.setSessionActive = async function (req, res) {
  try {
    const data = await Session.setSessionActive(
      req.body.runner_name,
      req.body.is_active
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.setSessionSuspend = async function (req, res) {
  try {
    const data = await Session.setSessionSuspend(
      req.body.runner_name,
      req.body.is_suspended
    );
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getTestSessionById = async function (req, res) {
  try {
    const data = await Session.getTestSessionById(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.checkSessionPriceChange = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const runner_name = req.params.runner_name;
    const type = req.params.type;
    const price = req.params.price;

    const data = await Session.checkOddChange(
      event_id,
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

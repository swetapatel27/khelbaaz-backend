const Exposure = require("../models/exposure");

exports.addExposure = async function (req, res) {
  try {
    const exposure = new Exposure(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Exposure.addExposure(exposure);
      res.send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getExposureByUserId = async function (req, res) {
  try {
    const data = await Exposure.getExposureByUserId(req.params.user_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getExposureByRunner = async function (req, res) {
  try {
    const runner_name = req.params.runner_name;
    const user_id = req.params.user_id;
    const data = await Exposure.getExposureByRunner(user_id, runner_name);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getExposureAmtByGroup = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const event_id = req.params.event_id;
    const data = await Exposure.getExposureAmtByGroup(user_id, event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAllSessionExposure = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const data = await Exposure.getAllSessionExposure(user_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAllMatchExposure = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const data = await Exposure.getAllMatchExposure(user_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getTotalAdminExposure = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const total_exposure = await Exposure.getTotalAdminExposure(creator_id);
    res.send(total_exposure);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getFancyExposureAmtByGroup = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const event_id = req.params.event_id;
    const data = await Exposure.getFancyExposureAmtByGroup(user_id, event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
exports.getExposureOverviewInAdmin = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const data = await Exposure.getExposureOverviewInAdmin(user_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAllUndeclaredSession = async function (req, res) {
  try {
    const undeclared_sessions = await Exposure.getAllUndeclaredSession();
    res.status(200).send(undeclared_sessions);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAllUndeclaredFancy = async function (req, res) {
  try {
    const undeclared_fancy = await Exposure.getAllUndeclaredFancy();
    res.status(200).send(undeclared_fancy);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAllUndeclaredBookmaker = async function (req, res) {
  try {
    const undeclared_bookmaker = await Exposure.getAllUndeclaredBookmaker();
    res.status(200).send(undeclared_bookmaker);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
const Sessionbets = require("../models/sessionbets");

exports.addSessionbets = async function (req, res) {
  try {
    const sessionbet = new Sessionbets(req.body);
    const main_type = req.body.main_type;
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Sessionbets.addSessionBet(sessionbet, main_type);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.updateSessionBet = async function (req, res) {
  try {
    const sessionbet = new Sessionbets(req.body);
    sessionbet["exp_amount"] = req.body.exp_amount;
    sessionbet["is_switched"] = req.body.is_switched;
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Sessionbets.updateSessionBet(sessionbet);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getSessionBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const sessionbets = await Sessionbets.getSessionBetByEventId(
      event_id,
      user_id
    );
    res.send(sessionbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getSessionBetsByRunner = async function (req, res) {
  try {
    const runner_name = req.body.runner_name;
    const user_id = req.body.user_id;
    const sessionbets_runnername = await Sessionbets.getSessionBetsByRunner(
      user_id,
      runner_name
    );
    res.send(sessionbets_runnername);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getBetHistoryByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const sessionbets_histories = await Sessionbets.betHistoryByEventId(
      event_id
    );
    res.send(sessionbets_histories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getSessionBetsByUserID = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const sessionbets_byuserid = await Sessionbets.getSessionBetsByUserID(
      user_id
    );
    res.send(sessionbets_byuserid);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getBetHistoryByRunner = async function (req, res) {
  try {
    const runner_name = req.params.runner_name;
    const event_id = req.params.event_id;
    const sessionbets_byrunner = await Sessionbets.getBetHistoryByRunner(
      runner_name,
      event_id
    );
    res.send(sessionbets_byrunner);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getSessionBetByDateFilter = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const from = req.params.from;
    const to = req.params.to;
    const sessionbets = await Sessionbets.getSessionBetsByDateFilter(
      user_id,
      from,
      to
    );
    res.send(sessionbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getOpenSessionBetsInAdmin = async function (req, res) {
  try {
    const status = req.params.status;
    const user_id = req.params.user_id;

    const sessionbets = await Sessionbets.getOpenSessionBetsInAdmin(user_id,status);
    res.send(sessionbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getOpenSessionBets = async function (req, res) {
  try {
    const status = req.params.status;
    const days = req.params.days;
    const user_id = req.params.user_id;

    const sessionbets = await Sessionbets.getOpenSessionBets(user_id,status,days);
    res.send(sessionbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all bets by event id for each admin.
exports.getSessionBetsPlaced = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const betsplaced = await Sessionbets.getSessionBetsPlaced(
      creator_id,
      event_id
    );
    res.send(betsplaced);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getSessionAdminExp = async function (req, res) {
  try {
    const admin_id = req.params.admin_id;
    const event_id = req.params.event_id;
    const exposures = await Sessionbets.getSessionAdminExp(admin_id, event_id);
    res.send(exposures);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getSessionByRunnerEvent = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const event_id = req.params.event_id;
    const runner_name = req.params.runner_name;
    const exposures = await Sessionbets.getSessionByRunnerEvent(
      user_id,
      event_id,
      runner_name
    );
    res.send(exposures);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.addAndDeleteSessionBets = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const runner_name = req.params.runner_name;
    console.log("sas", req.params);
    const exposures = await Sessionbets.addAndDeleteSessionBets(
      event_id,
      runner_name
    );
    res.send(exposures);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
exports.deleteSessionbets = async function (req, res) {
  try {
    const itemIds = req.query.ids.split(",");
    const deleted_bets = await Sessionbets.deleteSessionbets(itemIds);
    res.send(deleted_bets);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};


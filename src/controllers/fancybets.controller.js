const FancyBets = require("../models/fancybets");

exports.addFancybets = async function (req, res) {
  try {
    const fancybet = new FancyBets(req.body);
    const main_type = req.body.main_type;
    const market_name = req.body.market_name;
    const enable_draw = req.body.enable_draw;
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await FancyBets.addFancyBet(
        fancybet,
        main_type,
        market_name,
        enable_draw
      );
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getFancyByRunnerEvent = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const event_id = req.params.event_id;
    const runner_name = req.params.runner_name;
    const exposures = await FancyBets.getFancyByRunnerEvent(
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

exports.getFancyAdminExp = async function (req, res) {
  try {
    const admin_id = req.params.admin_id;
    const event_id = req.params.event_id;
    const exposures = await FancyBets.getFancyAdminExp(admin_id, event_id);
    res.send(exposures);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getFancyBetByEventIdByUserID = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await FancyBets.getFancyBetByEventIdByUserID(
      event_id,
      user_id
    );
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getFancyBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await FancyBets.getFancyBetsByEventId(event_id, user_id);
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all bets by event id for each admin.
exports.getFancyBetsPlaced = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const betsplaced = await FancyBets.getFancyBetsPlaced(creator_id, event_id);
    res.send(betsplaced);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all open bets for user
exports.getOpenFancyBets = async function (req, res) {
  try {
    const status = req.params.status;
    const days = req.params.days;
    const user_id = req.params.user_id;
    const fancybets = await FancyBets.getOpenFancyBets(user_id,status,days);
    res.send(fancybets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};
//get all open bets for user in admin
exports.getOpenFancyBetsInAdmin = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const fancybets = await FancyBets.getOpenFancyBetsInAdmin(user_id);
    res.send(fancybets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//summation of exposures for specific event_id and respective admin/agents
exports.getSumExpByFancyEvent = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const sum_exposures = await FancyBets.getSumExpByFancyEvent(
      admin_id,
      event_id
    );
    res.send(sum_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//all eventwise summation of exposures for respective admin/agents but for inplay matches only
exports.getSumExpInPlayFancyEvents = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const sum_exposures = await FancyBets.getSumExpInPlayFancyEvents(admin_id);
    res.send(sum_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get exposure status of users for particular event for agents
exports.getUserExpStatus = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const user_exposures = await FancyBets.getUserExpStatus(admin_id, event_id);
    res.send(user_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.addAndDeleteFancyBets = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const runner_name = req.params.runner_name;
    console.log("sas", req.params);
    const exposures = await FancyBets.addAndDeleteFancyBets(
      event_id,
      runner_name
    );
    res.send(exposures);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

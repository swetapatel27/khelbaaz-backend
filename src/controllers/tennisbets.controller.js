const TennisBets = require("../models/tennisbets");

exports.addTennisbets = async function (req, res) {
  try {
    const tennisbet = new TennisBets(req.body);
    const main_type = req.body.main_type;
    const market_name = req.body.market_name;
    const enable_draw = req.body.enable_draw;
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await TennisBets.addTennisBet(
        tennisbet,
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

exports.getTennisBetByEventIdByUserID = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await TennisBets.getTennisBetByEventIdByUserID(
      event_id,
      user_id
    );
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getTennisBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await TennisBets.getTennisBetsByEventId(
      event_id,
      user_id
    );
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all bets by event id for each admin.
exports.getTennisBetsPlaced = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const betsplaced = await TennisBets.getTennisBetsPlaced(
      creator_id,
      event_id
    );
    res.send(betsplaced);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all open bets for user
exports.getOpenTennisBets = async function (req, res) {
  try {
    const status = req.params.status;
    const days = req.params.days;
    const user_id = req.params.user_id;
    const tennisbets = await TennisBets.getOpenTennisBets(user_id,status,days);
    res.send(tennisbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};
//get all open bets for user in admin
exports.getOpenTennisBetsInAdmin = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const tennisbets = await TennisBets.getOpenTennisBetsInAdmin(user_id);
    res.send(tennisbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//summation of exposures for specific event_id and respective admin/agents
exports.getSumExpByTennisEvent = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const sum_exposures = await TennisBets.getSumExpByTennisEvent(
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
exports.getSumExpInPlayTennisEvents = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const sum_exposures = await TennisBets.getSumExpInPlayTennisEvents(
      admin_id
    );
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
    const user_exposures = await TennisBets.getUserExpStatus(
      admin_id,
      event_id
    );
    res.send(user_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

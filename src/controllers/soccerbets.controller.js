const SoccerBets = require("../models/soccerbets");

exports.addSoccerbets = async function (req, res) {
  try {
    const soccerbet = new SoccerBets(req.body);
    const main_type = req.body.main_type;
    const market_name = req.body.market_name;
    const enable_draw = req.body.enable_draw;
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await SoccerBets.addSoccerBet(
        soccerbet,
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

exports.getSoccerBetByEventIdByUserID = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await SoccerBets.getSoccerBetByEventIdByUserID(
      event_id,
      user_id
    );
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getSoccerBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await SoccerBets.getSoccerBetsByEventId(
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
exports.getSoccerBetsPlaced = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const betsplaced = await SoccerBets.getSoccerBetsPlaced(
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
exports.getOpenSoccerBets = async function (req, res) {
  try {
    const status = req.params.status;
    const days = req.params.days;
    const user_id = req.params.user_id;
    const soccerbets = await SoccerBets.getOpenSoccerBets(user_id,status,days);
    res.send(soccerbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};
//get all open bets for user in admin
exports.getOpenSoccerBetsInAdmin = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const soccerbets = await SoccerBets.getOpenSoccerBetsInAdmin(user_id);
    res.send(soccerbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//summation of exposures for specific event_id and respective admin/agents
exports.getSumExpBySoccerEvent = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const sum_exposures = await SoccerBets.getSumExpBySoccerEvent(
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
exports.getSumExpInPlaySoccerEvents = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const sum_exposures = await SoccerBets.getSumExpInPlaySoccerEvents(
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
    const user_exposures = await SoccerBets.getUserExpStatus(
      admin_id,
      event_id
    );
    res.send(user_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

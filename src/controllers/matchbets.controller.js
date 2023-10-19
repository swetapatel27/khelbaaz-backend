const Matchbets = require("../models/matchbets");

exports.addMatchbets = async function (req, res) {
  try {
    const matchbet = new Matchbets(req.body);
    const main_type = req.body.main_type;
    const market_name = req.body.market_name;
    const enable_draw = req.body.enable_draw;

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Matchbets.addMatchBet(
        matchbet,
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

exports.getMatchBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await Matchbets.getMatchBetByEventId(event_id, user_id);
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getMatchBetsByUserID = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const matchbets_byuserid = await Matchbets.getMatchBetsByUserID(user_id);
    res.send(matchbets_byuserid);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getMatchBetHistoryByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const matchbets_byeventid = await Matchbets.getMatchBetHistoryByEventId(
      event_id
    );
    res.send(matchbets_byeventid);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getMatchBetByEventIdByUserID = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await Matchbets.getMatchBetByEventIdByUserID(
      event_id,
      user_id
    );
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getMatchBetByFilter = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const from = req.params.from;
    const to = req.params.to;
    const matchbets = await Matchbets.getMatchBetByFilter(user_id, from, to);
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getOpenMatchBetsInadmin = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const matchbets = await Matchbets.getOpenMatchBetsInadmin(user_id);
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getOpenMatchBets = async function (req, res) {
  try {
    const status = req.params.status;
    const days = req.params.days;
    const user_id = req.params.user_id;
    const matchbets = await Matchbets.getOpenMatchBets(user_id,status,days);
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getBetPlacedMatches = async function (req, res) {
  try {
    const betplaced_matches = await Matchbets.getBetPlacedMatches();
    res.send(betplaced_matches);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all bets by event id for each admin.
exports.getMatchBetsPlaced = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const betsplaced = await Matchbets.getMatchBetsPlaced(creator_id, event_id);
    res.send(betsplaced);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all latest for each user bets by event id for each admin.
exports.getLatestMatchBet = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const latestbetsplaced = await Matchbets.getLatestMatchBet(
      creator_id,
      event_id
    );
    res.send(latestbetsplaced);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getAdminExp = async function (req, res) {
  try {
    const admin_id = req.params.admin_id;
    const event_id = req.params.event_id;
    const exposures = await Matchbets.getAdminExp(admin_id, event_id);
    res.send(exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//summation of exposures for specific event_id and respective admin/agents
exports.getSumExpByEvent = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const sum_exposures = await Matchbets.getSumExpByEvent(admin_id, event_id);
    res.send(sum_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//all eventwise summation of exposures for respective admin/agents but for inplay matches only
exports.getSumExpInPlayEvents = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const sum_exposures = await Matchbets.getSumExpInPlayEvents(admin_id);
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
    const user_exposures = await Matchbets.getUserExpStatus(admin_id, event_id);
    res.send(user_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all matchbets by event id
exports.getAllBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const match_bets = await Matchbets.getAllBetsByEventId(event_id);
    res.send(match_bets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//delete specific matchbets
exports.deleteMatchbets = async function (req, res) {
  try {
    const itemIds = req.query.ids.split(",");
    const deleted_bets = await Matchbets.deleteMatchbets(itemIds);
    res.send(deleted_bets);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.testBet = async function (req, res) {
  console.log("in matchbet controller");
};

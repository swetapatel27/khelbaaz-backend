const BookmakerBets = require("../models/bookmakerbets");


exports.getOpenMatchBets = async function (req, res) {
  try {
    const status = req.params.status;
    const days = req.params.days;
    const user_id = req.params.user_id;
    const matchbets = await BookmakerBets.getOpenMatchBets(user_id,status,days);
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.addBookmakerbet = async function (req, res) {
  try {
    const matchbet = new BookmakerBets(req.body);
    const main_type = req.body.main_type;
    const market_name = req.body.market_name;
    const enable_draw = req.body.enable_draw;

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await BookmakerBets.addBookMakerBet(
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

exports.getAllMatchBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await BookmakerBets.getAllMatchBetsByEventId(
      event_id,
      user_id
    );
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getBookBetByEventIdByUserID = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const bookmakerbets = await BookmakerBets.getBookBetByEventIdByUserID(
      event_id,
      user_id
    );
    res.send(bookmakerbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all bets by event id for each admin.
exports.getBookmakerBetsPlaced = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const betsplaced = await BookmakerBets.getBookmakerBetsPlaced(
      creator_id,
      event_id
    );
    res.send(betsplaced);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//summation of exposures for specific event_id and respective admin/agents
exports.getBookmakerSumExpByEvent = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const sum_exposures = await BookmakerBets.getBookmakerSumExpByEvent(
      admin_id,
      event_id
    );
    res.send(sum_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get all open bets for user in admin
exports.getOpenBookmakerBetsInAdmin = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const bookmakerbets = await BookmakerBets.getOpenBookmakerBetsInAdmin(
      user_id
    );
    res.send(bookmakerbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

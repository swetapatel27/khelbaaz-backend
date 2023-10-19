const BookmakerOdd = require("../models/bookmakerodd");
const Bookmakerbet = require("../models/bookmakerbet");

exports.getBookmakerslist = async function (req, res) {
  try {
    const data = await BookmakerOdd.getBookmakerslist();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getBookmakers = async function (req, res) {
  try {
    const data = await BookmakerOdd.getBookmakers(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
}
exports.getBookList = async function (req, res) {
    try {
      const data = await BookmakerOdd.BookmakerList();
      //res.send(data);
    } catch (err) {
      console.log(err);
      //res.status(500).send("Error getting data");
    }
};

exports.getBokmakerOdds = async function (req, res) {
  try {
    const data = await BookmakerOdd.getMarketodds();
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

exports.addBookmaketbet = async function (req, res) {
  try {
    console.log("in match");
    const matchbet = new Bookmakerbet(req.body);
    const main_type = req.body.main_type;
    const market_name = req.body.market_name;
    const enable_draw = req.body.enable_draw;

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Bookmakerbet.addBookMaketBet(
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

exports.getBookmakerBetsByEventId = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    const matchbets = await Bookmakerbet.getBookmakerBetByEventId(event_id, user_id);
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getSumExpInPlayEvents = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const sum_exposures = await Bookmakerbet.getSumExpInPlayEvents(admin_id);
    res.send(sum_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getBookMakerByEvent = async function (req, res) {
  try {
    const data = await BookmakerOdd.getBookMakerByEvent(req.params.event_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getSumExpByEvent = async function (req, res) {
  try {
    const admin_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const sum_exposures = await Bookmakerbet.getSumExpByEvent(admin_id, event_id);
    res.send(sum_exposures);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getBookBetsPlaced = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const betsplaced = await Bookmakerbet.getBookBetsPlaced(creator_id, event_id);
    res.send(betsplaced);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.setBookMakerSuspend = async function (req, res) {
  try {
    const data = await Bookmakerbet.setBookMakerSuspend(
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
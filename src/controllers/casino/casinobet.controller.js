const CasinoBet = require("../../models/casino/casinobet");

exports.addCasinobets = async function (req, res) {
  try {
    console.log("body-->", req.body);
    const casinobet = new CasinoBet(req.body);

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await CasinoBet.addCasinooBet(casinobet);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getCasinoBetsByMarketId = async function (req, res) {
  try {
    const mid = req.params.mid;
    const user_id = req.params.user_id;
    const game_name = req.params.game_name;
    const matchbets = await CasinoBet.getCasinoBetsByMarketId(
      mid,
      user_id,
      game_name
    );
    res.send(matchbets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getLiveResultByMarket = async function (req, res) {
  try {
    const mid = req.params.mid;
    const result = await CasinoBet.getLiveResultByMarket(mid);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.declareResult = async function (req, res) {
  try {
    console.log("body--->", req.body.result);
    const data = req.body.result;
    const result = await CasinoBet.declareResult(data);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.declareCasinoAllResult = async function (req, res) {
  try {
    const result = await CasinoBet.declareCasinoAllResult();
    // res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getDeclaredBetsByFilter = async function (req, res) {
  try {
    const game_name = req.params.game_name;
    const user_id = req.params.user_id;
    const f_date = req.params.f_date;
    const result = await CasinoBet.getDeclaredBetsByFilter(
      game_name,
      user_id,
      f_date
    );
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getCasinoResultsInDB = async function (req, res) {
  try {
    const game_name = req.params.game_name;
    const f_date = req.params.f_date;
    const result = await CasinoBet.getCasinoResultsInDB(game_name, f_date);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

const Teenpatti20 = require("../../models/casino/teenpatti20");

exports.getTeenpatti20 = async function (req, res) {
    try {
      const data = await Teenpatti20.getTeenpatti20();
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error getting data");
    }
  };

  exports.getResultHistory = async function (req, res) {
  try {
    const data = await Teenpatti20.getResultHistory();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};


const Dt20 = require("../../models/casino/dt20");

exports.getDt20 = async function (req, res) {
  try {
    const data = await Dt20.getDt20();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getResultHistory = async function (req, res) {
  try {
    const data = await Dt20.getResultHistory();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

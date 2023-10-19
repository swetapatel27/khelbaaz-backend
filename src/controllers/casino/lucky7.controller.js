const Lucky7 = require("../../models/casino/lucky7");

exports.getLucky7 = async function (req, res) {
  try {
    const data = await Lucky7.getLucky7();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getResultHistory = async function (req, res) {
  try {
    const data = await Lucky7.getResultHistory();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

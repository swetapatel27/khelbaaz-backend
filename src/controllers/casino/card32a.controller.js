const Card32a = require("../../models/casino/card32a");

exports.getCard32a = async function (req, res) {
  try {
    const data = await Card32a.getCard32a();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getResultHistory = async function (req, res) {
  try {
    const data = await Card32a.getResultHistory();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

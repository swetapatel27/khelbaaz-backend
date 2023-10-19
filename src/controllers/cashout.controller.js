const Cashout = require("../models/cashout");
exports.addCashout = async function (req, res) {
  try {
    const cashout_details = req.body;
    console.log(cashout_details);
    const data = await Cashout.addCashout(cashout_details);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

const ClientLedger = require("../models/clientledger");

exports.getClientLedgerByDays = async function (req, res) {
  try {
    let user_id = req.params.user_id;
    let days = req.params.days;
    const data = await ClientLedger.getClientLedgerByDays(user_id, days);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
exports.getUserProfitLose = async function (req, res) {
  try {
    let user_id = req.params.user_id;
    const data = await ClientLedger.getUserProfitLose(user_id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

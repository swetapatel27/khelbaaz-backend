const Fees = require("../models/fees");

exports.addFees = async function (req, res) {
  try {
    let new_fees = new Fees(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      let fees = await Fees.addFees(new_fees);
      res.status(200).send(fees);
    }
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getFees = async function (req, res) {
  try {
    let fees = await Fees.getFees();
    res.status(200).send(fees);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

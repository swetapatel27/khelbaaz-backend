const EventFees = require("../models/eventfees");

exports.addEventFees = async function (req, res) {
  try {
    let new_fees = new EventFees(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      let fees = await EventFees.addEventFees(new_fees);
      res.status(200).send(fees);
    }
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
exports.getEventFees = async function (req, res) {
  try {
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;
    let event_fees = await EventFees.getEventFees(event_id, user_id);
    res.status(200).send(event_fees);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

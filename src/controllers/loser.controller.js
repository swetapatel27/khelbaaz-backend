const Loser = require("../models/loser");

exports.addLoser = function (req, res) {
  console.log(req.body);
  const new_loser = new Loser(req.body);
  Loser.create(new_loser, (err, loser) => {
    if (err) {
      res.send(err);
    } else {
      res.json({
        error: false,
        message: "Loser added successfully!",
        data: loser,
      });
    }
  });
};

//get total loss for last n days for admin
exports.getTotalLossByCreatorId = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const total_loss = await Loser.getTotalLossByCreatorId(creator_id);
    res.send(total_loss);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get total loss from A date to B date of users in admin panel
exports.getTotalLossByDate = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const from_date = req.params.from_date;
    const to_date = req.params.to_date;

    const total_loss = await Loser.getTotalLossByDate(
      creator_id,
      from_date,
      to_date
    );
    res.send(total_loss);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

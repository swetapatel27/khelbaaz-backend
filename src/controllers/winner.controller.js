const Winner = require("../models/winner");

exports.addWinner = function (req, res) {
  console.log(req.body);
  const new_winner = new Winner(req.body);
  Winner.create(new_winner, (err, winner) => {
    if (err) {
      res.send(err);
    } else {
      res.json({
        error: false,
        message: "User added successfully!",
        data: winner,
      });
    }
  });
};

//get total profit for last n days for admin
exports.getTotalProfitByCreatorId = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const total_profit = await Winner.getTotalProfitByCreatorId(creator_id);
    res.send(total_profit);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//get total profit from A date to B date of users in admin panel
exports.getTotalProfitByDate = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const from_date = req.params.from_date;
    const to_date = req.params.to_date;

    const total_profit = await Winner.getTotalProfitByDate(
      creator_id,
      from_date,
      to_date
    );
    res.send(total_profit);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

var dbConn = require("../../config/db");
const Giver = require("../controllers/giver.controller");
require("dotenv").config();

var LoseMaster = function (loser) {
  this.user_id = loser.user_id;
  this.loss_amount = loser.loss_amount;
  this.event_id = loser.event_id;
  this.main_type = loser.main_type;
  this.runner_name = loser.runner_name;
};

LoseMaster.create = function (newLoser, result) {
  dbConn.query("INSERT INTO losers set ?", newLoser, (err, res) => {
    if (err) {
      result(err, null);
    } else {
      Giver.addSubLosers(newLoser, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          console.log("data===>", data);
          res.receivers_id = data;
          res.subLedger = data.subLedger;
          result(null, {
            loser_id: res.insertId,
            receivers_id: res.receivers_id,
          });
        }
      });
      // result(null, res.insertId);
    }
  });
};

//get total loss for last n days for admin
LoseMaster.getTotalLossByCreatorId = async function (creator_id) {
  try {
    let total_profit = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT l.user_id, u.username, SUM(l.loss_amount) AS total_loss_amount FROM losers l JOIN users u ON FIND_IN_SET(?, REPLACE(u.creator_id, ' ', '')) > 0 AND FIND_IN_SET(CAST(l.user_id AS CHAR), REPLACE(u.id, ' ', '')) > 0 WHERE l.updated_at >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) GROUP BY l.user_id, u.username",
        creator_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return total_profit;
  } catch (error) {
    console.error(error);
  }
};

//get total loss from A date to B date of users in admin panel
LoseMaster.getTotalLossByDate = async function (
  creator_id,
  from_date,
  to_date
) {
  try {
    let total_profit = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT l.user_id, u.username, SUM(l.`loss_amount`) AS total_loss_amount FROM losers l JOIN users u ON FIND_IN_SET(?, REPLACE(u.creator_id, ' ', '')) > 0 AND FIND_IN_SET(CAST(l.user_id AS CHAR), REPLACE(u.id, ' ', '')) > 0 WHERE DATE(l.updated_at) BETWEEN ? AND ? GROUP BY l.user_id, u.username ",
        [creator_id, from_date, to_date],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return total_profit;
  } catch (error) {
    console.error(error);
  }
};

module.exports = LoseMaster;

var dbConn = require("../../config/db");
const Giver = require("../controllers/giver.controller");
require("dotenv").config();

var WinMaster = function (winner) {
  this.user_id = winner.user_id;
  this.win_amount = winner.win_amount;
  this.event_id = winner.event_id;
  this.main_type = winner.main_type;
  this.runner_name = winner.runner_name;
};

WinMaster.create = async function (newWinner, result) {
  dbConn.query("INSERT INTO winners set ?", newWinner, (err, res) => {
    if (err) {
      result(err, null);
    } else {
      Giver.addSubGivers(newWinner, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          console.log("data===>", data);
          res.givers_id = data;
          res.subLedger = data.subLedger;
          result(null, { winner_id: res.insertId, givers_id: res.givers_id });
        }
      });
      // result(null, res.insertId);
    }
  });
};

//get total profit for last n days for admin
WinMaster.getTotalProfitByCreatorId = async function (creator_id) {
  try {
    let total_profit = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT w.user_id, u.username, SUM(w.win_amount) AS total_win_amount FROM winners w JOIN users u ON FIND_IN_SET(?, REPLACE(u.creator_id, ' ', '')) > 0 AND FIND_IN_SET(CAST(w.user_id AS CHAR), REPLACE(u.id, ' ', '')) > 0 WHERE w.updated_at >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) GROUP BY w.user_id, u.username",
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

//get total profit from A date to B date of users in admin panel
WinMaster.getTotalProfitByDate = async function (
  creator_id,
  from_date,
  to_date
) {
  try {
    let total_profit = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT w.user_id, u.username, SUM(w.win_amount) AS total_win_amount FROM winners w JOIN users u ON FIND_IN_SET(?, REPLACE(u.creator_id, ' ', '')) > 0 AND FIND_IN_SET(CAST(w.user_id AS CHAR), REPLACE(u.id, ' ', '')) > 0 WHERE DATE(w.updated_at) BETWEEN ? AND ? GROUP BY w.user_id, u.username",
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

module.exports = WinMaster;

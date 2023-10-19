var dbConn = require("../../config/db");
require("dotenv").config();

var CasinoBetsMaster = function () {};

CasinoBetsMaster.savedata = async function (data) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO casino_bets SET ?",
        data,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

CasinoBetsMaster.checkFinished = async function (user_id,gameid,roundid) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT count(*) as total FROM casino_results WHERE user_id = ? AND gameid = ? AND roundid = ? AND is_finished='1'",
        [user_id,gameid,roundid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            if(res[0].total > 0) {
              resolve(false);
            }else {
              resolve(true);
            }
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

CasinoBetsMaster.calculateProfit = async function (user_id,gameid,roundid) {
  try {
  let result = await new Promise((resolve, reject) => {
      dbConn.query(
      "SELECT SUM(amount) as total FROM casino_bets WHERE user_id = ? AND gameid = ? AND roundid = ?",
      [user_id,gameid,roundid],
      (err, res) => {
          if (err) {
              reject(0);
          } else {
              if(res[0].total) {
                  resolve(res[0].total);
              }else {
                  resolve(0);
              }
          }
      }
      );
  });

  return result;
  } catch (error) {
  console.log(error);
  }
}


module.exports = CasinoBetsMaster;

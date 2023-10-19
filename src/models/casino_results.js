var dbConn = require("../../config/db");
require("dotenv").config();

var CasinoResultsMaster = function () {};

CasinoResultsMaster.savedata = async function (data) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO casino_results SET ?",
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

CasinoResultsMaster.markAsFinished = async function (user_id,gameid,roundid) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "UPDATE casino_results SET is_finished='1' WHERE user_id = ? AND gameid = ? AND roundid = ?",
        [user_id,gameid,roundid],
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
}


module.exports = CasinoResultsMaster;

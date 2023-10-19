var dbConn = require("./../../config/db");
require("dotenv").config();

var FeesMaster = function (fees) {
  this.fees = fees.amount;
  this.type = "cricket";
};

FeesMaster.addFees = async function (fees) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query("REPLACE INTO fees set ?", [fees], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

FeesMaster.getFees = async function () {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query("select fees from fees", (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[0]);
        }
      });
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = FeesMaster;

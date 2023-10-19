var dbConn = require("./../../config/db");
require("dotenv").config();

var EventfeesMaster = function (event_fees) {
  this.user_id = event_fees.user_id;
  this.event_id = event_fees.event_id;
  this.event_name = event_fees.event_name;
  this.type = event_fees.type;
  this.amount = event_fees.amount;
};

EventfeesMaster.addEventFees = async function (event_fees) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query("INSERT INTO eventfees set ?", event_fees, (err, res) => {
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

EventfeesMaster.getEventFees = async function (event_id, user_id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from eventfees where event_id=? and user_id=?",
        [event_id, user_id],
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

module.exports = EventfeesMaster;

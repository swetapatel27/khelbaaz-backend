var dbConn = require("./../../config/db");
require("dotenv").config();

var ExposureMaster = function (exposure) {
  this.user_id = exposure.user_id;
  this.event_id = exposure.event_id;
  this.event_name = exposure.market_name;
  this.runner_name = exposure.runner_name;
  this.main_type = exposure.main_type;
  this.type = exposure.type;
  this.price = exposure.price;
  this.size = exposure.size;
  this.deducted_amount = exposure.deducted_amount;
  this.exp_amount = exposure.exp_amount;
};

ExposureMaster.addExposure = async function (exposure) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query("INSERT INTO exposures set ? ", exposure, (err, res) => {
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

ExposureMaster.getExposureByUserId = async function (user_id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT sum(exp_amount) as exp_amount FROM `exposures` WHERE user_id = ?",
        user_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res[0].exp_amount == null) {
              res[0].exp_amount = 0;
            }
            console.log(res);
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

ExposureMaster.getExposureByRunner = async function (user_id, runner_name) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from exposures where user_id = ? and runner_name = ? order by updated_at desc",
        [user_id, runner_name],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return exposure;
  } catch (error) {}
};

ExposureMaster.getExposureAmtByGroup = async function (user_id, event_id) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT user_id, event_id,status, runner_name,sum(exp_amount) as exp_amount FROM `exposures` GROUP BY runner_name,user_id,event_id,exp_amount having user_id = ? and event_id = ?",
        [user_id, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            // console.log("expgrpbyamtrunner---->", res);
            resolve(res);
          }
        }
      );
    });
    return exposure;
  } catch (error) {}
};

ExposureMaster.getAllSessionExposure = async function (user_id) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      let qury =
        "select exposures.user_id,exposures.event_id, events.event_name,exposures.runner_name,exposures.main_type,exposures.type,exposures.price,exposures.size,exposures.exp_amount,exposures.status from exposures join events on exposures.event_id = events.event_id where exposures.main_type = 'session' and user_id = ? ";
      dbConn.query(qury, [user_id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          const newData = [];

          // Function to check if an object with given event_id exists in newData array
          const doesEventExist = (eventId) => {
            return newData.some((event) => event.event_id === eventId);
          };

          // Loop through each object in the data array
          res.forEach((bet) => {
            // Check if an object with the same event_id exists in the newData array
            const eventIndex = newData.findIndex(
              (event) => event.event_id === bet.event_id
            );

            // If event doesn't exist in the newData array, create a new object with the current bet
            if (eventIndex === -1) {
              newData.push({
                event_id: bet.event_id,
                event_name: bet.event_name,
                main_type: "session",
                bets: [
                  {
                    event_id: bet.event_id,
                    runner_name: bet.runner_name,
                    type: bet.type,
                    price: bet.price,
                    size: bet.size,
                    status: bet.status,
                    exp_amount: bet.exp_amount,
                  },
                ],
              });
            } else {
              // If event already exists in the newData array, push the current bet to the bets array of that object
              newData[eventIndex].bets.push({
                event_id: bet.event_id,
                runner_name: bet.runner_name,
                type: bet.type,
                price: bet.price,
                size: bet.size,
                status: bet.status,
                exp_amount: bet.exp_amount,
              });
            }
          });
          resolve(newData);
        }
      });
    });
    return exposure;
  } catch (error) {}
};

ExposureMaster.getAllMatchExposure = async function (user_id) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      let qury =
        "select exposures.user_id,exposures.event_id, events.event_name,exposures.runner_name,exposures.main_type,exposures.type,exposures.price,exposures.size,exposures.exp_amount,exposures.status from exposures join events on exposures.event_id = events.event_id where exposures.main_type = 'match_odd' and user_id = ? ";
      dbConn.query(qury, [user_id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          const newData = [];

          // Function to check if an object with given event_id exists in newData array
          const doesEventExist = (eventId) => {
            return newData.some((event) => event.event_id === eventId);
          };

          // Loop through each object in the data array
          res.forEach((bet) => {
            // Check if an object with the same event_id exists in the newData array
            const eventIndex = newData.findIndex(
              (event) => event.event_id === bet.event_id
            );

            // If event doesn't exist in the newData array, create a new object with the current bet
            if (eventIndex === -1) {
              newData.push({
                event_id: bet.event_id,
                event_name: bet.event_name,
                main_type: "match_odd",
                bets: [
                  {
                    event_id: bet.event_id,
                    runner_name: bet.runner_name,
                    type: bet.type,
                    price: bet.price,
                    size: bet.size,
                    status: bet.status,
                    exp_amount: bet.exp_amount,
                  },
                ],
              });
            } else {
              // If event already exists in the newData array, push the current bet to the bets array of that object
              newData[eventIndex].bets.push({
                event_id: bet.event_id,
                runner_name: bet.runner_name,
                type: bet.type,
                price: bet.price,
                size: bet.size,
                status: bet.status,
                exp_amount: bet.exp_amount,
              });
            }
          });
          resolve(newData);
        }
      });
    });
    return exposure;
  } catch (error) {}
};

//get total exposure admin wie

ExposureMaster.getTotalAdminExposure = async function (creator_id) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      dbConn.query(
        "select sum(exp_amount) as total_exposure from exposures where user_id in (select id from users where find_in_set(?,creator_id)) and status = 1;",
        [creator_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return exposure;
  } catch (error) {}
};

ExposureMaster.getFancyExposureAmtByGroup = async function (user_id, event_id) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT user_id, event_id,status, runner_name,sum(exp_amount) as exp_amount FROM `exposures` where main_type='fancy' GROUP BY runner_name,user_id,event_id,exp_amount having user_id = ? and event_id = ?",
        [user_id, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            // console.log("expgrpbyamtrunner---->", res);
            resolve(res);
          }
        }
      );
    });
    return exposure;
  } catch (error) {}
};

ExposureMaster.markAsCloseExposure = async function (user_id,gameid,roundid) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      dbConn.query(
        "UPDATE exposures SET status='0' WHERE user_id=? AND event_id=? AND runner_name=?",
        [user_id,gameid,roundid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
    return exposure;
  } catch (error) {}
}

ExposureMaster.getExposureOverviewInAdmin = async function (user_id) {
  try {
    let exposure = await new Promise((resolve, reject) => {
      dbConn.query(
        `SELECT e.*,COALESCE(m.event_name, s.event_name, t.event_name) as event_name from exposures as e
        LEFT JOIN marketodds as m ON e.event_id = m.event_id
        LEFT JOIN soccerodds as s ON e.event_id = s.event_id
        LEFT JOIN tennisodds as t ON e.event_id = t.event_id
        WHERE e.user_id=? AND e.status='1' ORDER BY e.updated_at DESC`,
        [user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            // console.log("expgrpbyamtrunner---->", res);
            resolve(res);
          }
        }
      );
    });
    return exposure;
  } catch (error) {}
};

//get all undeclared sessions
ExposureMaster.getAllUndeclaredSession = async function () {
  try {
    let undeclared_sessions = await new Promise((resolve, reject) => {
      dbConn.query(
        "select event_id,runner_name,status,sum(exp_amount) as exp_amount,updated_at from exposures where status = 1 and main_type='session' group by event_id,runner_name ORDER BY updated_at desc",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return undeclared_sessions;
  } catch (error) {}
};

//get all undeclared fancy
ExposureMaster.getAllUndeclaredFancy = async function () {
  try {
    let undeclared_fancy = await new Promise((resolve, reject) => {
      dbConn.query(
        "select event_id,runner_name,status,sum(exp_amount) as exp_amount,updated_at from exposures where status = 1 and main_type='fancy' group by event_id ORDER BY updated_at desc",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return undeclared_fancy;
  } catch (error) {}
};

//get all undeclared bookmaker
ExposureMaster.getAllUndeclaredBookmaker = async function () {
  try {
    let undeclared_bookmaker = await new Promise((resolve, reject) => {
      dbConn.query(
        "select event_id,runner_name,status,sum(exp_amount1) as exp_amount1,sum(exp_amount2) as exp_amount2, updated_at from exposures where status = 1 and main_type='bookmaker' group by event_id ORDER BY updated_at desc",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return undeclared_bookmaker;
  } catch (error) {}
};


module.exports = ExposureMaster;

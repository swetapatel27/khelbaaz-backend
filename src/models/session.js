var dbConn = require("./../../config/db");
const axios = require("axios");

require("dotenv").config();

var SessionMaster = function (session) {};

SessionMaster.getLiveSessionById = async function (event_id) {
  try {
    let session = await axios.get(
      process.env.API_URL + "listMarketBookSession?match_id=" + event_id
    );
    session = session.data;
    return session;
  } catch (error) {
    console.error(error);
  }
};

SessionMaster.getSessionById = async function (event_id) {
  try {
    let session = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from sessions where event_id = ? order by updated_at desc, game_status",
        event_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return session;
  } catch (error) {
    console.error(error);
  }
};

SessionMaster.getTestSessionById = async function (event_id) {
  try {
    let liveSession = await SessionMaster.getLiveSessionById(event_id);

    let session = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from sessions where event_id = ? order by updated_at desc, game_status",
        event_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    if (Array.isArray(liveSession)) {
      const matchingEntries = session.filter((s) =>
        liveSession.some((ls) => ls.RunnerName === s.runner_name)
      );
      return matchingEntries;
    } else {
      console.error(
        "liveSession is not an array or is undefined from getTestSessionById method in sessionmaster"
      );
    }
    // const matchingEntries = session.filter((s) =>
    //   liveSession.some((ls) => ls.RunnerName === s.runner_name)
    // );
  } catch (error) {
    console.error(error);
  }
};

SessionMaster.setSessionActive = async function (runner_name, is_active) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update sessions set is_active = ? where runner_name = ?",
        [is_active, runner_name],
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

SessionMaster.setSessionSuspend = async function (runner_name, is_suspended) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update sessions set is_suspended = ? where runner_name = ?",
        [is_suspended, runner_name],
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

SessionMaster.checkOddChange = async function (
  event_id,
  runner_name,
  type,
  price
) {
  try {
    let change = false;
    let session_odd = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from sessions where event_id = ? and runner_name = ?",
        [event_id, runner_name],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    let session = session_odd[0];
    switch (type) {
      case "Back":
        if (price != session.back_size) {
          change = true;
        }
        break;
      case "Lay":
        console.log("oddd-->", session.lay_size);
        console.log("price-->", price);
        console.log("change-->", price != session.lay_size);
        if (price != session.lay_size) {
          change = true;
        }
        break;
      default:
        break;
    }
    return change;
  } catch (error) {
    console.log(error);
  }
};

module.exports = SessionMaster;

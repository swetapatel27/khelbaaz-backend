var dbConn = require("./../../config/db");
const axios = require("axios");

require("dotenv").config();

var FancyMaster = function (fancy) {};

FancyMaster.getLiveFancyById = async function (event_id) {
  try {
    let fancy = await axios.get(
      process.env.API_URL + "getOdds?eventId=" + event_id
    );
    if (fancy.status == 200) {
      if (fancy.data != null) {
        if (fancy.data.success && fancy.data.data.hasOwnProperty("t4")) {
          if (fancy.data.data.t4 != null) {
            if (fancy.data.data.t4.length > 0) {
              fancy = fancy.data.data.t4;
            } else {
              fancy = [];
            }
          }
        }
      }
    }

    return fancy;
  } catch (error) {
    console.error(error);
  }
};

FancyMaster.getFancyById = async function (event_id) {
  try {
    let fancy = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancies where event_id = ? order by updated_at desc, game_status",
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
    return fancy;
  } catch (error) {
    console.error(error);
  }
};

FancyMaster.getTestFancyById = async function (event_id) {
  try {
    // let liveFancy = await FancyMaster.getLiveFancyById(event_id);

    let fancy = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancies where event_id = ? order by srno, runner_name, updated_at desc, game_status",
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
    return fancy;
    if (Array.isArray(liveFancy)) {
      const matchingEntries = fancy.filter((s) =>
        liveFancy.some((ls) => ls.nat === s.runner_name)
      );
      return matchingEntries;
    } else {
      return [];
      console.error(
        "liveFancy is not an array or is undefined from getTestFancyById method in fancymaster"
      );
    }
    // const matchingEntries = fancy.filter((s) =>
    //   liveFancy.some((ls) => ls.RunnerName === s.runner_name)
    // );
  } catch (error) {
    console.error(error);
  }
};

FancyMaster.setFancyActive = async function (runner_name, is_active) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update fancies set is_active = ? where runner_name = ?",
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

FancyMaster.setFancySuspend = async function (
  runner_name,
  is_suspended,
  event_id
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update fancies set is_suspended = ? where runner_name = ? and event_id = ?",
        [is_suspended, runner_name, event_id],
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

FancyMaster.checkOddChange = async function (
  event_id,
  runner_name,
  type,
  price
) {
  try {
    let change = false;
    let fancy_odd = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancies where event_id = ? and runner_name = ?",
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
    let fancy = fancy_odd[0];
    switch (type) {
      case "Back":
        if (price != fancy.back_size) {
          change = true;
        }
        break;
      case "Lay":
        console.log("oddd-->", fancy.lay_size);
        console.log("price-->", price);
        console.log("change-->", price != fancy.lay_size);
        if (price != fancy.lay_size) {
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

FancyMaster.getFancyRunnerById = async function (event_id, runner_name) {
  try {
    let fancy = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancies where event_id = ? and runner_name=?",
        [event_id, runner_name],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return fancy;
  } catch (error) {
    console.error(error);
  }
};
module.exports = FancyMaster;

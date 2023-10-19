const Exposure = require("../models/exposure");
const Sessionbets = require("../models/sessionbets");
const Session = require("../models/session");
const MatchOdds = require("../models/marketodd");
const BookmakerOdd = require("../models/bookmakerodd");
const BookmakerBet = require("../models/bookmakerbet");
const TennisOdds = require("../models/tennisodd");
const SoccerOdds = require("../models/soccerodds");
const Matchbets = require("../models/matchbets");
const Tennisbets = require("../models/tennisbets");
const Soccerbets = require("../models/soccerbets");
const User = require("../models/user");
var dbConn = require("./../../config/db");

exports.validateBookmakerBet = async function (req, res, next) {
  try {
    let exp1 = 0;
    let exp2 = 0;
    let exp3 = 0;
    let {
      user_id,
      event_id,
      market_id,
      price,
      bet_amount,
      main_type,
      type,
      runner_name,
      loss_amount,
      win_amount,
      index,
      g_type,
      enable_draw,
    } = req.body;

    enable_draw = JSON.parse(enable_draw);
    index = Number(index);
    let is_suspend = await is_suspended(event_id, index, g_type);
    if (is_suspend) {
      res.status(500).send({ error: "Bet Suspended..!!" });
    } else {
      let change = true;
      switch (g_type) {
        case "cricket":
          change = await BookmakerOdd.checkBookmakerPriceChange(
            market_id,
            runner_name,
            type,
            price
          );
          break;
        case "tennis":
          change = await TennisOdds.checkTennisOddPriceChange(
            market_id,
            runner_name,
            type,
            price
          );
          break;
        case "soccer":
          change = await SoccerOdds.checkSoccerOddPriceChange(
            market_id,
            runner_name,
            type,
            price
          );
          break;
        default:
          break;
      }
      if (change) {
        res.status(500).send({ error: "Odds Changed..!!" });
      } else {
        // console.log(index, g_type, loss_amount, win_amount);
        let last_min_exp = 0;
        let new_min_exp = 0;
        let final_balance = 0;
        let existing_matchbets = [];

        if (type == "Back") {
          win_amount =
            (Number(price) * Number(bet_amount)).toFixed(2) -
            Number(bet_amount);
          loss_amount = 0 - Number(bet_amount);
        } else if (type == "Lay") {
          win_amount = Number(bet_amount);
          loss_amount =
            0 -
            ((Number(price) * Number(bet_amount)).toFixed(2) -
              Number(bet_amount));
        }

        let user_balance = await User.getBalById(user_id);
        let user_exposure = await Exposure.getExposureByUserId(user_id);

        switch (g_type) {
          case "cricket":
            existing_matchbets = await BookmakerBet.getBookBetByEventIdByUserID(
              event_id,
              user_id
            );
            break;
          case "tennis":
            existing_matchbets = await Tennisbets.getTennisBetByEventIdByUserID(
              event_id,
              user_id
            );
            break;
          case "soccer":
            existing_matchbets = await Soccerbets.getSoccerBetByEventIdByUserID(
              event_id,
              user_id
            );
            break;
        }
        // console.log("LA-->", Number(loss_amount).toFixed(2));
        // console.log("WA-->", Number(win_amount).toFixed(2));
        // console.log("exists bet-->", existing_matchbets[0]);
        if (existing_matchbets.length == 0) {
          // console.log("if");
          const result = await calculateFirstBetByIndex(
            index,
            type,
            win_amount,
            loss_amount
          );
          exp1 = result.exp1;
          exp2 = result.exp2;
          exp3 = result.exp3;
        } else {
          if (enable_draw) {
            last_min_exp = Math.min(
              existing_matchbets[0].exp_amount1,
              existing_matchbets[0].exp_amount2,
              existing_matchbets[0].exp_amount3
            );
          } else if (enable_draw == false) {
            last_min_exp = Math.min(
              existing_matchbets[0].exp_amount1,
              existing_matchbets[0].exp_amount2
            );
          }
          const result = await calculateExistingByIndex(
            index,
            type,
            win_amount,
            loss_amount,
            existing_matchbets[0]
          );
          exp1 = result.exp1;
          exp2 = result.exp2;
          exp3 = result.exp3;
        }
        if (enable_draw) {
          new_min_exp = Math.min(exp1, exp2, exp3);
          // console.log("draw true", new_min_exp);
        } else if (enable_draw == false) {
          new_min_exp = Math.min(exp1, exp2);
          // console.log("draw false", new_min_exp);
        }
        final_balance =
          user_balance.balance +
          user_exposure[0].exp_amount -
          last_min_exp +
          new_min_exp;
        // console.log("exp1-->", typeof exp1, exp1);
        // console.log("exp1", exp1, Number(exp1).toFixed(2));
        // console.log("exp2", Number(exp2).toFixed(2));
        // console.log("exp3", Number(exp3).toFixed(2));
        // console.log("last min exp", last_min_exp);
        // console.log("new min exp", new_min_exp);
        // console.log("final balance", final_balance);

        if (final_balance >= 0) {
          req.body.loss_amount = Number(loss_amount).toFixed(2);
          req.body.win_amount = Number(win_amount).toFixed(2);
          req.body.exp_amount1 = Number(exp1).toFixed(2);
          req.body.exp_amount2 = Number(exp2).toFixed(2);
          req.body.exp_amount3 = Number(exp3).toFixed(2);
          next();
        } else {
          res.status(500).send({ error: "Insufficient Balance" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
}
exports.validateMatchBet = async function (req, res, next) {
  console.log(req.body);
  try {
    let exp1 = 0;
    let exp2 = 0;
    let exp3 = 0;
    let {
      user_id,
      event_id,
      market_id,
      price,
      bet_amount,
      main_type,
      type,
      runner_name,
      loss_amount,
      win_amount,
      index,
      g_type,
      enable_draw,
    } = req.body;

    enable_draw = JSON.parse(enable_draw);
    index = Number(index);
    let is_suspend = await is_suspended(event_id, index, g_type);
    if (is_suspend) {
      res.status(500).send({ error: "Bet Suspended..!!" });
    } else {
      let change = true;
      switch (g_type) {
        case "cricket":
          change = await MatchOdds.checkMatchOddPriceChange(
            market_id,
            runner_name,
            type,
            price
          );
          break;
        case "tennis":
          change = await TennisOdds.checkTennisOddPriceChange(
            market_id,
            runner_name,
            type,
            price
          );
          break;
        case "soccer":
          change = await SoccerOdds.checkSoccerOddPriceChange(
            market_id,
            runner_name,
            type,
            price
          );
          break;
        default:
          break;
      }
      if (change) {
        res.status(500).send({ error: "Odds Changed..!!" });
      } else {
        // console.log(index, g_type, loss_amount, win_amount);
        let last_min_exp = 0;
        let new_min_exp = 0;
        let final_balance = 0;
        let existing_matchbets = [];

        if (type == "Back") {
          win_amount =
            (Number(price) * Number(bet_amount)).toFixed(2) -
            Number(bet_amount);
          loss_amount = 0 - Number(bet_amount);
        } else if (type == "Lay") {
          win_amount = Number(bet_amount);
          loss_amount =
            0 -
            ((Number(price) * Number(bet_amount)).toFixed(2) -
              Number(bet_amount));
        }

        let user_balance = await User.getBalById(user_id);
        let user_exposure = await Exposure.getExposureByUserId(user_id);

        switch (g_type) {
          case "cricket":
            existing_matchbets = await Matchbets.getMatchBetByEventIdByUserID(
              event_id,
              user_id
            );
            break;
          case "tennis":
            existing_matchbets = await Tennisbets.getTennisBetByEventIdByUserID(
              event_id,
              user_id
            );
            break;
          case "soccer":
            existing_matchbets = await Soccerbets.getSoccerBetByEventIdByUserID(
              event_id,
              user_id
            );
            break;
        }
        // console.log("LA-->", Number(loss_amount).toFixed(2));
        // console.log("WA-->", Number(win_amount).toFixed(2));
        // console.log("exists bet-->", existing_matchbets[0]);
        if (existing_matchbets.length == 0) {
          // console.log("if");
          const result = await calculateFirstBetByIndex(
            index,
            type,
            win_amount,
            loss_amount
          );
          exp1 = result.exp1;
          exp2 = result.exp2;
          exp3 = result.exp3;
        } else {
          if (enable_draw) {
            last_min_exp = Math.min(
              existing_matchbets[0].exp_amount1,
              existing_matchbets[0].exp_amount2,
              existing_matchbets[0].exp_amount3
            );
          } else if (enable_draw == false) {
            last_min_exp = Math.min(
              existing_matchbets[0].exp_amount1,
              existing_matchbets[0].exp_amount2
            );
          }
          const result = await calculateExistingByIndex(
            index,
            type,
            win_amount,
            loss_amount,
            existing_matchbets[0]
          );
          exp1 = result.exp1;
          exp2 = result.exp2;
          exp3 = result.exp3;
        }
        if (enable_draw) {
          new_min_exp = Math.min(exp1, exp2, exp3);
          // console.log("draw true", new_min_exp);
        } else if (enable_draw == false) {
          new_min_exp = Math.min(exp1, exp2);
          // console.log("draw false", new_min_exp);
        }
        const userexpo = Math.abs(user_exposure[0].exp_amount-bet_amount);
        if(user_balance.exposure_limit<userexpo){
          return res.status(200).send({ error: "Exposure exceeded" });
        }
        final_balance =
          user_balance.balance +
          user_exposure[0].exp_amount -
          last_min_exp +
          new_min_exp;
        // console.log("exp1-->", typeof exp1, exp1);
        // console.log("exp1", exp1, Number(exp1).toFixed(2));
        // console.log("exp2", Number(exp2).toFixed(2));
        // console.log("exp3", Number(exp3).toFixed(2));
        // console.log("last min exp", last_min_exp);
        // console.log("new min exp", new_min_exp);
        // console.log("final balance", final_balance);

        if (final_balance >= 0) {
          req.body.loss_amount = Number(loss_amount).toFixed(2);
          req.body.win_amount = Number(win_amount).toFixed(2);
          req.body.exp_amount1 = Number(exp1).toFixed(2);
          req.body.exp_amount2 = Number(exp2).toFixed(2);
          req.body.exp_amount3 = Number(exp3).toFixed(2);
          next();
        } else {
          res.status(500).send({ error: "Insufficient Balance" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

exports.validateSessionBet = async function (req, res, next) {
  console.log("validating session");
  try {
    let exp1 = 0;
    let exp2 = 0;
    let {
      user_id,
      event_id,
      main_type,
      type,
      runner_name,
      price,
      size,
      bet_amount,
      loss_amount,
      win_amount,
      exp_amount1,
      exp_amount2,
    } = req.body;

    let is_suspend = await is_session_suspended(event_id, runner_name);
    console.log("sus-->", is_suspend);
    if (is_suspend) {
      res.status(500).send({ error: "Bet Suspended..!!" });
    } else {
      let change = await Session.checkOddChange(
        event_id,
        runner_name,
        type,
        Number(size)
      );
      if (change) {
        res.status(500).send({ error: "Odds Changed..!!" });
      } else {
        let last_min_exp = 0;
        let new_min_exp = 0;
        let final_balance = 0;
        if (Number(size) <= 100) {
          loss_amount = (bet_amount / 100) * 100;
          win_amount = (bet_amount / 100) * Number(size);
        } else {
          loss_amount = (bet_amount / 100) * Number(size);
          win_amount = (bet_amount / 100) * 100;
        }
        let user_balance = await User.getBalById(user_id);
        let user_exposure = await Exposure.getExposureByUserId(user_id);
        let existing_sessionbet = await Sessionbets.getSessionByRunnerEvent(
          user_id,
          event_id,
          runner_name
        );

        if (existing_sessionbet.length == 0) {
          switch (type) {
            case "Back":
              exp1 = Number(win_amount);
              exp2 = Number(0 - loss_amount);
              break;
            case "Lay":
              exp1 = Number(0 - loss_amount);
              exp2 = Number(win_amount);
              break;
            default:
              break;
          }
        } else {
          last_min_exp = Math.min(
            existing_sessionbet[0].exp_amount1,
            existing_sessionbet[0].exp_amount2
          );
          switch (type) {
            case "Back":
              exp1 = existing_sessionbet[0].exp_amount1 + Number(win_amount);
              exp2 =
                existing_sessionbet[0].exp_amount2 + Number(0 - loss_amount);
              break;
            case "Lay":
              exp1 =
                existing_sessionbet[0].exp_amount1 + Number(0 - loss_amount);
              exp2 = existing_sessionbet[0].exp_amount2 + Number(win_amount);
              break;
            default:
              break;
          }
        }
        new_min_exp = Math.min(exp1, exp2);
        const userexpo = Math.abs(user_exposure[0].exp_amount-bet_amount);
        if(user_balance.exposure_limit<userexpo){
          return res.status(200).send({ error: "Exposure exceeded" });
        }
        final_balance =
          user_balance.balance +
          user_exposure[0].exp_amount -
          last_min_exp +
          new_min_exp;

        // console.log("LA-->", Number(loss_amount).toFixed(2));
        // console.log("WA-->", Number(win_amount).toFixed(2));
        // console.log("exp1", exp1);
        // console.log("exp2", exp2);
        // console.log("last min exp", last_min_exp);
        // console.log("new min exp", new_min_exp);
        // console.log("final balance", final_balance);

        if (final_balance >= 0) {
          req.body.loss_amount = Number(loss_amount).toFixed(2);
          req.body.win_amount = Number(win_amount).toFixed(2);
          req.body.exp_amount1 = Number(exp1).toFixed(2);
          req.body.exp_amount2 = Number(exp2).toFixed(2);
          next();
        } else {
          res.status(500).send({ error: "Insufficient Balance" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

function calculateFirstBetByIndex(index, type, win_amount, loss_amount) {
  // console.log("from methd", type, win_amount, loss_amount);
  return new Promise((resolve, reject) => {
    let exp1 = 0;
    let exp2 = 0;
    let exp3 = 0;
    // console.log(typeof index);
    switch (index) {
      case 1:
        // console.log("in case1");
        if (type == "Back") {
          console.log("in back");
          exp1 = win_amount;
          exp2 = loss_amount;
          exp3 = loss_amount;
        } else if (type == "Lay") {
          exp1 = loss_amount;
          exp2 = win_amount;
          exp3 = win_amount;
        }
        break;
      case 2:
        if (type == "Back") {
          exp1 = loss_amount;
          exp2 = win_amount;
          exp3 = loss_amount;
        } else if (type == "Lay") {
          exp1 = win_amount;
          exp2 = loss_amount;
          exp3 = win_amount;
        }
        break;
      case 3:
        if (type == "Back") {
          exp1 = loss_amount;
          exp2 = loss_amount;
          exp3 = win_amount;
        } else if (type == "Lay") {
          exp1 = win_amount;
          exp2 = win_amount;
          exp3 = loss_amount;
        }
        break;
      default:
        break;
    }
    // console.log("fir exp-->", exp1, exp2, exp3);
    // Resolve the results as an object
    resolve({ exp1, exp2, exp3 });
  });
}

function calculateExistingByIndex(
  index,
  type,
  win_amount,
  loss_amount,
  last_matchbet
) {
  return new Promise((resolve, reject) => {
    // console.log("from methd--->", index, type, win_amount, loss_amount);
    let exp1 = 0;
    let exp2 = 0;
    let exp3 = 0;
    switch (index) {
      case 1:
        // console.log("in case 1");
        if (type == "Back") {
          console.log("from method", last_matchbet.exp_amount1);
          exp1 = last_matchbet.exp_amount1 + Number(win_amount);
          exp2 = last_matchbet.exp_amount2 + Number(loss_amount);
          exp3 = last_matchbet.exp_amount3 + Number(loss_amount);
        } else if (type == "Lay") {
          exp1 = last_matchbet.exp_amount1 + Number(loss_amount);
          exp2 = last_matchbet.exp_amount2 + Number(win_amount);
          exp3 = last_matchbet.exp_amount3 + Number(win_amount);
        }
        break;
      case 2:
        // console.log("in case 2");
        if (type == "Back") {
          exp1 = last_matchbet.exp_amount1 + Number(loss_amount);
          exp2 = last_matchbet.exp_amount2 + Number(win_amount);
          exp3 = last_matchbet.exp_amount3 + Number(loss_amount);
        } else if (type == "Lay") {
          // console.log("in Lay");
          exp1 = last_matchbet.exp_amount1 + Number(win_amount);
          exp2 = last_matchbet.exp_amount2 + Number(loss_amount);
          exp3 = last_matchbet.exp_amount3 + Number(win_amount);
        }
        break;
      case 3:
        if (type == "Back") {
          exp1 = last_matchbet.exp_amount1 + Number(loss_amount);
          exp2 = last_matchbet.exp_amount2 + Number(loss_amount);
          exp3 = last_matchbet.exp_amount3 + Number(win_amount);
        } else if (type == "Lay") {
          exp1 = last_matchbet.exp_amount1 + Number(win_amount);
          exp2 = last_matchbet.exp_amount2 + Number(win_amount);
          exp3 = last_matchbet.exp_amount3 + Number(loss_amount);
        }
        break;
      default:
        break;
    }

    // console.log("fir exp-->", exp1, exp2, exp3);
    // Resolve the results as an object
    resolve({ exp1, exp2, exp3 });
  });
}

async function is_suspended(event_id, index, g_type) {
  try {
    let col_name = "";
    let table_name;
    // console.log("index", index, typeof index);

    switch (index) {
      case 1:
        col_name = "is_suspended0";
        if (g_type == "cricket") {
          table_name = "marketodds";
        } else if (g_type == "tennis") {
          table_name = "tennisodds";
        } else if (g_type == "soccer") {
          table_name = "soccerodds";
        }
        break;
      case 2:
        col_name = "is_suspended1";
        if (g_type == "cricket") {
          table_name = "marketodds";
        } else if (g_type == "tennis") {
          table_name = "tennisodds";
        } else if (g_type == "soccer") {
          table_name = "soccerodds";
        }
        break;
      case 3:
        col_name = "is_suspended2";
        if (g_type == "cricket") {
          table_name = "marketodds";
        } else if (g_type == "tennis") {
          table_name = "tennisodds";
        } else if (g_type == "soccer") {
          table_name = "soccerodds";
        }
        break;
      default:
        break;
    }

    const res = await executeQuery(event_id, col_name, table_name);
    const query_response = res[0];

    if (
      query_response[col_name] == 1 ||
      query_response.status == "SUSPENDED" ||
      query_response.status == "CLOSED"
    ) {
      return true;
    } else if (query_response[col_name] == 0) {
      return false;
    }
  } catch (err) {
    throw err;
  }
}

// A separate function to execute the query
function executeQuery(event_id, col_name, table_name) {
  return new Promise((resolve, reject) => {
    dbConn.query(
      "select status," +
        col_name +
        " from " +
        table_name +
        " where event_id = ?",
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
}

function is_session_suspended(event_id, runner_name) {
  return new Promise((resolve, reject) => {
    dbConn.query(
      "select game_status,is_suspended from sessions where event_id = ? and runner_name = ?",
      [event_id, runner_name],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          let is_suspend = res[0].is_suspended;
          if (
            is_suspend ||
            res[0].game_status == "SUSPENDED" ||
            res[0].game_status == "Suspended"
          ) {
            resolve(true);
          } else if (is_suspend == 0) {
            resolve(false);
          }
        }
      }
    );
  });
}

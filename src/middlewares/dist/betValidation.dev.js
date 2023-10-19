"use strict";

var Exposure = require("../models/exposure");

var Sessionbets = require("../models/sessionbets");

var Session = require("../models/session");

var MatchOdds = require("../models/marketodd");

var BookmakerOdd = require("../models/bookmakerodd");

var BookmakerBet = require("../models/bookmakerbet");

var TennisOdds = require("../models/tennisodd");

var SoccerOdds = require("../models/soccerodds");

var Matchbets = require("../models/matchbets");

var Tennisbets = require("../models/tennisbets");

var Soccerbets = require("../models/soccerbets");

var User = require("../models/user");

var dbConn = require("./../../config/db");

exports.validateBookmakerBet = function _callee(req, res, next) {
  var exp1, exp2, exp3, _req$body, user_id, event_id, market_id, price, bet_amount, main_type, type, runner_name, loss_amount, win_amount, index, g_type, enable_draw, is_suspend, change, last_min_exp, new_min_exp, final_balance, existing_matchbets, user_balance, user_exposure, result, _result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          exp1 = 0;
          exp2 = 0;
          exp3 = 0;
          _req$body = req.body, user_id = _req$body.user_id, event_id = _req$body.event_id, market_id = _req$body.market_id, price = _req$body.price, bet_amount = _req$body.bet_amount, main_type = _req$body.main_type, type = _req$body.type, runner_name = _req$body.runner_name, loss_amount = _req$body.loss_amount, win_amount = _req$body.win_amount, index = _req$body.index, g_type = _req$body.g_type, enable_draw = _req$body.enable_draw;
          enable_draw = JSON.parse(enable_draw);
          index = Number(index);
          _context.next = 9;
          return regeneratorRuntime.awrap(is_suspended(event_id, index, g_type));

        case 9:
          is_suspend = _context.sent;

          if (!is_suspend) {
            _context.next = 14;
            break;
          }

          res.status(500).send({
            error: "Bet Suspended..!!"
          });
          _context.next = 80;
          break;

        case 14:
          change = true;
          _context.t0 = g_type;
          _context.next = _context.t0 === "cricket" ? 18 : _context.t0 === "tennis" ? 22 : _context.t0 === "soccer" ? 26 : 30;
          break;

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(BookmakerOdd.checkBookmakerPriceChange(market_id, runner_name, type, price));

        case 20:
          change = _context.sent;
          return _context.abrupt("break", 31);

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap(TennisOdds.checkTennisOddPriceChange(market_id, runner_name, type, price));

        case 24:
          change = _context.sent;
          return _context.abrupt("break", 31);

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(SoccerOdds.checkSoccerOddPriceChange(market_id, runner_name, type, price));

        case 28:
          change = _context.sent;
          return _context.abrupt("break", 31);

        case 30:
          return _context.abrupt("break", 31);

        case 31:
          if (!change) {
            _context.next = 35;
            break;
          }

          res.status(500).send({
            error: "Odds Changed..!!"
          });
          _context.next = 80;
          break;

        case 35:
          // console.log(index, g_type, loss_amount, win_amount);
          last_min_exp = 0;
          new_min_exp = 0;
          final_balance = 0;
          existing_matchbets = [];

          if (type == "Back") {
            win_amount = (Number(price) * Number(bet_amount)).toFixed(2) - Number(bet_amount);
            loss_amount = 0 - Number(bet_amount);
          } else if (type == "Lay") {
            win_amount = Number(bet_amount);
            loss_amount = 0 - ((Number(price) * Number(bet_amount)).toFixed(2) - Number(bet_amount));
          }

          _context.next = 42;
          return regeneratorRuntime.awrap(User.getBalById(user_id));

        case 42:
          user_balance = _context.sent;
          _context.next = 45;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(user_id));

        case 45:
          user_exposure = _context.sent;
          _context.t1 = g_type;
          _context.next = _context.t1 === "cricket" ? 49 : _context.t1 === "tennis" ? 53 : _context.t1 === "soccer" ? 57 : 61;
          break;

        case 49:
          _context.next = 51;
          return regeneratorRuntime.awrap(BookmakerBet.getBookBetByEventIdByUserID(event_id, user_id));

        case 51:
          existing_matchbets = _context.sent;
          return _context.abrupt("break", 61);

        case 53:
          _context.next = 55;
          return regeneratorRuntime.awrap(Tennisbets.getTennisBetByEventIdByUserID(event_id, user_id));

        case 55:
          existing_matchbets = _context.sent;
          return _context.abrupt("break", 61);

        case 57:
          _context.next = 59;
          return regeneratorRuntime.awrap(Soccerbets.getSoccerBetByEventIdByUserID(event_id, user_id));

        case 59:
          existing_matchbets = _context.sent;
          return _context.abrupt("break", 61);

        case 61:
          if (!(existing_matchbets.length == 0)) {
            _context.next = 70;
            break;
          }

          _context.next = 64;
          return regeneratorRuntime.awrap(calculateFirstBetByIndex(index, type, win_amount, loss_amount));

        case 64:
          result = _context.sent;
          exp1 = result.exp1;
          exp2 = result.exp2;
          exp3 = result.exp3;
          _context.next = 77;
          break;

        case 70:
          if (enable_draw) {
            last_min_exp = Math.min(existing_matchbets[0].exp_amount1, existing_matchbets[0].exp_amount2, existing_matchbets[0].exp_amount3);
          } else if (enable_draw == false) {
            last_min_exp = Math.min(existing_matchbets[0].exp_amount1, existing_matchbets[0].exp_amount2);
          }

          _context.next = 73;
          return regeneratorRuntime.awrap(calculateExistingByIndex(index, type, win_amount, loss_amount, existing_matchbets[0]));

        case 73:
          _result = _context.sent;
          exp1 = _result.exp1;
          exp2 = _result.exp2;
          exp3 = _result.exp3;

        case 77:
          if (enable_draw) {
            new_min_exp = Math.min(exp1, exp2, exp3); // console.log("draw true", new_min_exp);
          } else if (enable_draw == false) {
            new_min_exp = Math.min(exp1, exp2); // console.log("draw false", new_min_exp);
          }

          final_balance = user_balance.balance + user_exposure[0].exp_amount - last_min_exp + new_min_exp; // console.log("exp1-->", typeof exp1, exp1);
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
            res.status(500).send({
              error: "Insufficient Balance"
            });
          }

        case 80:
          _context.next = 86;
          break;

        case 82:
          _context.prev = 82;
          _context.t2 = _context["catch"](0);
          console.log(_context.t2);
          res.send({
            error: _context.t2
          });

        case 86:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 82]]);
};

exports.validateMatchBet = function _callee2(req, res, next) {
  var exp1, exp2, exp3, _req$body2, user_id, event_id, market_id, price, bet_amount, main_type, type, runner_name, loss_amount, win_amount, index, g_type, enable_draw, is_suspend, change, last_min_exp, new_min_exp, final_balance, existing_matchbets, user_balance, user_exposure, result, _result2, userexpo;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.body);
          _context2.prev = 1;
          exp1 = 0;
          exp2 = 0;
          exp3 = 0;
          _req$body2 = req.body, user_id = _req$body2.user_id, event_id = _req$body2.event_id, market_id = _req$body2.market_id, price = _req$body2.price, bet_amount = _req$body2.bet_amount, main_type = _req$body2.main_type, type = _req$body2.type, runner_name = _req$body2.runner_name, loss_amount = _req$body2.loss_amount, win_amount = _req$body2.win_amount, index = _req$body2.index, g_type = _req$body2.g_type, enable_draw = _req$body2.enable_draw;
          enable_draw = JSON.parse(enable_draw);
          index = Number(index);
          _context2.next = 10;
          return regeneratorRuntime.awrap(is_suspended(event_id, index, g_type));

        case 10:
          is_suspend = _context2.sent;

          if (!is_suspend) {
            _context2.next = 15;
            break;
          }

          res.status(500).send({
            error: "Bet Suspended..!!"
          });
          _context2.next = 84;
          break;

        case 15:
          change = true;
          _context2.t0 = g_type;
          _context2.next = _context2.t0 === "cricket" ? 19 : _context2.t0 === "tennis" ? 23 : _context2.t0 === "soccer" ? 27 : 31;
          break;

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(MatchOdds.checkMatchOddPriceChange(market_id, runner_name, type, price));

        case 21:
          change = _context2.sent;
          return _context2.abrupt("break", 32);

        case 23:
          _context2.next = 25;
          return regeneratorRuntime.awrap(TennisOdds.checkTennisOddPriceChange(market_id, runner_name, type, price));

        case 25:
          change = _context2.sent;
          return _context2.abrupt("break", 32);

        case 27:
          _context2.next = 29;
          return regeneratorRuntime.awrap(SoccerOdds.checkSoccerOddPriceChange(market_id, runner_name, type, price));

        case 29:
          change = _context2.sent;
          return _context2.abrupt("break", 32);

        case 31:
          return _context2.abrupt("break", 32);

        case 32:
          if (!change) {
            _context2.next = 36;
            break;
          }

          res.status(500).send({
            error: "Odds Changed..!!"
          });
          _context2.next = 84;
          break;

        case 36:
          // console.log(index, g_type, loss_amount, win_amount);
          last_min_exp = 0;
          new_min_exp = 0;
          final_balance = 0;
          existing_matchbets = [];

          if (type == "Back") {
            win_amount = (Number(price) * Number(bet_amount)).toFixed(2) - Number(bet_amount);
            loss_amount = 0 - Number(bet_amount);
          } else if (type == "Lay") {
            win_amount = Number(bet_amount);
            loss_amount = 0 - ((Number(price) * Number(bet_amount)).toFixed(2) - Number(bet_amount));
          }

          _context2.next = 43;
          return regeneratorRuntime.awrap(User.getBalById(user_id));

        case 43:
          user_balance = _context2.sent;
          _context2.next = 46;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(user_id));

        case 46:
          user_exposure = _context2.sent;
          _context2.t1 = g_type;
          _context2.next = _context2.t1 === "cricket" ? 50 : _context2.t1 === "tennis" ? 54 : _context2.t1 === "soccer" ? 58 : 62;
          break;

        case 50:
          _context2.next = 52;
          return regeneratorRuntime.awrap(Matchbets.getMatchBetByEventIdByUserID(event_id, user_id));

        case 52:
          existing_matchbets = _context2.sent;
          return _context2.abrupt("break", 62);

        case 54:
          _context2.next = 56;
          return regeneratorRuntime.awrap(Tennisbets.getTennisBetByEventIdByUserID(event_id, user_id));

        case 56:
          existing_matchbets = _context2.sent;
          return _context2.abrupt("break", 62);

        case 58:
          _context2.next = 60;
          return regeneratorRuntime.awrap(Soccerbets.getSoccerBetByEventIdByUserID(event_id, user_id));

        case 60:
          existing_matchbets = _context2.sent;
          return _context2.abrupt("break", 62);

        case 62:
          if (!(existing_matchbets.length == 0)) {
            _context2.next = 71;
            break;
          }

          _context2.next = 65;
          return regeneratorRuntime.awrap(calculateFirstBetByIndex(index, type, win_amount, loss_amount));

        case 65:
          result = _context2.sent;
          exp1 = result.exp1;
          exp2 = result.exp2;
          exp3 = result.exp3;
          _context2.next = 78;
          break;

        case 71:
          if (enable_draw) {
            last_min_exp = Math.min(existing_matchbets[0].exp_amount1, existing_matchbets[0].exp_amount2, existing_matchbets[0].exp_amount3);
          } else if (enable_draw == false) {
            last_min_exp = Math.min(existing_matchbets[0].exp_amount1, existing_matchbets[0].exp_amount2);
          }

          _context2.next = 74;
          return regeneratorRuntime.awrap(calculateExistingByIndex(index, type, win_amount, loss_amount, existing_matchbets[0]));

        case 74:
          _result2 = _context2.sent;
          exp1 = _result2.exp1;
          exp2 = _result2.exp2;
          exp3 = _result2.exp3;

        case 78:
          if (enable_draw) {
            new_min_exp = Math.min(exp1, exp2, exp3); // console.log("draw true", new_min_exp);
          } else if (enable_draw == false) {
            new_min_exp = Math.min(exp1, exp2); // console.log("draw false", new_min_exp);
          }

          userexpo = Math.abs(user_exposure[0].exp_amount - bet_amount);

          if (!(user_balance.exposure_limit < userexpo)) {
            _context2.next = 82;
            break;
          }

          return _context2.abrupt("return", res.status(200).send({
            error: "Exposure exceeded"
          }));

        case 82:
          final_balance = user_balance.balance + user_exposure[0].exp_amount - last_min_exp + new_min_exp; // console.log("exp1-->", typeof exp1, exp1);
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
            res.status(500).send({
              error: "Insufficient Balance"
            });
          }

        case 84:
          _context2.next = 90;
          break;

        case 86:
          _context2.prev = 86;
          _context2.t2 = _context2["catch"](1);
          console.log(_context2.t2);
          res.send({
            error: _context2.t2
          });

        case 90:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 86]]);
};

exports.validateSessionBet = function _callee3(req, res, next) {
  var exp1, exp2, _req$body3, user_id, event_id, main_type, type, runner_name, price, size, bet_amount, loss_amount, win_amount, exp_amount1, exp_amount2, is_suspend, change, last_min_exp, new_min_exp, final_balance, user_balance, user_exposure, existing_sessionbet, userexpo;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("validating session");
          _context3.prev = 1;
          exp1 = 0;
          exp2 = 0;
          _req$body3 = req.body, user_id = _req$body3.user_id, event_id = _req$body3.event_id, main_type = _req$body3.main_type, type = _req$body3.type, runner_name = _req$body3.runner_name, price = _req$body3.price, size = _req$body3.size, bet_amount = _req$body3.bet_amount, loss_amount = _req$body3.loss_amount, win_amount = _req$body3.win_amount, exp_amount1 = _req$body3.exp_amount1, exp_amount2 = _req$body3.exp_amount2;
          _context3.next = 7;
          return regeneratorRuntime.awrap(is_session_suspended(event_id, runner_name));

        case 7:
          is_suspend = _context3.sent;
          console.log("sus-->", is_suspend);

          if (!is_suspend) {
            _context3.next = 13;
            break;
          }

          res.status(500).send({
            error: "Bet Suspended..!!"
          });
          _context3.next = 63;
          break;

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(Session.checkOddChange(event_id, runner_name, type, Number(size)));

        case 15:
          change = _context3.sent;

          if (!change) {
            _context3.next = 20;
            break;
          }

          res.status(500).send({
            error: "Odds Changed..!!"
          });
          _context3.next = 63;
          break;

        case 20:
          last_min_exp = 0;
          new_min_exp = 0;
          final_balance = 0;

          if (Number(size) <= 100) {
            loss_amount = bet_amount / 100 * 100;
            win_amount = bet_amount / 100 * Number(size);
          } else {
            loss_amount = bet_amount / 100 * Number(size);
            win_amount = bet_amount / 100 * 100;
          }

          _context3.next = 26;
          return regeneratorRuntime.awrap(User.getBalById(user_id));

        case 26:
          user_balance = _context3.sent;
          _context3.next = 29;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(user_id));

        case 29:
          user_exposure = _context3.sent;
          _context3.next = 32;
          return regeneratorRuntime.awrap(Sessionbets.getSessionByRunnerEvent(user_id, event_id, runner_name));

        case 32:
          existing_sessionbet = _context3.sent;

          if (!(existing_sessionbet.length == 0)) {
            _context3.next = 46;
            break;
          }

          _context3.t0 = type;
          _context3.next = _context3.t0 === "Back" ? 37 : _context3.t0 === "Lay" ? 40 : 43;
          break;

        case 37:
          exp1 = Number(win_amount);
          exp2 = Number(0 - loss_amount);
          return _context3.abrupt("break", 44);

        case 40:
          exp1 = Number(0 - loss_amount);
          exp2 = Number(win_amount);
          return _context3.abrupt("break", 44);

        case 43:
          return _context3.abrupt("break", 44);

        case 44:
          _context3.next = 57;
          break;

        case 46:
          last_min_exp = Math.min(existing_sessionbet[0].exp_amount1, existing_sessionbet[0].exp_amount2);
          _context3.t1 = type;
          _context3.next = _context3.t1 === "Back" ? 50 : _context3.t1 === "Lay" ? 53 : 56;
          break;

        case 50:
          exp1 = existing_sessionbet[0].exp_amount1 + Number(win_amount);
          exp2 = existing_sessionbet[0].exp_amount2 + Number(0 - loss_amount);
          return _context3.abrupt("break", 57);

        case 53:
          exp1 = existing_sessionbet[0].exp_amount1 + Number(0 - loss_amount);
          exp2 = existing_sessionbet[0].exp_amount2 + Number(win_amount);
          return _context3.abrupt("break", 57);

        case 56:
          return _context3.abrupt("break", 57);

        case 57:
          new_min_exp = Math.min(exp1, exp2);
          userexpo = Math.abs(user_exposure[0].exp_amount - bet_amount);

          if (!(user_balance.exposure_limit < userexpo)) {
            _context3.next = 61;
            break;
          }

          return _context3.abrupt("return", res.status(200).send({
            error: "Exposure exceeded"
          }));

        case 61:
          final_balance = user_balance.balance + user_exposure[0].exp_amount - last_min_exp + new_min_exp; // console.log("LA-->", Number(loss_amount).toFixed(2));
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
            res.status(500).send({
              error: "Insufficient Balance"
            });
          }

        case 63:
          _context3.next = 69;
          break;

        case 65:
          _context3.prev = 65;
          _context3.t2 = _context3["catch"](1);
          console.log(_context3.t2);
          res.send({
            error: _context3.t2
          });

        case 69:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 65]]);
};

function calculateFirstBetByIndex(index, type, win_amount, loss_amount) {
  // console.log("from methd", type, win_amount, loss_amount);
  return new Promise(function (resolve, reject) {
    var exp1 = 0;
    var exp2 = 0;
    var exp3 = 0; // console.log(typeof index);

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
    } // console.log("fir exp-->", exp1, exp2, exp3);
    // Resolve the results as an object


    resolve({
      exp1: exp1,
      exp2: exp2,
      exp3: exp3
    });
  });
}

function calculateExistingByIndex(index, type, win_amount, loss_amount, last_matchbet) {
  return new Promise(function (resolve, reject) {
    // console.log("from methd--->", index, type, win_amount, loss_amount);
    var exp1 = 0;
    var exp2 = 0;
    var exp3 = 0;

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
    } // console.log("fir exp-->", exp1, exp2, exp3);
    // Resolve the results as an object


    resolve({
      exp1: exp1,
      exp2: exp2,
      exp3: exp3
    });
  });
}

function is_suspended(event_id, index, g_type) {
  var col_name, table_name, res, query_response;
  return regeneratorRuntime.async(function is_suspended$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          col_name = "";
          _context4.t0 = index;
          _context4.next = _context4.t0 === 1 ? 5 : _context4.t0 === 2 ? 8 : _context4.t0 === 3 ? 11 : 14;
          break;

        case 5:
          col_name = "is_suspended0";

          if (g_type == "cricket") {
            table_name = "marketodds";
          } else if (g_type == "tennis") {
            table_name = "tennisodds";
          } else if (g_type == "soccer") {
            table_name = "soccerodds";
          }

          return _context4.abrupt("break", 15);

        case 8:
          col_name = "is_suspended1";

          if (g_type == "cricket") {
            table_name = "marketodds";
          } else if (g_type == "tennis") {
            table_name = "tennisodds";
          } else if (g_type == "soccer") {
            table_name = "soccerodds";
          }

          return _context4.abrupt("break", 15);

        case 11:
          col_name = "is_suspended2";

          if (g_type == "cricket") {
            table_name = "marketodds";
          } else if (g_type == "tennis") {
            table_name = "tennisodds";
          } else if (g_type == "soccer") {
            table_name = "soccerodds";
          }

          return _context4.abrupt("break", 15);

        case 14:
          return _context4.abrupt("break", 15);

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(executeQuery(event_id, col_name, table_name));

        case 17:
          res = _context4.sent;
          query_response = res[0];

          if (!(query_response[col_name] == 1 || query_response.status == "SUSPENDED" || query_response.status == "CLOSED")) {
            _context4.next = 23;
            break;
          }

          return _context4.abrupt("return", true);

        case 23:
          if (!(query_response[col_name] == 0)) {
            _context4.next = 25;
            break;
          }

          return _context4.abrupt("return", false);

        case 25:
          _context4.next = 30;
          break;

        case 27:
          _context4.prev = 27;
          _context4.t1 = _context4["catch"](0);
          throw _context4.t1;

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 27]]);
} // A separate function to execute the query


function executeQuery(event_id, col_name, table_name) {
  return new Promise(function (resolve, reject) {
    dbConn.query("select status," + col_name + " from " + table_name + " where event_id = ?", event_id, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function is_session_suspended(event_id, runner_name) {
  return new Promise(function (resolve, reject) {
    dbConn.query("select game_status,is_suspended from sessions where event_id = ? and runner_name = ?", [event_id, runner_name], function (err, res) {
      if (err) {
        reject(err);
      } else {
        var is_suspend = res[0].is_suspended;

        if (is_suspend || res[0].game_status == "SUSPENDED" || res[0].game_status == "Suspended") {
          resolve(true);
        } else if (is_suspend == 0) {
          resolve(false);
        }
      }
    });
  });
}
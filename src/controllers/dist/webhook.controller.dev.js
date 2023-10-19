"use strict";

var User = require("../models/user");

var Exposure = require("../models/exposure");

var ServerLog = require("../models/serverlog");

var CasinoBets = require("../models/casino_bets");

var CasinoResult = require("../models/casino_results");

var CasinoLadger = require("../models/casino_ladger");

var Ladger = require("../models/ledger"); // Helper function for generating responses


function generateResponse(error, message) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    code: 0,
    error: error ? true : false,
    message: message,
    data: data
  };
}

exports.casinowebhook = function _callee(req, res) {
  var _req$body, username, bal, gameId, gameName, roundId, transactionId, sessionId, betId, action, finishedRequest, data, user, ress, usere, casino_data, isFinished, balanceDeduct, betTotal;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, bal = _req$body.bal, gameId = _req$body.gameId, gameName = _req$body.gameName, roundId = _req$body.roundId, transactionId = _req$body.transactionId, sessionId = _req$body.sessionId, betId = _req$body.betId, action = _req$body.action, finishedRequest = _req$body.finished;
          data = {
            url: "/casino-webhook",
            response: JSON.stringify(req.body)
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(ServerLog.savelog(data));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.getCasinoBalance(username));

        case 7:
          user = _context.sent;
          ress = generateResponse(true, "not found");

          if (!user) {
            _context.next = 41;
            break;
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(user.id));

        case 12:
          usere = _context.sent;
          ress = generateResponse(false, "Success", {
            username: username,
            userBalance: user.balance + usere[0].exp_amount
          });
          casino_data = {
            user_id: user.id,
            amount: bal,
            gameid: gameId,
            game_name: gameName,
            roundid: roundId,
            txn_id: transactionId,
            session_id: sessionId,
            betid: betId
          };
          _context.next = 17;
          return regeneratorRuntime.awrap(check_finished(casino_data));

        case 17:
          isFinished = _context.sent;
          _context.t0 = action;
          _context.next = _context.t0 === "bet" ? 21 : _context.t0 === "win" ? 28 : _context.t0 === "lose" ? 28 : _context.t0 === "refund" ? 40 : 41;
          break;

        case 21:
          if (!isFinished) {
            _context.next = 27;
            break;
          }

          _context.next = 24;
          return regeneratorRuntime.awrap(CasinoBets.savedata(casino_data));

        case 24:
          balanceDeduct = -Math.abs(casino_data.amount);
          _context.next = 27;
          return regeneratorRuntime.awrap(User.updateCasinoBalance(casino_data.user_id, balanceDeduct));

        case 27:
          return _context.abrupt("break", 41);

        case 28:
          // save win lose data
          casino_data.type = action;
          _context.next = 31;
          return regeneratorRuntime.awrap(CasinoBets.calculateProfit(casino_data.user_id, casino_data.gameid, casino_data.roundid));

        case 31:
          betTotal = _context.sent;

          if (action === "lose") {
            casino_data.profit = -Math.abs(betTotal);
            casino_data.amount = -Math.abs(betTotal);
          } else {
            casino_data.profit = casino_data.amount - betTotal;
          }

          if (!isFinished) {
            _context.next = 36;
            break;
          }

          _context.next = 36;
          return regeneratorRuntime.awrap(CasinoResult.savedata(casino_data));

        case 36:
          if (!(isFinished && finishedRequest === 1)) {
            _context.next = 39;
            break;
          }

          _context.next = 39;
          return regeneratorRuntime.awrap(markAsFinished(casino_data.amount, user.id, gameId, casino_data.game_name, roundId, action, casino_data.profit, casino_data.txn_id));

        case 39:
          return _context.abrupt("break", 41);

        case 40:
          return _context.abrupt("break", 41);

        case 41:
          return _context.abrupt("return", res.status(200).send(ress));

        case 44:
          _context.prev = 44;
          _context.t1 = _context["catch"](0);
          console.error('Error', _context.t1);
          res.status(500).json({
            error: 'something went wrong'
          });

        case 48:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 44]]);
};

var check_finished = function check_finished(casino_data) {
  var user_id, gameid, roundid, isFinished;
  return regeneratorRuntime.async(function check_finished$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user_id = casino_data.user_id, gameid = casino_data.gameid, roundid = casino_data.roundid;
          _context2.next = 3;
          return regeneratorRuntime.awrap(CasinoBets.checkFinished(user_id, gameid, roundid));

        case 3:
          isFinished = _context2.sent;
          return _context2.abrupt("return", isFinished);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var markAsFinished = function markAsFinished(amount, user_id, gameid, game_name, roundid, type, profit, txn_id) {
  return regeneratorRuntime.async(function markAsFinished$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(CasinoResult.markAsFinished(user_id, gameid, roundid));

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(makeLadger(amount, user_id, gameid, game_name, roundid, type, profit, txn_id));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var saveExposure = function saveExposure(casino_data, amount) {
  var exposure_data;
  return regeneratorRuntime.async(function saveExposure$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          exposure_data = {
            user_id: casino_data.user_id,
            deducted_amount: amount,
            exp_amount: amount,
            event_id: casino_data.gameid,
            runner_name: casino_data.roundid,
            main_type: "casino",
            type: "casino",
            price: "0",
            size: "0",
            difference: "0"
          };
          _context4.next = 3;
          return regeneratorRuntime.awrap(Exposure.addExposure(exposure_data));

        case 3:
          return _context4.abrupt("return", _context4.sent);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var makeLadger = function makeLadger(amount, user_id, gameid, game_name, roundid, type, profit) {
  var txn_id,
      ledger_data,
      ledger_data2,
      _args5 = arguments;
  return regeneratorRuntime.async(function makeLadger$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          txn_id = _args5.length > 7 && _args5[7] !== undefined ? _args5[7] : "";
          ledger_data = {};
          ledger_data.user_id = user_id;
          ledger_data.game_name = game_name;
          ledger_data.gameid = gameid;
          ledger_data.roundid = roundid;
          ledger_data.profit_loss = profit;
          ledger_data.description = "".concat(type, " Rs").concat(profit, " at Txn id: ").concat(txn_id);
          ledger_data.type = 'game';
          ledger_data.subtype = profit < 1 ? "withdraw" : "deposit"; // with update casino balance

          if (!(type == 'win')) {
            _context5.next = 13;
            break;
          }

          _context5.next = 13;
          return regeneratorRuntime.awrap(User.updateCasinoBalance(user_id, amount));

        case 13:
          // await Exposure.markAsCloseExposure(user_id,gameid,roundid);
          ledger_data2 = {
            user_id: ledger_data.user_id,
            event_name: "game data ".concat(ledger_data.game_name, "/ ").concat(ledger_data.gameid, "/ ").concat(ledger_data.roundid),
            type: "casino",
            subtype: ledger_data.subtype,
            runner_name: ledger_data.description,
            profit_loss: ledger_data.profit_loss
          };
          _context5.next = 16;
          return regeneratorRuntime.awrap(Ladger.savedata(ledger_data2));

        case 16:
          return _context5.abrupt("return", _context5.sent);

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.casinobalwebhook = function _callee2(req, res) {
  var data, username, user, ress, usere;
  return regeneratorRuntime.async(function _callee2$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          // save logs 
          data = {
            url: "/casino-webhook-bal",
            response: JSON.stringify(req.body)
          };
          _context6.next = 4;
          return regeneratorRuntime.awrap(ServerLog.savelog(data));

        case 4:
          if (!(req.body.action == "bal" || true)) {
            _context6.next = 16;
            break;
          }

          username = req.body.username;
          _context6.next = 8;
          return regeneratorRuntime.awrap(User.getCasinoBalance(username));

        case 8:
          user = _context6.sent;
          ress = generateResponse(true, "not found");

          if (!user) {
            _context6.next = 15;
            break;
          }

          _context6.next = 13;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(user.id));

        case 13:
          usere = _context6.sent;
          ress = generateResponse(false, "Success", {
            username: username,
            userBalance: user.balance + usere[0].exp_amount
          });

        case 15:
          return _context6.abrupt("return", res.status(200).send(ress));

        case 16:
          _context6.next = 22;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          console.log('Error', _context6.t0.message);
          res.status(500).json({
            'error': 'something went wrong'
          });

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 18]]);
};
"use strict";

var User = require("../models/user");

var Exposure = require("../models/exposure");

var CasinoTxn = require("../models/casino_txn");

var CasinoLadger = require("../models/casino_ladger");

var axios = require("axios");

exports.accountActivation = function _callee(req, res) {
  var user, response, api_response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.casinoAccountActivation(req.userData.user.id));

        case 3:
          user = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(axios.post(process.env.CASINO_API + "addUser?liveMode=true&username=" + user.username, {}, {
            headers: {
              'Content-Type': 'application/json',
              'authtoken': process.env.CASINO_API_TOKEN
            }
          }));

        case 6:
          response = _context.sent;
          api_response = response.data;
          return _context.abrupt("return", res.status(200).json(api_response));

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log('Error', _context.t0.message);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.getvenderlist = function _callee2(req, res) {
  var response, vendorList;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(axios.get(process.env.CASINO_API + "vendorList", {
            headers: {
              'Content-Type': 'application/json',
              'authtoken': process.env.CASINO_API_TOKEN
            }
          }));

        case 3:
          response = _context2.sent;
          vendorList = response.data; // return res.json(vendorList);

          if (!vendorList.error) {
            res.json(vendorList.data);
          } else {
            res.status(403).json({
              error: 'not found'
            });
          }

          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log('Error', _context2.t0.message);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getGamelistByprovider = function _callee3(req, res) {
  var provider_code, response, gameList;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          provider_code = req.params.provider;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(axios.get(process.env.CASINO_API + "gameList?provider=" + provider_code, {
            headers: {
              'Content-Type': 'application/json',
              'authtoken': process.env.CASINO_API_TOKEN
            }
          }));

        case 4:
          response = _context3.sent;
          gameList = response.data;

          if (!gameList.error) {
            res.json(gameList.data.gameList);
          } else {
            res.status(403).json({
              error: 'not found'
            });
          }

          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](1);
          console.log('Error', _context3.t0.message);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.getGameUrlByid = function _callee4(req, res) {
  var gameid, response, gameData;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          gameid = req.params.gameid;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(axios.get(process.env.CASINO_API + "getGameUrl?livemode=true&username=".concat(req.userData.user.username, "&gameId=").concat(gameid), {
            headers: {
              'Content-Type': 'application/json',
              'authtoken': process.env.CASINO_API_TOKEN
            }
          }));

        case 4:
          response = _context4.sent;
          gameData = response.data;

          if (!gameData.error) {
            res.json({
              "url": gameData.data.url
            });
          } else {
            res.status(403).json({
              error: 'not active'
            });
          }

          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](1);
          console.log('Error', _context4.t0.message);

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.depositRequest = function _callee5(req, res) {
  var user_id, amount, user, balance, usere, exposure, percent, txn_id, casino_points;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          user_id = req.userData.user.id;
          amount = req.body.amount;
          _context5.next = 5;
          return regeneratorRuntime.awrap(User.getBalById(user_id));

        case 5:
          user = _context5.sent;
          balance = user.balance;
          _context5.next = 9;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(user_id));

        case 9:
          usere = _context5.sent;
          exposure = usere[0].exp_amount;

          if (!(balance + exposure < amount)) {
            _context5.next = 13;
            break;
          }

          return _context5.abrupt("return", res.json({
            error: 'Low balance'
          }));

        case 13:
          percent = 50; // in %

          txn_id = (Math.random() + 1).toString(36).substring(2); // calculate casino points

          casino_points = percent / 100 * amount;
          _context5.next = 18;
          return regeneratorRuntime.awrap(CasinoTxn.saveData({
            user_id: user_id,
            amount: amount,
            casino_points: casino_points,
            txn_id: txn_id,
            type: 'deposit'
          }));

        case 18:
          _context5.next = 20;
          return regeneratorRuntime.awrap(CasinoTxn.saveFundLadger(user_id, amount, casino_points, 'deposit'));

        case 20:
          _context5.next = 22;
          return regeneratorRuntime.awrap(makeCasinoLadger(user_id, casino_points, 'deposit'));

        case 22:
          _context5.next = 24;
          return regeneratorRuntime.awrap(User.updateCasinoAndMainBalance(user_id, amount, casino_points, 'deposit'));

        case 24:
          res.json({
            'success': true
          });
          _context5.next = 31;
          break;

        case 27:
          _context5.prev = 27;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(500).send("Error getting data");

        case 31:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.getCasinoDepositRequest = function _callee6(req, res) {
  var user_id, user_requests;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          user_id = req.params.user_id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(CasinoTxn.getCasinoTxnRequests(user_id, 'deposit'));

        case 4:
          user_requests = _context6.sent;
          res.status(200).send(user_requests);
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.withdrawRequest = function _callee7(req, res) {
  var user_id, amount, user, balance, percent, txn_id, casino_points;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          user_id = req.userData.user.id;
          amount = req.body.amount;
          _context7.next = 5;
          return regeneratorRuntime.awrap(User.getBalById(user_id));

        case 5:
          user = _context7.sent;
          balance = user.casino_balance;

          if (!(balance < amount)) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.json({
            error: 'Low balance'
          }));

        case 9:
          percent = 50; // in %

          txn_id = (Math.random() + 1).toString(36).substring(2); // convert casino points to amount

          casino_points = amount;
          amount = amount * 100 / (100 - percent);
          _context7.next = 15;
          return regeneratorRuntime.awrap(CasinoTxn.saveData({
            user_id: user_id,
            amount: amount,
            casino_points: casino_points,
            txn_id: txn_id,
            type: 'withdraw'
          }));

        case 15:
          _context7.next = 17;
          return regeneratorRuntime.awrap(CasinoTxn.saveFundLadger(user_id, amount, casino_points, 'withdraw'));

        case 17:
          _context7.next = 19;
          return regeneratorRuntime.awrap(makeCasinoLadger(user_id, casino_points, 'withdraw'));

        case 19:
          _context7.next = 21;
          return regeneratorRuntime.awrap(User.updateCasinoAndMainBalance(user_id, amount, casino_points, 'withdraw'));

        case 21:
          res.json({
            'success': true
          });
          _context7.next = 28;
          break;

        case 24:
          _context7.prev = 24;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).send("Error getting data");

        case 28:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var makeCasinoLadger = function makeCasinoLadger(user_id, points, type) {
  var ledger_data;
  return regeneratorRuntime.async(function makeCasinoLadger$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          ledger_data = {};
          ledger_data.user_id = user_id;

          if (type == 'deposit') {
            ledger_data.profit_loss = points;
            ledger_data.description = "".concat(points, "p diposit into wallet");
          } else {
            ledger_data.profit_loss = -Math.abs(points);
            ledger_data.description = "".concat(points, "p withdraw from the wallet");
          }

          ledger_data.type = 'fund';
          ledger_data.subtype = type;
          _context8.next = 7;
          return regeneratorRuntime.awrap(CasinoLadger.savedata(ledger_data));

        case 7:
          return _context8.abrupt("return", _context8.sent);

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.getCasinoWithdrawRequest = function _callee8(req, res) {
  var user_id, user_requests;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          user_id = req.params.user_id;
          _context9.next = 4;
          return regeneratorRuntime.awrap(CasinoTxn.getCasinoTxnRequests(user_id, 'withdraw'));

        case 4:
          user_requests = _context9.sent;
          res.status(200).send(user_requests);
          _context9.next = 12;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getClientLedgerByDays = function _callee9(req, res) {
  var user_id, days, data;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          user_id = req.params.user_id;
          days = req.params.days;
          _context10.next = 5;
          return regeneratorRuntime.awrap(CasinoLadger.getClientLedgerByDays(user_id, days));

        case 5:
          data = _context10.sent;
          res.send(data);
          _context10.next = 13;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
};
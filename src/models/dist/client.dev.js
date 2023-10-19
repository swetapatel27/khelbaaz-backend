"use strict";

var dbConn = require("./../../config/db");

var User = require("../models/user");

var Ladger = require("../models/ledger");

var Setting = require("../models/settings");

var Bonus = require("./bonus");

require("dotenv").config();

var ClientMaster = function ClientMaster(user) {
  this.role = user.role;
  this.name = user.name;
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
  this.contact = user.contact;
  this.creator_id = user.creator_id;
  this.referer_name = user.referer_name;
};

ClientMaster.register = function (newUser, result) {
  if (newUser.referer_name == null) {
    newUser['creator_id'] = 1;
    dbConn.query("INSERT INTO users set ?", newUser, function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
        Bonus.addBonus(newUser.username); //return false;
      }
    });
  } else {
    dbConn.query("select id,creator_id from users where username = ?", newUser.referer_name, function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        if (res[0].id.length == 0) {
          result("No such referer exists");
        } else {
          newUser["creator_id"] = res[0].creator_id + "," + res[0].id;
          newUser["added_by"] = res[0].id;
          newUser["balance"] = 0;
        }

        dbConn.query("INSERT INTO users set ?", newUser, function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
          } else {
            Bonus.addBonus(newUser.username);
            Bonus.getReferralBonus(newUser.referer_name); //joiningBonus(res.insertId);

            result(null, res.insertId);
          }
        });
      }
    });
  }
};

ClientMaster.testt = function _callee(user_id) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var ft = joiningBonus(user_id);

            if (ft) {
              resolve(ft);
            } else {
              reject('Failed to join bonus');
            }
          }));

        case 3:
          result = _context.sent;
          return _context.abrupt("return", result);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var joiningBonus = function joiningBonus(user_id) {
  var bonus_amount, ledger_data, res;
  return regeneratorRuntime.async(function joiningBonus$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Setting.getJoiningBonus());

        case 2:
          bonus_amount = _context2.sent;

          if (!(bonus_amount < 1)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", false);

        case 5:
          ledger_data = {
            user_id: user_id,
            event_name: "joining bonus",
            type: "fund",
            subtype: 'deposit',
            runner_name: 'joining bonus',
            profit_loss: bonus_amount
          };
          _context2.next = 8;
          return regeneratorRuntime.awrap(Ladger.savedata(ledger_data));

        case 8:
          res = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(User.updateMainBalance(user_id, bonus_amount));

        case 11:
          return _context2.abrupt("return", res);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = ClientMaster;
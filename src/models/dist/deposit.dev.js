"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dbConn = require("./../../config/db");

var Exposure = require("./exposure");

require("dotenv").config();

var Bonus = require("./bonus");

var DepositMaster = function DepositMaster(deposit) {
  this.user_id = deposit.user_id;
  this.method = deposit.method;
  this.amount = deposit.amount; // this.paytm = withdraw.paytm;
  // this.gpay = withdraw.gpay;
  // this.account_id = withdraw.account_id;
  // this.ifsc_code = withdraw.ifsc_code;
  // this.bank_name = withdraw.bank_name;
  // this.branch = withdraw.branch;

  this.transaction_id = deposit.transaction_id;
  this.username = deposit.username;
};

DepositMaster.checkLastRequest = function _callee(user_id) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT count(*) as total FROM depositrequests WHERE user_id = ? AND status = 0", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                if (res[0].total > 0) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              }
            });
          }));

        case 3:
          result = _context.sent;
          return _context.abrupt("return", result);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

DepositMaster.checkRefNo = function _callee2(user_id, txn_no) {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT count(*) as total FROM depositrequests WHERE user_id = ? AND transaction_id = ?", [user_id, txn_no], function (err, res) {
              if (err) {
                reject(err);
              } else {
                if (res[0].total > 0) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              }
            });
          }));

        case 3:
          result = _context2.sent;
          return _context2.abrupt("return", result);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

DepositMaster.addDepositRequest = function _callee3(deposit, fileUrl) {
  var exposure, user_data, deposit_data, result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(deposit.user_id));

        case 3:
          exposure = _context3.sent;
          console.log("exposure-->", exposure[0].exp_amount);
          _context3.next = 7;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from users where id = ?", [deposit.user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0]);
              }
            });
          }));

        case 7:
          user_data = _context3.sent;
          // if (user_data.balance + exposure[0].exp_amount > deposit.amount) {
          deposit_data = _objectSpread({}, deposit, {
            depo_proof: fileUrl,
            // admin_id: user_data.creator_id.split(",").pop(),
            admin_id: 1
          });
          _context3.next = 11;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO depositrequests set ?", [deposit_data], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 11:
          result = _context3.sent;
          return _context3.abrupt("return", result);

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

DepositMaster.updateStatusDepositRequest = function _callee4(status, user_id, req_id) {
  var result, result1, amount;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log("status-->", status, user_id, req_id);
          _context4.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update depositrequests set status = ? where user_id = ? and id = ?", [status, user_id, req_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          result = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select count(*) as total_requests from depositrequests where user_id = ? AND status=1", user_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].total_requests);
              }
            });
          }));

        case 7:
          result1 = _context4.sent;

          if (!(result1 == 1)) {
            _context4.next = 15;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select amount from depositrequests where user_id = ? AND status=1", user_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].amount);
              }
            });
          }));

        case 11:
          amount = _context4.sent;
          console.log(amount, user_id);
          _context4.next = 15;
          return regeneratorRuntime.awrap(Bonus.firstDepositBonus(amount, user_id));

        case 15:
          return _context4.abrupt("return", result);

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

DepositMaster.getUserDepositRequests = function _callee5(user_id) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from depositrequests where user_id = ? ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status", user_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context5.sent;
          return _context5.abrupt("return", result);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

DepositMaster.getAdminDepositRequests = function _callee6(admin_id) {
  var status,
      days,
      qry,
      qryData,
      wr,
      searchStatus,
      _searchStatus,
      result,
      _args6 = arguments;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          status = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : 'all';
          days = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : -1;
          _context6.prev = 2;
          wr = '';

          if (!(admin_id == 1)) {
            _context6.next = 24;
            break;
          }

          qryData = [];

          if (!(days && status)) {
            _context6.next = 21;
            break;
          }

          if (days > -1) {
            wr = 'WHERE updated_at > CURRENT_DATE - INTERVAL ? DAY';
            qryData.push(days);
          }

          if (!(status != 'all')) {
            _context6.next = 21;
            break;
          }

          _context6.t0 = status;
          _context6.next = _context6.t0 === 'pending' ? 12 : _context6.t0 === 'approved' ? 14 : _context6.t0 === 'declined' ? 16 : 18;
          break;

        case 12:
          searchStatus = 0;
          return _context6.abrupt("break", 19);

        case 14:
          searchStatus = 1;
          return _context6.abrupt("break", 19);

        case 16:
          searchStatus = -1;
          return _context6.abrupt("break", 19);

        case 18:
          searchStatus = status;

        case 19:
          wr += ' AND status = ?';
          qryData.push(searchStatus);

        case 21:
          qry = "select * from depositrequests ".concat(wr, " ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status, updated_at desc");
          _context6.next = 41;
          break;

        case 24:
          qryData = [admin_id];

          if (!(days && status)) {
            _context6.next = 40;
            break;
          }

          if (days > -1) {
            wr = 'WHERE updated_at > CURRENT_DATE - INTERVAL ? DAY';
            qryData.push(days);
          }

          if (!(status != 'all')) {
            _context6.next = 40;
            break;
          }

          _context6.t1 = status;
          _context6.next = _context6.t1 === 'pending' ? 31 : _context6.t1 === 'approved' ? 33 : _context6.t1 === 'declined' ? 35 : 37;
          break;

        case 31:
          _searchStatus = 0;
          return _context6.abrupt("break", 38);

        case 33:
          _searchStatus = 1;
          return _context6.abrupt("break", 38);

        case 35:
          _searchStatus = -1;
          return _context6.abrupt("break", 38);

        case 37:
          _searchStatus = status;

        case 38:
          wr += ' AND status = ?';
          qryData.push(_searchStatus);

        case 40:
          qry = "select * from depositrequests where admin_id = ? ".concat(wr, " ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status, updated_at desc");

        case 41:
          _context6.next = 43;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(qry, qryData, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 43:
          result = _context6.sent;
          return _context6.abrupt("return", result);

        case 47:
          _context6.prev = 47;
          _context6.t2 = _context6["catch"](2);
          console.log(_context6.t2);

        case 50:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 47]]);
};

module.exports = DepositMaster;
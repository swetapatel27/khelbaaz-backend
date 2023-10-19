"use strict";

var dbConn = require("./../../config/db");

var Giver = require("./../controllers/giver.controller");

require("dotenv").config();

var fundMaster = function fundMaster(fund_details) {
  this.transfer_from_id = fund_details.transfer_from_id;
  this.transfer_to_id = fund_details.transfer_to_id;
  this.amount = fund_details.amount;
  this.transfer_by = fund_details.transfer_by;
  this.transfer_from_balance = fund_details.transfer_from_balance;
  this.transfer_to_balance = fund_details.transfer_to_balance;
};

fundMaster.create = function _callee(new_fund_details, result) {
  var ledger_data, add_ledger, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select role from users where id = ?", new_fund_details.transfer_from_id, function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                var role_id = res[0].role; // console.log("role id-->", role_id);
                // let ledger_details = {};

                if (role_id == 5) {
                  var ledger_details = {
                    user_id: new_fund_details.transfer_from_id,
                    type: "fund",
                    subtype: "withdraw",
                    runner_name: "withdraw",
                    profit_loss: 0 - new_fund_details.amount
                  };
                  resolve(ledger_details);
                } else if (role_id < 5) {
                  var _ledger_details = {
                    user_id: new_fund_details.transfer_to_id,
                    type: "fund",
                    subtype: "deposit",
                    runner_name: "deposit",
                    profit_loss: new_fund_details.amount
                  };
                  resolve(_ledger_details);
                } // resolve(ledger_details);

              }
            }); // console.log(ledger_details);
            // return ledger_details;
          }));

        case 2:
          ledger_data = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            // console.log("ledger data-->", ledger_data);
            var sql = "INSERT INTO ledger set ?";
            dbConn.query(sql, ledger_data, function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          add_ledger = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select id,balance from users where id = ? or id=?", [new_fund_details.transfer_from_id, new_fund_details.transfer_to_id], function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                var transferFromObj = res.find(function (obj) {
                  return obj.id == new_fund_details.transfer_from_id;
                });
                var transferToObj = res.find(function (obj) {
                  return obj.id == new_fund_details.transfer_to_id;
                });

                if (transferFromObj) {
                  console.log("fro bacl", transferFromObj.balance);
                  new_fund_details.transfer_from_balance = transferFromObj.balance;
                }

                if (transferToObj) {
                  new_fund_details.transfer_to_balance = transferToObj.balance;
                }

                resolve(new_fund_details);
              }
            });
            return new_fund_details;
          }));

        case 8:
          data = _context.sent;
          dbConn.query("INSERT INTO funds set ?", data, function (err, res) {
            if (err) {
              console.log("error: ", err);
              result(err, null);
            } else {
              Giver.addGiver(new_fund_details, function (err, data) {
                if (err) {
                  result(err, null);
                } else {
                  res.giver_id = data;
                  result(null, {
                    fund_id: res.insertId,
                    ledger_id: res.giver_id
                  });
                }
              }); // Receiver.addReceiver(new_fund_details,(err,data)=>{
              //     if(err){
              //         result(err,null);
              //     }
              //     else{
              //         res.receiver_id = data;
              //         result(null, {fund_id:res.insertId,giver_id:res.giver_id,receiver_id:res.receiver_id});
              //     }
              // });
            }
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

fundMaster.findAll = function _callee2(user_id) {
  var fund_details;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log(user_id);
          _context2.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select f.id, t.name as t_name,t.role as t_role, r.name as r_name, r.role as r_role, f.amount from users as t INNER join funds as f on f.transfer_from_id = t.id inner join users as r on r.id = f.transfer_to_id where f.transfer_by = ? order by f.created_at desc", user_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                console.log(res);
                resolve(res);
              }
            });
          }));

        case 4:
          fund_details = _context2.sent;
          return _context2.abrupt("return", fund_details);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

fundMaster.fundTransactionDetails = function _callee3(user_id) {
  var fund_details;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log(user_id);
          _context3.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT u1.name AS debit_user, u2.name AS credit_user, t.transfer_from_id AS debit_account, t.transfer_to_id AS credit_account, t.amount, t.created_at FROM funds t JOIN users u1 ON t.transfer_from_id = u1.id JOIN users u2 ON t.transfer_to_id = u2.id WHERE t.transfer_from_id = ? OR t.transfer_to_id = ? order by t.created_at desc", [user_id, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                console.log(res);
                resolve(res);
              }
            });
          }));

        case 4:
          fund_details = _context3.sent;
          return _context3.abrupt("return", fund_details);

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; //arjun agent ledger for today


fundMaster.agentLedgerToday = function _callee4(user_id, role_id) {
  var qry, qrydata, agent_ledger;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          qry = "";
          qrydata = "";

          if (role_id == 1) {
            qry = "SELECT f.`created_at`,f.transfer_from_balance,f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE DATE(f.created_at) = CURDATE() order by f.created_at desc";
            qrydata = [user_id, user_id];
          } else if (role_id == 4) {
            qry = "SELECT f.`created_at`,f.transfer_from_balance,f.transfer_to_balance, CASE WHEN f.transfer_from_id = 1 THEN -f.amount ELSE f.amount END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE (FIND_IN_SET(?, u_to.creator_id) OR FIND_IN_SET(?, u_from.creator_id)) AND DATE(f.created_at) = CURDATE() order by f.created_at desc";
            qrydata = [user_id, user_id, user_id, user_id];
          } else {
            qry = "SELECT f.`created_at`,f.transfer_from_balance,f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE (f.transfer_from_id = ? OR f.transfer_to_id = ?) AND DATE(f.created_at) = CURDATE() order by f.created_at desc";
            qrydata = [user_id, user_id, user_id, user_id];
          }

          _context4.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(qry, qrydata, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          agent_ledger = _context4.sent;
          return _context4.abrupt("return", agent_ledger);

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; //arjun agent ledger with filter


fundMaster.agentLedgerFilter = function _callee5(user_id, role_id, from_date, to_date) {
  var qry, qrydata, agent_ledger;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          qry = "";
          qrydata = "";

          if (role_id == 1) {
            qry = "SELECT f.`created_at`, f.transfer_from_balance, f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE DATE( f.`created_at`) BETWEEN ? AND ? order by f.created_at desc ";
            qrydata = [user_id, user_id, from_date, to_date];
          } else if (role_id == 4) {
            qry = "SELECT f.`created_at`, f.transfer_from_balance, f.transfer_to_balance, CASE WHEN f.transfer_from_id = 1 THEN -f.amount ELSE f.amount END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE FIND_IN_SET(?, u_to.creator_id) AND DATE( f.`created_at`) BETWEEN ? AND ? order by f.created_at desc ";
            qrydata = [user_id, from_date, to_date];
          } else {
            qry = "SELECT f.`created_at`, f.transfer_from_balance, f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE (f.transfer_from_id = ? OR f.transfer_to_id = ?) AND DATE( f.`created_at`) BETWEEN ? AND ? order by f.created_at desc ";
            qrydata = [user_id, user_id, user_id, user_id, from_date, to_date];
          }

          _context5.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(qry, qrydata, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          agent_ledger = _context5.sent;
          return _context5.abrupt("return", agent_ledger);

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = fundMaster;
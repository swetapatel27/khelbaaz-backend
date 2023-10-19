"use strict";

var dbConn = require("./../../config/db");

var Exposure = require("../models/exposure");

require("dotenv").config();

var moment = require("moment");

var TennisBetsMaster = function TennisBetsMaster(tennisBet) {
  this.user_id = tennisBet.user_id;
  this.event_id = tennisBet.event_id;
  this.market_id = tennisBet.market_id;
  this.event_name = tennisBet.market_name;
  this.runner_name = tennisBet.runner_name;
  this.type = tennisBet.type;
  this.price = tennisBet.price;
  this.size = tennisBet.size;
  this.bet_amount = tennisBet.bet_amount;
  this.loss_amount = tennisBet.loss_amount;
  this.win_amount = tennisBet.win_amount;
  this.exp_amount1 = tennisBet.exp_amount1;
  this.exp_amount2 = tennisBet.exp_amount2;
  this.exp_amount3 = tennisBet.exp_amount3;
};

TennisBetsMaster.addTennisBet = function _callee(tennisBet, main_type, market_name, enable_draw) {
  var connection, final_exp, qry_insert, insert_values, qry_exp, exp_values, msg, _msg;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getConnection(dbConn));

        case 2:
          connection = _context.sent;
          _context.prev = 3;
          console.log("TM-->", tennisBet);
          final_exp = 0;

          if (!enable_draw) {
            _context.next = 12;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(Math.min(tennisBet.exp_amount1, tennisBet.exp_amount2, tennisBet.exp_amount3));

        case 9:
          final_exp = _context.sent;
          _context.next = 16;
          break;

        case 12:
          if (!(enable_draw == false)) {
            _context.next = 16;
            break;
          }

          _context.next = 15;
          return regeneratorRuntime.awrap(Math.min(tennisBet.exp_amount1, tennisBet.exp_amount2));

        case 15:
          final_exp = _context.sent;

        case 16:
          if (final_exp > 0) {
            final_exp = 0 - final_exp;
          } // console.log("main exp-->", final_exp);


          _context.next = 19;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 19:
          //insert into matchbets
          qry_insert = "INSERT INTO tennisbets set ?";
          insert_values = tennisBet;
          _context.next = 23;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_insert, insert_values));

        case 23:
          //insert into exposures
          qry_exp = "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2,exp_amount3)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,exp_amount3=?,updated_at=?;";
          exp_values = [tennisBet.user_id, tennisBet.event_id, tennisBet.runner_name, main_type, tennisBet.type, tennisBet.price, tennisBet.size, final_exp, final_exp, tennisBet.exp_amount1, tennisBet.exp_amount2, tennisBet.exp_amount3, final_exp, final_exp, tennisBet.exp_amount1, tennisBet.exp_amount2, tennisBet.exp_amount3, moment().format("YYYY-MM-DD HH:mm:ss")];
          _context.next = 27;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, exp_values));

        case 27:
          _context.next = 29;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 29:
          msg = _context.sent;

          if (!msg.includes("committed")) {
            _context.next = 32;
            break;
          }

          return _context.abrupt("return", "bet placed successfully");

        case 32:
          _context.next = 41;
          break;

        case 34:
          _context.prev = 34;
          _context.t0 = _context["catch"](3);
          console.error("Error in transaction:", _context.t0); // Rollback the transaction if any query encounters an error

          _context.next = 39;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 39:
          _msg = _context.sent;
          return _context.abrupt("return", _msg);

        case 41:
          _context.prev = 41;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context.finish(41);

        case 45:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 34, 41, 45]]);
};

TennisBetsMaster.getTennisBetByEventIdByUserID = function _callee2(event_id, user_id) {
  var tennisbets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from tennisbets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1", [user_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          tennisbets = _context2.sent;
          return _context2.abrupt("return", tennisbets);

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

TennisBetsMaster.getTennisBetsByEventId = function _callee3(event_id, user_id) {
  var tennisBets;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from tennisbets where event_id = ? and user_id=? order by updated_at desc", [event_id, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          tennisBets = _context3.sent;
          return _context3.abrupt("return", tennisBets);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get bet history for each admin based on event id


TennisBetsMaster.getTennisBetsPlaced = function _callee4(creator_id, event_id) {
  var role_id, betplaced;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select role from users where id = ?", creator_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].role);
              }
            });
          }));

        case 3:
          role_id = _context4.sent;

          if (role_id == 0) {
            qry = "SELECT u.username, m.* FROM `tennisbets` m join users as u on u.id = m.user_id WHERE m.event_id = ? order by m.updated_at desc ";
            values = [event_id];
          } else {
            qry = "SELECT u.username, m.* FROM `tennisbets` m join users as u on u.id = m.user_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc";
            values = [creator_id, event_id];
          }

          _context4.next = 7;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(qry, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 7:
          betplaced = _context4.sent;
          return _context4.abrupt("return", betplaced);

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; //get all open bets for user


TennisBetsMaster.getOpenTennisBets = function _callee5(user_id) {
  var status,
      days,
      tennisbets,
      _args5 = arguments;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          status = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 0;
          days = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 3;
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from tennisbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC", [user_id, status, days], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          tennisbets = _context5.sent;
          return _context5.abrupt("return", tennisbets);

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](2);
          console.log(_context5.t0);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; //get all open bets for user in admin


TennisBetsMaster.getOpenTennisBetsInAdmin = function _callee6(user_id) {
  var tennisbets;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select tb.* from tennisbets tb where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR tb.status=0);", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          tennisbets = _context6.sent;
          return _context6.abrupt("return", tennisbets);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //summation of exposures for specific event_id and respective admin/agents


TennisBetsMaster.getSumExpByTennisEvent = function _callee7(creator_id, event_id) {
  var sum_exp_event;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN users u ON e.user_id = u.id WHERE FIND_IN_SET(?, u.creator_id) > 0 and e.event_id = ?", [creator_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sum_exp_event = _context7.sent;
          return _context7.abrupt("return", sum_exp_event);

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //all eventwise summation of exposures for respective admin/agents but for inplay matches only and is not declared(changed recently)


TennisBetsMaster.getSumExpInPlayTennisEvents = function _callee8(creator_id) {
  var _qry, sum_exp_inplayevents;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _qry = "";

          if (creator_id == 1 || creator_id == 21) {
            _qry = "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN tennisodds m ON e.event_id = m.event_id JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
          } else if (creator_id != 1 || creator_id != 21) {
            _qry = "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN tennisodds m ON e.event_id = m.event_id JOIN users u ON u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
          }

          _context8.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(_qry, [creator_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          sum_exp_inplayevents = _context8.sent;
          return _context8.abrupt("return", sum_exp_inplayevents);

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get exposure status of users for particular event for agents


TennisBetsMaster.getUserExpStatus = function _callee9(creator_id, event_id) {
  var user_exp;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT u.username, mb.*, e.runner1,e.runner2 FROM users u JOIN tennisbets mb ON u.id = mb.user_id JOIN tennisodds e ON mb.event_id = e.event_id JOIN ( SELECT user_id, MAX(created_at) AS latest_updated_at FROM tennisbets WHERE event_id = ? GROUP BY user_id ) latest ON mb.user_id = latest.user_id AND mb.created_at = latest.latest_updated_at WHERE FIND_IN_SET(?, u.creator_id) > 0;", [event_id, creator_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          user_exp = _context9.sent;
          return _context9.abrupt("return", user_exp);

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Function to get a connection from the pool


function getConnection(pool) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) reject(err);
      resolve(connection);
    });
  });
} // Function to begin a transaction


function beginTransaction(connection) {
  return new Promise(function (resolve, reject) {
    connection.beginTransaction(function (err) {
      if (err) reject(err);
      console.log("Transaction started!");
      resolve();
    });
  });
} // Function to execute a query


function executeQuery(connection, query, values) {
  return new Promise(function (resolve, reject) {
    connection.query(query, values, function (err, result) {
      if (err) reject(err);
      console.log("Query executed successfully!");
      resolve(result);
    });
  });
} // Function to commit a transaction


function commitTransaction(connection) {
  return new Promise(function (resolve, reject) {
    connection.commit(function (err) {
      if (err) reject(err);
      console.log("Transaction committed successfully!");
      resolve("Transaction committed successfully!");
    });
  });
} // Function to rollback a transaction


function rollbackTransaction(connection) {
  return new Promise(function (resolve, reject) {
    connection.rollback(function () {
      console.log("Transaction rolled back!");
      resolve("Transaction rolled back!");
    });
  });
}

module.exports = TennisBetsMaster;
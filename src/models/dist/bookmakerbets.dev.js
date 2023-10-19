"use strict";

var dbConn = require("../../config/db");

var Exposure = require("./exposure");

var moment = require("moment");

require("dotenv").config();

var BookmakerbetMaster = function BookmakerbetMaster(matchBet) {
  this.user_id = matchBet.user_id;
  this.event_id = matchBet.event_id;
  this.market_id = matchBet.market_id;
  this.event_name = matchBet.market_name;
  this.runner_name = matchBet.runner_name;
  this.type = matchBet.type;
  this.price = matchBet.price;
  this.size = matchBet.size;
  this.bet_amount = matchBet.bet_amount;
  this.loss_amount = matchBet.loss_amount;
  this.win_amount = matchBet.win_amount;
  this.exp_amount1 = matchBet.exp_amount1;
  this.exp_amount2 = matchBet.exp_amount2;
  this.exp_amount3 = matchBet.exp_amount3;
};

BookmakerbetMaster.addBookMakerBet = function _callee(matchBet, main_type, market_name, enable_draw) {
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
          console.log("BM-->", matchBet);
          final_exp = 0;

          if (!enable_draw) {
            _context.next = 12;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(Math.min(matchBet.exp_amount1, matchBet.exp_amount2, matchBet.exp_amount3));

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
          return regeneratorRuntime.awrap(Math.min(matchBet.exp_amount1, matchBet.exp_amount2));

        case 15:
          final_exp = _context.sent;

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 18:
          //insert into matchbets
          qry_insert = "INSERT INTO bookmakerbets set ?";
          insert_values = matchBet;
          _context.next = 22;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_insert, insert_values));

        case 22:
          //insert into exposures
          qry_exp = "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2,exp_amount3)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,exp_amount3=?,updated_at=?;";
          exp_values = [matchBet.user_id, matchBet.event_id, market_name, main_type, matchBet.type, matchBet.price, matchBet.size, final_exp, final_exp, matchBet.exp_amount1, matchBet.exp_amount2, matchBet.exp_amount3, final_exp, final_exp, matchBet.exp_amount1, matchBet.exp_amount2, matchBet.exp_amount3, moment().format("YYYY-MM-DD HH:mm:ss")];
          _context.next = 26;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, exp_values));

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 28:
          msg = _context.sent;

          if (!msg.includes("committed")) {
            _context.next = 31;
            break;
          }

          return _context.abrupt("return", "Bookmaker bet placed successfully");

        case 31:
          _context.next = 40;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](3);
          console.error("Error in transaction:", _context.t0); // Rollback the transaction if any query encounters an error

          _context.next = 38;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 38:
          _msg = _context.sent;
          return _context.abrupt("return", _msg);

        case 40:
          _context.prev = 40;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context.finish(40);

        case 44:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 33, 40, 44]]);
};

BookmakerbetMaster.getBookBetByEventIdByUserID = function _callee2(event_id, user_id) {
  var matchbets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from bookmakerbets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1", [user_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          matchbets = _context2.sent;
          return _context2.abrupt("return", matchbets);

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

BookmakerbetMaster.getAllMatchBetsByEventId = function _callee3(event_id, user_id) {
  var bookmakerbets;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from bookmakerbets where event_id = ? and user_id=? order by updated_at desc", [event_id, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          bookmakerbets = _context3.sent;
          return _context3.abrupt("return", bookmakerbets);

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


BookmakerbetMaster.getBookmakerBetsPlaced = function _callee4(creator_id, event_id) {
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
            qry = "SELECT u.username, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id WHERE m.event_id = ? order by m.updated_at desc ";
            values = [event_id];
          } else {
            qry = "SELECT u.username, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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
}; //summation of exposures for specific event_id and respective admin/agents


BookmakerbetMaster.getBookmakerSumExpByEvent = function _callee5(creator_id, event_id) {
  var sum_exp_event;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            // old_query = "SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2,SUM(exp_amount3) AS sum_exp_amount3 FROM (SELECT mb.event_id, mb.exp_amount1, mb.exp_amount2, mb.exp_amount3,ROW_NUMBER() OVER (PARTITION BY mb.event_id, mb.user_id ORDER BY mb.updated_at DESC) AS row_num FROM matchbets mb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = mb.user_id) subquery WHERE row_num = 1 AND event_id = ? GROUP BY event_id;"
            dbConn.query("SELECT SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN users u ON e.user_id = u.id WHERE FIND_IN_SET(?, u.creator_id) > 0 and e.event_id = ? and e.main_type='bookmaker'", [creator_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sum_exp_event = _context5.sent;
          return _context5.abrupt("return", sum_exp_event);

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
}; //get all open bets for user in admin


BookmakerbetMaster.getOpenBookmakerBetsInAdmin = function _callee6(user_id) {
  var bookmakerbets;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select tb.* from bookmakerbets tb where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) OR tb.status=0);", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          bookmakerbets = _context6.sent;
          return _context6.abrupt("return", bookmakerbets);

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
};

BookmakerbetMaster.getOpenMatchBets = function _callee7(user_id) {
  var status,
      days,
      matchbets,
      _args7 = arguments;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          status = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : 0;
          days = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : 3;
          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from bookmakerbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC", [user_id, status, days], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          matchbets = _context7.sent;
          return _context7.abrupt("return", matchbets);

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](2);
          console.log(_context7.t0);

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 9]]);
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

module.exports = BookmakerbetMaster;
"use strict";

var dbConn = require("./../../config/db");

var Exposure = require("../models/exposure");

require("dotenv").config();

var moment = require("moment");

var FancyBetsMaster = function FancyBetsMaster(fancyBet) {
  this.user_id = fancyBet.user_id;
  this.event_id = fancyBet.event_id;
  this.market_id = fancyBet.market_id;
  this.event_name = fancyBet.market_name;
  this.runner_name = fancyBet.runner_name;
  this.type = fancyBet.type;
  this.price = fancyBet.price;
  this.size = fancyBet.size;
  this.bet_amount = fancyBet.bet_amount;
  this.loss_amount = fancyBet.loss_amount;
  this.win_amount = fancyBet.win_amount;
  this.exp_amount1 = fancyBet.exp_amount1;
  this.exp_amount2 = fancyBet.exp_amount2;
};

FancyBetsMaster.addFancyBet = function _callee(fancyBet, main_type, market_name, enable_draw) {
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
          console.log("FB-->", fancyBet);
          final_exp = 0;
          _context.next = 8;
          return regeneratorRuntime.awrap(Math.min(fancyBet.exp_amount1, fancyBet.exp_amount2));

        case 8:
          final_exp = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 11:
          //insert into matchbets
          qry_insert = "INSERT INTO fancybets set ?";
          insert_values = fancyBet;
          _context.next = 15;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_insert, insert_values));

        case 15:
          //insert into exposures
          qry_exp = "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2)VALUES (?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,updated_at=?;";
          exp_values = [fancyBet.user_id, fancyBet.event_id, fancyBet.runner_name, main_type, fancyBet.type, fancyBet.price, fancyBet.size, final_exp, final_exp, fancyBet.exp_amount1, fancyBet.exp_amount2, final_exp, final_exp, fancyBet.exp_amount1, fancyBet.exp_amount2, moment().format("YYYY-MM-DD HH:mm:ss")];
          _context.next = 19;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, exp_values));

        case 19:
          _context.next = 21;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 21:
          msg = _context.sent;

          if (!msg.includes("committed")) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("return", "bet placed successfully");

        case 24:
          _context.next = 33;
          break;

        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](3);
          console.error("Error in transaction:", _context.t0); // Rollback the transaction if any query encounters an error

          _context.next = 31;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 31:
          _msg = _context.sent;
          return _context.abrupt("return", _msg);

        case 33:
          _context.prev = 33;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context.finish(33);

        case 37:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 26, 33, 37]]);
};

FancyBetsMaster.getFancyBetByEventIdByUserID = function _callee2(event_id, user_id) {
  var fancybets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancybets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1", [user_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          fancybets = _context2.sent;
          return _context2.abrupt("return", fancybets);

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
}; //get session by runner, event and user


FancyBetsMaster.getFancyByRunnerEvent = function _callee3(user_id, event_id, runner_name) {
  var user_total_exp;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancybets where user_id=? and event_id=? and runner_name=? order by updated_at desc limit 1", [user_id, event_id, runner_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          user_total_exp = _context3.sent;
          return _context3.abrupt("return", user_total_exp);

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
};

FancyBetsMaster.getFancyBetsByEventId = function _callee4(event_id, user_id) {
  var fancyBets;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancybets where event_id = ? and user_id=? order by updated_at desc", [event_id, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          fancyBets = _context4.sent;
          return _context4.abrupt("return", fancyBets);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get bet history for each admin based on event id


FancyBetsMaster.getFancyBetsPlaced = function _callee5(creator_id, event_id) {
  var role_id, betplaced;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
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
          role_id = _context5.sent;

          if (role_id == 0) {
            qry = "SELECT u.username, m.* FROM `fancybets` m join users as u on u.id = m.user_id WHERE m.event_id = ? order by m.updated_at desc ";
            values = [event_id];
          } else {
            qry = "SELECT u.username, m.* FROM `fancybets` m join users as u on u.id = m.user_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
            values = [creator_id, event_id];
          }

          _context5.next = 7;
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
          betplaced = _context5.sent;
          return _context5.abrupt("return", betplaced);

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; //get all open bets for user


FancyBetsMaster.getOpenFancyBets = function _callee6(user_id) {
  var status,
      days,
      fancybets,
      _args6 = arguments;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          status = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : 0;
          days = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : 3;
          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancybets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC", [user_id, status, days], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          fancybets = _context6.sent;
          return _context6.abrupt("return", fancybets);

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](2);
          console.log(_context6.t0);

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; //get all open bets for user in admin


FancyBetsMaster.getOpenFancyBetsInAdmin = function _callee7(user_id) {
  var fancybets;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select tb.* from fancybets tb where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) OR tb.status=0);", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          fancybets = _context7.sent;
          return _context7.abrupt("return", fancybets);

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
}; //summation of exposures for specific event_id and respective admin/agents


FancyBetsMaster.getSumExpByFancyEvent = function _callee8(creator_id, event_id) {
  var sum_exp_event;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
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
          sum_exp_event = _context8.sent;
          return _context8.abrupt("return", sum_exp_event);

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //all eventwise summation of exposures for respective admin/agents but for inplay matches only and is not declared(changed recently)


FancyBetsMaster.getSumExpInPlayFancyEvents = function _callee9(creator_id) {
  var _qry, sum_exp_inplayevents;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _qry = "";

          if (creator_id == 1 || creator_id == 21) {
            _qry = "SELECT e.event_id, e.open_date, e.event_name,tod.runner1,tod.runner2, mt.sum_exp_amount1, mt.sum_exp_amount2, mt.sum_exp_amount3 FROM ( SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT tb.event_id, tb.exp_amount1, tb.exp_amount2, tb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY tb.event_id, tb.user_id ORDER BY tb.updated_at DESC) AS row_num FROM fancybets tb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = tb.user_id ) subquery WHERE row_num = 1 GROUP BY event_id ) mt JOIN ( SELECT event_id FROM fancyodds WHERE is_declared = 0 GROUP BY event_id ) mo_declared ON mo_declared.event_id = mt.event_id JOIN fancyodds tod ON tod.event_id = mt.event_id JOIN fancyevents e ON e.event_id = mt.event_id WHERE tod.inplay = 1 or tod.is_declared = 0;";
          } else if (creator_id != 1 || creator_id != 21) {
            _qry = "SELECT e.event_id, e.open_date, e.event_name,tod.runner1,tod.runner2, mt.sum_exp_amount1, mt.sum_exp_amount2, mt.sum_exp_amount3 FROM ( SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT tb.event_id, tb.exp_amount1, tb.exp_amount2, tb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY tb.event_id, tb.user_id ORDER BY tb.updated_at DESC) AS row_num FROM fancybets tb JOIN users u ON u.id = tb.user_id ) subquery WHERE row_num = 1 GROUP BY event_id ) mt JOIN ( SELECT event_id FROM fancyodds WHERE is_declared = 0 GROUP BY event_id ) mo_declared ON mo_declared.event_id = mt.event_id JOIN fancyodds tod ON tod.event_id = mt.event_id JOIN fancyevents e ON e.event_id = mt.event_id WHERE tod.inplay = 1 or tod.is_declared = 0;";
          }

          _context9.next = 5;
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
          sum_exp_inplayevents = _context9.sent;
          return _context9.abrupt("return", sum_exp_inplayevents);

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get exposure status of users for particular event for agents


FancyBetsMaster.getUserExpStatus = function _callee10(creator_id, event_id) {
  var user_exp;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT u.username, mb.*, e.runner1,e.runner2 FROM users u JOIN fancybets mb ON u.id = mb.user_id JOIN fancyodds e ON mb.event_id = e.event_id JOIN ( SELECT user_id, MAX(created_at) AS latest_updated_at FROM fancybets WHERE event_id = ? GROUP BY user_id ) latest ON mb.user_id = latest.user_id AND mb.created_at = latest.latest_updated_at WHERE FIND_IN_SET(?, u.creator_id) > 0;", [event_id, creator_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          user_exp = _context10.sent;
          return _context10.abrupt("return", user_exp);

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get exposure for each admin


FancyBetsMaster.getFancyAdminExp = function _callee11(admin_id, event_id) {
  var _qry2, user_total_exp;

  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _qry2 = "";
          values = []; // console.log("adminid-->", admin_id);

          if (admin_id == 1 || admin_id == 21) {
            _qry2 = "SELECT event_id,runner_name,main_type,user_id,sum(exp_amount) as total_exposure, ((sum(exp_amount)*u.user_share)/100) as share FROM `exposures` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u where event_id = ? and main_type='fancy' and user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5) group by runner_name,event_id";
            values = [admin_id, event_id, admin_id];
          } else if (admin_id != 1 || admin_id != 21) {
            _qry2 = "SELECT event_id,runner_name,main_type,sum(exp_amount) as total_exposure,sum(exp_amount) as share from exposures where event_id = ? and main_type='fancy' group by runner_name,event_id";
            values = [event_id];
          } // console.log("qry-->", qry);
          // let qry = "SELECT runner_name,event_id, sum(exp_amount1) as e1,sum(exp_amount2) as e2,sum(exp_amount3) as e3, ((sum(exp_amount1)*u.user_share)/100) as share1,((sum(exp_amount2)*u.user_share)/100) as share2,((sum(exp_amount3)*u.user_share)/100) as share3 FROM `matchbets` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u GROUP BY runner_name having matchbets.event_id = ? "


          _context11.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(_qry2, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          user_total_exp = _context11.sent;
          return _context11.abrupt("return", user_total_exp);

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

FancyBetsMaster.addAndDeleteFancyBets = function _callee12(event_id, runner_name) {
  var bets_added, delete_bets, delete_exposure;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO deletedfancybets (`bet_id`, `user_id`, `event_id`, `market_id`, `event_name`, `main_type`, `runner_name`, `type`, `price`, `size`, `bet_amount`, `loss_amount`, `win_amount`, `exp_amount1`, `exp_amount2`, `profit_loss`, `status`, `is_won`, `is_switched`, `created_at`, `updated_at`) SELECT * FROM fancybets WHERE runner_name = ? AND event_id = ?", [runner_name, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          bets_added = _context12.sent;
          _context12.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("DELETE FROM fancybets WHERE runner_name = ? AND event_id = ?", [runner_name, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          delete_bets = _context12.sent;
          _context12.next = 9;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("DELETE FROM exposures WHERE runner_name = ? AND event_id = ? AND main_type = 'fancy'", [runner_name, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 9:
          delete_exposure = _context12.sent;
          return _context12.abrupt("return", delete_exposure);

        case 13:
          _context12.prev = 13;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);

        case 16:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 13]]);
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

module.exports = FancyBetsMaster;
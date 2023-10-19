"use strict";

var dbConn = require("./../../config/db");

var Exposure = require("../models/exposure");

require("dotenv").config();

var moment = require("moment");

var SessionBetsMaster = function SessionBetsMaster(sessionBet) {
  this.user_id = sessionBet.user_id;
  this.event_id = sessionBet.event_id;
  this.event_name = sessionBet.market_name;
  this.runner_name = sessionBet.runner_name;
  this.type = sessionBet.type;
  this.price = sessionBet.price;
  this.size = sessionBet.size;
  this.bet_amount = sessionBet.bet_amount;
  this.loss_amount = 0 - sessionBet.loss_amount;
  this.win_amount = sessionBet.win_amount;
  this.exp_amount1 = sessionBet.exp_amount1;
  this.exp_amount2 = sessionBet.exp_amount2;
};

SessionBetsMaster.addSessionBet = function _callee(sessionBet, main_type) {
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
          _context.next = 6;
          return regeneratorRuntime.awrap(Math.min(sessionBet.exp_amount1, sessionBet.exp_amount2));

        case 6:
          final_exp = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 9:
          //insert into sessionbets
          qry_insert = "INSERT INTO sessionbets set ?";
          insert_values = sessionBet;
          _context.next = 13;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_insert, insert_values));

        case 13:
          //insert into exposures
          qry_exp = "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount)VALUES (?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,updated_at=?;";
          exp_values = [sessionBet.user_id, sessionBet.event_id, sessionBet.runner_name, main_type, sessionBet.type, sessionBet.price, sessionBet.size, final_exp, final_exp, final_exp, final_exp, moment().format("YYYY-MM-DD HH:mm:ss")];
          _context.next = 17;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, exp_values));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 19:
          msg = _context.sent;

          if (!msg.includes("committed")) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", "Session bet placed successfully");

        case 22:
          _context.next = 31;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](3);
          console.error("Error in transaction:", _context.t0); // Rollback the transaction if any query encounters an error

          _context.next = 29;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 29:
          _msg = _context.sent;
          return _context.abrupt("return", _msg);

        case 31:
          _context.prev = 31;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context.finish(31);

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 24, 31, 35]]);
};

SessionBetsMaster.getSessionBetByEventId = function _callee2(event_id, user_id) {
  var sessiobets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from sessionbets where event_id = ? and user_id = ?", [event_id, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sessiobets = _context2.sent;
          return _context2.abrupt("return", sessiobets);

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

SessionBetsMaster.getSessionBetsByRunner = function _callee3(user_id, runner_name) {
  var sessionbet;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from sessionbets where user_id = ? and runner_name = ?", [user_id, runner_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                console.log(res);
                resolve(res);
              }
            });
          }));

        case 3:
          sessionbet = _context3.sent;
          return _context3.abrupt("return", sessionbet);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SessionBetsMaster.updateSessionBet = function _callee4(sessionBet) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dbConn.getConnection(function (err, conn) {
            if (err) {
              throw err;
            } //update into sessionbets


            conn.query("UPDATE sessionbets set updated_at=?, type=?,price=?,size=?,loss_amount=?,win_amount=?, is_switched = ? where user_id=? and runner_name=?", [moment().format("YYYY-MM-DD HH:mm:ss"), sessionBet.type, sessionBet.price, sessionBet.size, sessionBet.loss_amount, sessionBet.win_amount, sessionBet.is_switched, sessionBet.user_id, sessionBet.runner_name], function (err, res) {
              if (err) {
                return conn.rollback(function () {
                  conn.release();
                  throw err;
                });
              } //update the user balance


              conn.query("UPDATE users SET balance = balance - ? WHERE id = ? ", [sessionBet.exp_amount, sessionBet.user_id], function (err, res) {
                if (err) {
                  return conn.rollback(function () {
                    conn.release();
                    throw err;
                  });
                } //insert exposure


                var newExp = {
                  user_id: sessionBet.user_id,
                  event_id: sessionBet.event_id,
                  runner_name: sessionBet.runner_name,
                  main_type: sessionBet.main_type,
                  type: sessionBet.type,
                  price: sessionBet.price,
                  size: sessionBet.size,
                  deducted_amount: sessionBet.loss_amount,
                  exp_amount: 0 - sessionBet.exp_amount
                };
                conn.query("UPDATE exposures set updated_at=?,type=?,price=?,size=?,exp_amount=? where user_id = ? and runner_name=?", [moment().format("YYYY-MM-DD HH:mm:ss"), newExp.type, newExp.price, newExp.size, newExp.exp_amount, newExp.user_id, newExp.runner_name], function (err, res) {
                  if (err) {
                    return conn.rollback(function () {
                      conn.release();
                      throw err;
                    });
                  } // commit the transaction if both queries were successful


                  conn.query("COMMIT", function (err) {
                    if (err) {
                      return conn.rollback(function () {
                        conn.release();
                        throw err;
                      });
                    }

                    console.log("Transaction updated and completed successfully.");
                    conn.release();
                  });
                });
              });
            });
          });
          return _context4.abrupt("return", "Switched successfully");

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

SessionBetsMaster.betHistoryByEventId = function _callee5(event_id) {
  var sessionbet;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT event_id,runner_name,type,sum(loss_amount) as 'total_loss_amount',sum(win_amount) as 'total_win_amount',updated_at,status, count(*) as bet_count FROM `sessionbets` group by runner_name, type HAVING event_id = ? and status=1 ", [event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sessionbet = _context5.sent;
          return _context5.abrupt("return", sessionbet);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SessionBetsMaster.getSessionBetsByUserID = function _callee6(user_id) {
  var sessionbet;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT * from sessionbets where user_id = ? order by updated_at desc", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sessionbet = _context6.sent;
          return _context6.abrupt("return", sessionbet);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);

        case 9:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SessionBetsMaster.getBetHistoryByRunner = function _callee7(runner_name, event_id) {
  var sessionhistory_byrunner;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var qry = "select users.name,events.event_name,sessionbets.* from sessionbets join users on users.id = sessionbets.user_id join events on sessionbets.event_id = events.event_id where sessionbets.runner_name = '" + runner_name.trim() + "' and sessionbets.event_id=" + event_id.trim() + " order by sessionbets.updated_at";
            console.log(qry);
            dbConn.query(qry, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sessionhistory_byrunner = _context7.sent;
          return _context7.abrupt("return", sessionhistory_byrunner);

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);

        case 9:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SessionBetsMaster.getSessionBetsByDateFilter = function _callee8(user_id, from, to) {
  var sessionbets;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select events.event_id,events.event_name,sessionbets.user_id,sessionbets.runner_name,sessionbets.type,sum(loss_amount) as loss_amount,sum(win_amount) as win_amount,sessionbets.status,sessionbets.updated_at from sessionbets join events on sessionbets.event_id = events.event_id GROUP BY sessionbets.runner_name, sessionbets.type, sessionbets.event_id HAVING sessionbets.user_id = ? and DATE(updated_at) BETWEEN ? AND ?", [user_id, from, to], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sessionbets = _context8.sent;
          return _context8.abrupt("return", sessionbets);

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);

        case 9:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SessionBetsMaster.getOpenSessionBets = function _callee9(user_id) {
  var status,
      days,
      sessionbets,
      _args9 = arguments;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          status = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : 0;
          days = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : 3;
          _context9.prev = 2;
          _context9.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from sessionbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC", [user_id, status, days], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          sessionbets = _context9.sent;
          return _context9.abrupt("return", sessionbets);

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](2);

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

SessionBetsMaster.getOpenSessionBetsInAdmin = function _callee10(user_id) {
  var sessionbets;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query( //"SELECT e.event_name, sb.* FROM sessionbets sb JOIN events e ON sb.event_id = e.event_id WHERE sb.user_id = ? AND (sb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR sb.status=0);",
            "SELECT sb.* FROM sessionbets sb WHERE sb.user_id = ? AND (sb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR sb.status=0);", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sessionbets = _context10.sent;
          return _context10.abrupt("return", sessionbets);

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);

        case 9:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get bet history for each admin based on event id


SessionBetsMaster.getSessionBetsPlaced = function _callee11(creator_id, event_id) {
  var role_id, betplaced;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
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
          role_id = _context11.sent;

          if (role_id == 0) {
            qry = "SELECT u.username, s.* FROM `sessionbets` s join users as u on u.id = s.user_id WHERE s.event_id = ? order by s.updated_at desc ";
            values = [event_id];
          } else {
            qry = "SELECT u.username, s.* FROM `sessionbets` s join users as u on u.id = s.user_id WHERE FIND_IN_SET(?,creator_id) and s.event_id = ? order by s.updated_at desc ";
            values = [creator_id, event_id];
          }

          _context11.next = 7;
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
          betplaced = _context11.sent;
          return _context11.abrupt("return", betplaced);

        case 11:
          _context11.prev = 11;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; //get exposure for each admin


SessionBetsMaster.getSessionAdminExp = function _callee12(admin_id, event_id) {
  var user_total_exp;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT event_id,runner_name,main_type,user_id,sum(exp_amount) as total_exposure, ((sum(exp_amount)*u.user_share)/100) as share FROM `exposures` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u where event_id = ? and main_type='session' and user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5) group by runner_name,event_id", [admin_id, event_id, admin_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          user_total_exp = _context12.sent;
          return _context12.abrupt("return", user_total_exp);

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);

        case 10:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get session by runner, event and user


SessionBetsMaster.getSessionByRunnerEvent = function _callee13(user_id, event_id, runner_name) {
  var user_total_exp;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from sessionbets where user_id=? and event_id=? and runner_name=? order by updated_at desc", [user_id, event_id, runner_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          user_total_exp = _context13.sent;
          return _context13.abrupt("return", user_total_exp);

        case 7:
          _context13.prev = 7;
          _context13.t0 = _context13["catch"](0);
          console.log(_context13.t0);

        case 10:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SessionBetsMaster.addAndDeleteSessionBets = function _callee14(event_id, runner_name) {
  var bets_added, delete_bets, delete_exposure;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO deletedsessionbets (bet_id,user_id,event_id,event_name,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM sessionbets WHERE runner_name = ? AND event_id = ?", [runner_name, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          bets_added = _context14.sent;
          _context14.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("DELETE FROM sessionbets WHERE runner_name = ? AND event_id = ?", [runner_name, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          delete_bets = _context14.sent;
          _context14.next = 9;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("DELETE FROM exposures WHERE runner_name = ? AND event_id = ? AND main_type = 'session'", [runner_name, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 9:
          delete_exposure = _context14.sent;
          return _context14.abrupt("return", delete_exposure);

        case 13:
          _context14.prev = 13;
          _context14.t0 = _context14["catch"](0);
          console.log(_context14.t0);

        case 16:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

SessionBetsMaster.deleteSessionbets = function _callee15(ids) {
  var bets_added, deleted_bets;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO deletedsessionbets (bet_id,user_id,event_id,event_name,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM sessionbets where id IN (?)", [ids], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          bets_added = _context15.sent;
          _context15.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("delete from sessionbets where id IN (?)", [ids], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          deleted_bets = _context15.sent;
          return _context15.abrupt("return", deleted_bets);

        case 10:
          _context15.prev = 10;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);

        case 13:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 10]]);
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

module.exports = SessionBetsMaster;
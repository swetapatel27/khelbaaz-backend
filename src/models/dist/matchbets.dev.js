"use strict";

var dbConn = require("./../../config/db");

var Exposure = require("../models/exposure");

var moment = require("moment");

require("dotenv").config();

var MatchBetsMaster = function MatchBetsMaster(matchBet) {
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

MatchBetsMaster.addMatchBet = function _callee(matchBet, main_type, market_name, enable_draw) {
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
          matchBet.event_name = market_name; // console.log("BM-->", matchBet);

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
          if (final_exp > 0) {
            final_exp = 0 - final_exp;
          } // console.log("main exp-->", final_exp);


          _context.next = 19;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 19:
          //insert into matchbets
          qry_insert = "INSERT INTO matchbets set ?";
          insert_values = matchBet;
          _context.next = 23;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_insert, insert_values));

        case 23:
          //insert into exposures
          qry_exp = "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2,exp_amount3)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,exp_amount3=?,updated_at=?;";
          exp_values = [matchBet.user_id, matchBet.event_id, matchBet.runner_name, main_type, matchBet.type, matchBet.price, matchBet.size, final_exp, final_exp, matchBet.exp_amount1, matchBet.exp_amount2, matchBet.exp_amount3, final_exp, final_exp, matchBet.exp_amount1, matchBet.exp_amount2, matchBet.exp_amount3, moment().format("YYYY-MM-DD HH:mm:ss")];
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

MatchBetsMaster.getMatchBetByEventId = function _callee2(event_id, user_id) {
  var sessiobets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from matchbets where event_id = ? and user_id=? order by updated_at desc", [event_id, user_id], function (err, res) {
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

MatchBetsMaster.getMatchBetsByUserID = function _callee3(user_id) {
  var matchbets_byuserid;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from matchbets where user_id= ? order by updated_at desc", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          matchbets_byuserid = _context3.sent;
          return _context3.abrupt("return", matchbets_byuserid);

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

MatchBetsMaster.getMatchBetHistoryByEventId = function _callee4(event_id) {
  var matchbets_byeventid;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT event_id,runner_name,type,sum(loss_amount) as 'total_loss_amount',sum(win_amount) as 'total_win_amount',updated_at,status, count(*) as bet_count FROM `matchbets` group by runner_name, type HAVING event_id = ? and status=1 ", [event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          matchbets_byeventid = _context4.sent;
          return _context4.abrupt("return", matchbets_byeventid);

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
};

MatchBetsMaster.getMatchBetByEventIdByUserID = function _callee5(event_id, user_id) {
  var matchbets;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from matchbets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1", [user_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          matchbets = _context5.sent;
          return _context5.abrupt("return", matchbets);

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

MatchBetsMaster.getMatchBetByFilter = function _callee6(user_id, from, to) {
  var matchbets;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT user_id,matchbets.market_id,m.runner1,m.runner2,runner_name,sum(loss_amount) as loss_amount,sum(win_amount) as win_amount,win_amount+loss_amount as total, matchbets.status, matchbets.updated_at FROM `matchbets` join marketodds as m on m.market_id = matchbets.market_id GROUP BY runner_name, market_id HAVING user_id = ? and DATE(matchbets.updated_at) BETWEEN ? AND ?;", [user_id, from, to], function (err, res) {
              if (err) {
                reject(err);
              } else {
                // Use reduce to merge objects with same ID
                var createNewArray = function createNewArray(res) {
                  var result = [];
                  var marketIds = []; // Loop through each object in the original array

                  res.forEach(function (obj) {
                    // If the market_id of the current object is not in the marketIds array
                    // create a new object with an array of objects having the same market_id
                    // and push it to the result array, otherwise push the current object to
                    // the corresponding array in the result array
                    var index = marketIds.indexOf(obj.market_id);

                    if (index === -1) {
                      marketIds.push(obj.market_id);
                      result.push({
                        market_id: obj.market_id,
                        runners: [obj]
                      });
                    } else {
                      result[index].runners.push(obj);
                    }
                  });
                  return result;
                }; // Call the function with the original array to create the new array of objects


                var newArray = createNewArray(res);
                resolve(newArray);
              }
            });
          }));

        case 3:
          matchbets = _context6.sent;
          return _context6.abrupt("return", matchbets);

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

MatchBetsMaster.getOpenMatchBetsInadmin = function _callee7(user_id) {
  var matchbets;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select mb.* from matchbets mb where mb.user_id = ? AND (mb.updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) OR mb.status=0 ) ;", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          matchbets = _context7.sent;
          return _context7.abrupt("return", matchbets);

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
};

MatchBetsMaster.getOpenMatchBets = function _callee8(user_id) {
  var status,
      days,
      matchbets,
      _args8 = arguments;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          status = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : 0;
          days = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : 3;
          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from matchbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC", [user_id, status, days], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          matchbets = _context8.sent;
          return _context8.abrupt("return", matchbets);

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](2);
          console.log(_context8.t0);

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; //get matches with bets placed


MatchBetsMaster.getBetPlacedMatches = function _callee9() {
  var betplaced_matches;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id,event_name, open_date from events where event_id in (select DISTINCT event_id from matchbets UNION all select DISTINCT event_id from sessionbets) order by open_date desc  ", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          betplaced_matches = _context9.sent;
          return _context9.abrupt("return", betplaced_matches);

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
}; //get all matches bets by event id


MatchBetsMaster.getAllBetsByEventId = function _callee10(event_id) {
  var betplaced_matches;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select users.username, matchbets.* from matchbets join users on users.id = matchbets.user_id where event_id = ? order by updated_at", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          betplaced_matches = _context10.sent;
          return _context10.abrupt("return", betplaced_matches);

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
}; //get bet history for each admin based on event id


MatchBetsMaster.getMatchBetsPlaced = function _callee11(creator_id, event_id) {
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
            qry = "SELECT u.username, m.* FROM `matchbets` m join users as u on u.id = m.user_id WHERE m.event_id = ? order by m.updated_at desc ";
            values = [event_id];
          } else {
            qry = "SELECT u.username, m.* FROM `matchbets` m join users as u on u.id = m.user_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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


MatchBetsMaster.getAdminExp = function _callee12(admin_id, event_id) {
  var user_total_exp;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT event_id,runner_name,main_type,user_id,sum(exp_amount) as total_exposure, ((sum(exp_amount)*u.user_share)/100) as share FROM `exposures` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u where event_id = ? and main_type='match_odd' and user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5) group by runner_name,event_id;", [admin_id, event_id, admin_id], function (err, res) {
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
}; //get latest bet for each user by event_id


MatchBetsMaster.getLatestMatchBet = function _callee13(creator_id, event_id) {
  var latestbetsplaced;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT users.username,mb.* FROM matchbets mb INNER JOIN ( SELECT user_id, MAX(updated_at) AS max_bet_timestamp FROM matchbets where event_id = ? GROUP BY user_id ) latest_bets ON mb.user_id = latest_bets.user_id AND mb.updated_at = latest_bets.max_bet_timestamp inner join users on latest_bets.user_id = users.id where mb.user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5)", [event_id, creator_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          latestbetsplaced = _context13.sent;
          return _context13.abrupt("return", latestbetsplaced);

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
}; //summation of exposures for specific event_id and respective admin/agents


MatchBetsMaster.getSumExpByEvent = function _callee14(creator_id, event_id) {
  var sum_exp_event;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            // old_query = "SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2,SUM(exp_amount3) AS sum_exp_amount3 FROM (SELECT mb.event_id, mb.exp_amount1, mb.exp_amount2, mb.exp_amount3,ROW_NUMBER() OVER (PARTITION BY mb.event_id, mb.user_id ORDER BY mb.updated_at DESC) AS row_num FROM matchbets mb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = mb.user_id) subquery WHERE row_num = 1 AND event_id = ? GROUP BY event_id;"
            dbConn.query("SELECT SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN users u ON e.user_id = u.id WHERE FIND_IN_SET(?, u.creator_id) > 0 and e.event_id = ? and e.main_type='match_odd'", [creator_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sum_exp_event = _context14.sent;
          return _context14.abrupt("return", sum_exp_event);

        case 7:
          _context14.prev = 7;
          _context14.t0 = _context14["catch"](0);
          console.log(_context14.t0);

        case 10:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //all eventwise summation of exposures for respective admin/agents but for inplay matches only and whose result is not declared(changed recently)


MatchBetsMaster.getSumExpInPlayEvents = function _callee15(creator_id) {
  var _qry, sum_exp_inplayevents;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _qry = "";

          if (creator_id == 1 || creator_id == 21) {
            _qry = "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN marketodds m ON e.event_id = m.event_id JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = e.user_id where (e.status = 1 and (e.main_type = 'match_odd' or e.main_type='fancy' or e.main_type='bookmaker' )) and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id"; //"SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN marketodds m ON e.event_id = m.event_id JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
          } else if (creator_id != 1 || creator_id != 21) {
            _qry = "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN marketodds m ON e.event_id = m.event_id JOIN users u ON u.id = e.user_id where (e.status = 1 and (e.main_type = 'match_odd' or e.main_type='fancy' or e.main_type='bookmaker' )) and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id"; //"SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN marketodds m ON e.event_id = m.event_id JOIN users u ON u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
          }

          _context15.next = 5;
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
          sum_exp_inplayevents = _context15.sent;
          return _context15.abrupt("return", sum_exp_inplayevents);

        case 9:
          _context15.prev = 9;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);

        case 12:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get exposure status of users for particular event for agents


MatchBetsMaster.getUserExpStatus = function _callee16(creator_id, event_id) {
  var user_exp;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _context16.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT u.username, mb.*, e.runner1,e.runner2 FROM users u JOIN matchbets mb ON u.id = mb.user_id JOIN marketodds e ON mb.event_id = e.event_id JOIN ( SELECT user_id, MAX(created_at) AS latest_updated_at FROM matchbets WHERE event_id = ? GROUP BY user_id ) latest ON mb.user_id = latest.user_id AND mb.created_at = latest.latest_updated_at WHERE FIND_IN_SET(?, u.creator_id) > 0;", [event_id, creator_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          user_exp = _context16.sent;
          return _context16.abrupt("return", user_exp);

        case 7:
          _context16.prev = 7;
          _context16.t0 = _context16["catch"](0);
          console.log(_context16.t0);

        case 10:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

MatchBetsMaster.deleteMatchbets = function _callee17(ids) {
  var bets_added, deleted_bets;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO deletedmatchbets(bet_id,user_id,event_id,market_id,event_name,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,exp_amount3,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM matchbets where id IN (?)", [ids], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          bets_added = _context17.sent;
          _context17.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("delete from matchbets where id IN (?)", [ids], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          deleted_bets = _context17.sent;
          return _context17.abrupt("return", deleted_bets);

        case 10:
          _context17.prev = 10;
          _context17.t0 = _context17["catch"](0);
          console.log(_context17.t0);

        case 13:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = MatchBetsMaster;
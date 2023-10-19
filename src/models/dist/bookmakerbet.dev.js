"use strict";

var dbConn = require("../../config/db");

var Exposure = require("./exposure");

var moment = require("moment");

require("dotenv").config();

var BookmakebetMaster = function BookmakebetMaster(matchBet) {
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

BookmakebetMaster.addBookMaketBet = function _callee(matchBet, main_type, market_name, enable_draw) {
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
          //console.log("BM2-->", matchBet);
          final_exp = 0;

          if (!enable_draw) {
            _context.next = 11;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(Math.min(matchBet.exp_amount1, matchBet.exp_amount2, matchBet.exp_amount3));

        case 8:
          final_exp = _context.sent;
          _context.next = 15;
          break;

        case 11:
          if (!(enable_draw == false)) {
            _context.next = 15;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(Math.min(matchBet.exp_amount1, matchBet.exp_amount2));

        case 14:
          final_exp = _context.sent;

        case 15:
          if (final_exp > 0) {
            final_exp = 0 - final_exp;
          } // console.log("main exp-->", final_exp);


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

          return _context.abrupt("return", "bet placed successfully");

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

BookmakebetMaster.getBookmakerBetByEventId = function _callee2(event_id, user_id) {
  var sessiobets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
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

BookmakebetMaster.getMatchBetsByUserID = function _callee3(user_id) {
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

BookmakebetMaster.getMatchBetHistoryByEventId = function _callee4(event_id) {
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

BookmakebetMaster.getBookBetByEventIdByUserID = function _callee5(event_id, user_id) {
  var matchbets;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
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

BookmakebetMaster.getMatchBetByFilter = function _callee6(user_id, from, to) {
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

BookmakebetMaster.getOpenMatchBetsInadmin = function _callee7(user_id) {
  var matchbets;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select e.event_name,mb.* from matchbets mb join events e on mb.event_id = e.event_id where mb.user_id = ? AND (mb.updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) OR mb.status=0 ) ;", [user_id], function (err, res) {
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

BookmakebetMaster.getOpenMatchBets = function _callee8(user_id) {
  var matchbets;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT mo.*, e.event_name, matchbets.* FROM matchbets INNER JOIN ( SELECT event_id, MAX(updated_at) AS max_updated_at FROM matchbets where user_id = ? AND status = 1 GROUP BY event_id ) latest_bets ON matchbets.event_id = latest_bets.event_id AND matchbets.updated_at = latest_bets.max_updated_at INNER JOIN events e ON matchbets.event_id = e.event_id join marketodds mo on matchbets.event_id = mo.event_id;", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          matchbets = _context8.sent;
          return _context8.abrupt("return", matchbets);

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
}; //get matches with bets placed


BookmakebetMaster.getBetPlacedMatches = function _callee9() {
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


BookmakebetMaster.getAllBetsByEventId = function _callee10(event_id) {
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


BookmakebetMaster.getMatchBetsPlaced = function _callee11(creator_id, event_id) {
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
            qry = "SELECT u.username,e.event_name, m.* FROM `matchbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE m.event_id = ? order by m.updated_at desc ";
            values = [event_id];
          } else {
            qry = "SELECT u.username,e.event_name, m.* FROM `matchbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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


BookmakebetMaster.getAdminExp = function _callee12(admin_id, event_id) {
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


BookmakebetMaster.getLatestMatchBet = function _callee13(creator_id, event_id) {
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


BookmakebetMaster.getSumExpByEvent = function _callee14(creator_id, event_id) {
  var sum_exp_event;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2,SUM(exp_amount3) AS sum_exp_amount3 FROM (SELECT mb.event_id, mb.exp_amount1, mb.exp_amount2, mb.exp_amount3,ROW_NUMBER() OVER (PARTITION BY mb.event_id, mb.user_id ORDER BY mb.updated_at DESC) AS row_num FROM bookmakerbets mb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = mb.user_id) subquery WHERE row_num = 1 AND event_id = ? GROUP BY event_id;", [creator_id, event_id], function (err, res) {
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


BookmakebetMaster.getSumExpInPlayEvents = function _callee15(creator_id) {
  var sum_exp_inplayevents;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT e.event_id, e.open_date, e.event_name,mo.runner1, mo.runner2, mt.sum_exp_amount1, mt.sum_exp_amount2, mt.sum_exp_amount3 FROM ( SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT mb.event_id, mb.exp_amount1, mb.exp_amount2, mb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY mb.event_id, mb.user_id ORDER BY mb.updated_at DESC) AS row_num FROM bookmakerbets mb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = mb.user_id ) subquery WHERE row_num = 1 GROUP BY event_id ) mt JOIN ( SELECT event_id FROM bookmakerodds WHERE is_declared = 0 GROUP BY event_id ) mo_declared ON mo_declared.event_id = mt.event_id JOIN marketodds mo ON mo.event_id = mt.event_id JOIN events e ON e.event_id = mt.event_id WHERE mo.inplay = 1 or mo.is_declared = 0", [creator_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          sum_exp_inplayevents = _context15.sent;
          return _context15.abrupt("return", sum_exp_inplayevents);

        case 7:
          _context15.prev = 7;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);

        case 10:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get exposure status of users for particular event for agents


BookmakebetMaster.getUserExpStatus = function _callee16(creator_id, event_id) {
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

BookmakebetMaster.deleteMatchbets = function _callee17(ids) {
  var bets_added, deleted_bets;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO deletedmatchbets(bet_id,user_id,event_id,market_id,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,exp_amount3,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM matchbets where id IN (?)", [ids], function (err, res) {
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
}; //get bet history for each admin based on event id


BookmakebetMaster.getBookBetsPlaced = function _callee18(creator_id, event_id) {
  var role_id, betplaced;
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
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
          role_id = _context18.sent;

          if (role_id == 0) {
            qry = "SELECT u.username,e.event_name, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE m.event_id = ? order by m.updated_at desc ";
            values = [event_id];
          } else {
            qry = "SELECT u.username,e.event_name, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
            values = [creator_id, event_id];
          }

          _context18.next = 7;
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
          betplaced = _context18.sent;
          return _context18.abrupt("return", betplaced);

        case 11:
          _context18.prev = 11;
          _context18.t0 = _context18["catch"](0);
          console.log(_context18.t0);

        case 14:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = BookmakebetMaster;
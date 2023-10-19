"use strict";

var dbConn = require("./../../config/db");

require("dotenv").config();

var ExposureMaster = function ExposureMaster(exposure) {
  this.user_id = exposure.user_id;
  this.event_id = exposure.event_id;
  this.event_name = exposure.market_name;
  this.runner_name = exposure.runner_name;
  this.main_type = exposure.main_type;
  this.type = exposure.type;
  this.price = exposure.price;
  this.size = exposure.size;
  this.deducted_amount = exposure.deducted_amount;
  this.exp_amount = exposure.exp_amount;
};

ExposureMaster.addExposure = function _callee(exposure) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO exposures set ? ", exposure, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
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

ExposureMaster.getExposureByUserId = function _callee2(user_id) {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT sum(exp_amount) as exp_amount FROM `exposures` WHERE user_id = ?", user_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                if (res[0].exp_amount == null) {
                  res[0].exp_amount = 0;
                }

                console.log(res);
                resolve(res);
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

ExposureMaster.getExposureByRunner = function _callee3(user_id, runner_name) {
  var exposure;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from exposures where user_id = ? and runner_name = ? order by updated_at desc", [user_id, runner_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          exposure = _context3.sent;
          return _context3.abrupt("return", exposure);

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

ExposureMaster.getExposureAmtByGroup = function _callee4(user_id, event_id) {
  var exposure;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT user_id, event_id,status, runner_name,sum(exp_amount) as exp_amount FROM `exposures` GROUP BY runner_name,user_id,event_id,exp_amount having user_id = ? and event_id = ?", [user_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                // console.log("expgrpbyamtrunner---->", res);
                resolve(res);
              }
            });
          }));

        case 3:
          exposure = _context4.sent;
          return _context4.abrupt("return", exposure);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

ExposureMaster.getAllSessionExposure = function _callee5(user_id) {
  var exposure;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var qury = "select exposures.user_id,exposures.event_id, events.event_name,exposures.runner_name,exposures.main_type,exposures.type,exposures.price,exposures.size,exposures.exp_amount,exposures.status from exposures join events on exposures.event_id = events.event_id where exposures.main_type = 'session' and user_id = ? ";
            dbConn.query(qury, [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                var newData = []; // Function to check if an object with given event_id exists in newData array

                var doesEventExist = function doesEventExist(eventId) {
                  return newData.some(function (event) {
                    return event.event_id === eventId;
                  });
                }; // Loop through each object in the data array


                res.forEach(function (bet) {
                  // Check if an object with the same event_id exists in the newData array
                  var eventIndex = newData.findIndex(function (event) {
                    return event.event_id === bet.event_id;
                  }); // If event doesn't exist in the newData array, create a new object with the current bet

                  if (eventIndex === -1) {
                    newData.push({
                      event_id: bet.event_id,
                      event_name: bet.event_name,
                      main_type: "session",
                      bets: [{
                        event_id: bet.event_id,
                        runner_name: bet.runner_name,
                        type: bet.type,
                        price: bet.price,
                        size: bet.size,
                        status: bet.status,
                        exp_amount: bet.exp_amount
                      }]
                    });
                  } else {
                    // If event already exists in the newData array, push the current bet to the bets array of that object
                    newData[eventIndex].bets.push({
                      event_id: bet.event_id,
                      runner_name: bet.runner_name,
                      type: bet.type,
                      price: bet.price,
                      size: bet.size,
                      status: bet.status,
                      exp_amount: bet.exp_amount
                    });
                  }
                });
                resolve(newData);
              }
            });
          }));

        case 3:
          exposure = _context5.sent;
          return _context5.abrupt("return", exposure);

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

ExposureMaster.getAllMatchExposure = function _callee6(user_id) {
  var exposure;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var qury = "select exposures.user_id,exposures.event_id, events.event_name,exposures.runner_name,exposures.main_type,exposures.type,exposures.price,exposures.size,exposures.exp_amount,exposures.status from exposures join events on exposures.event_id = events.event_id where exposures.main_type = 'match_odd' and user_id = ? ";
            dbConn.query(qury, [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                var newData = []; // Function to check if an object with given event_id exists in newData array

                var doesEventExist = function doesEventExist(eventId) {
                  return newData.some(function (event) {
                    return event.event_id === eventId;
                  });
                }; // Loop through each object in the data array


                res.forEach(function (bet) {
                  // Check if an object with the same event_id exists in the newData array
                  var eventIndex = newData.findIndex(function (event) {
                    return event.event_id === bet.event_id;
                  }); // If event doesn't exist in the newData array, create a new object with the current bet

                  if (eventIndex === -1) {
                    newData.push({
                      event_id: bet.event_id,
                      event_name: bet.event_name,
                      main_type: "match_odd",
                      bets: [{
                        event_id: bet.event_id,
                        runner_name: bet.runner_name,
                        type: bet.type,
                        price: bet.price,
                        size: bet.size,
                        status: bet.status,
                        exp_amount: bet.exp_amount
                      }]
                    });
                  } else {
                    // If event already exists in the newData array, push the current bet to the bets array of that object
                    newData[eventIndex].bets.push({
                      event_id: bet.event_id,
                      runner_name: bet.runner_name,
                      type: bet.type,
                      price: bet.price,
                      size: bet.size,
                      status: bet.status,
                      exp_amount: bet.exp_amount
                    });
                  }
                });
                resolve(newData);
              }
            });
          }));

        case 3:
          exposure = _context6.sent;
          return _context6.abrupt("return", exposure);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);

        case 9:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get total exposure admin wie


ExposureMaster.getTotalAdminExposure = function _callee7(creator_id) {
  var exposure;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select sum(exp_amount) as total_exposure from exposures where user_id in (select id from users where find_in_set(?,creator_id)) and status = 1;", [creator_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0]);
              }
            });
          }));

        case 3:
          exposure = _context7.sent;
          return _context7.abrupt("return", exposure);

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

ExposureMaster.getFancyExposureAmtByGroup = function _callee8(user_id, event_id) {
  var exposure;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT user_id, event_id,status, runner_name,sum(exp_amount) as exp_amount FROM `exposures` where main_type='fancy' GROUP BY runner_name,user_id,event_id,exp_amount having user_id = ? and event_id = ?", [user_id, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                // console.log("expgrpbyamtrunner---->", res);
                resolve(res);
              }
            });
          }));

        case 3:
          exposure = _context8.sent;
          return _context8.abrupt("return", exposure);

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

ExposureMaster.markAsCloseExposure = function _callee9(user_id, gameid, roundid) {
  var exposure;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("UPDATE exposures SET status='0' WHERE user_id=? AND event_id=? AND runner_name=?", [user_id, gameid, roundid], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          }));

        case 3:
          exposure = _context9.sent;
          return _context9.abrupt("return", exposure);

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

ExposureMaster.getExposureOverviewInAdmin = function _callee10(user_id) {
  var exposure;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT e.*,COALESCE(m.event_name, s.event_name, t.event_name) as event_name from exposures as e\n        LEFT JOIN marketodds as m ON e.event_id = m.event_id\n        LEFT JOIN soccerodds as s ON e.event_id = s.event_id\n        LEFT JOIN tennisodds as t ON e.event_id = t.event_id\n        WHERE e.user_id=? AND e.status='1' ORDER BY e.updated_at DESC", [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                // console.log("expgrpbyamtrunner---->", res);
                resolve(res);
              }
            });
          }));

        case 3:
          exposure = _context10.sent;
          return _context10.abrupt("return", exposure);

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);

        case 9:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get all undeclared sessions


ExposureMaster.getAllUndeclaredSession = function _callee11() {
  var undeclared_sessions;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id,runner_name,status,sum(exp_amount) as exp_amount,updated_at from exposures where status = 1 and main_type='session' group by event_id,runner_name ORDER BY updated_at desc", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          undeclared_sessions = _context11.sent;
          return _context11.abrupt("return", undeclared_sessions);

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);

        case 9:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get all undeclared fancy


ExposureMaster.getAllUndeclaredFancy = function _callee12() {
  var undeclared_fancy;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id,runner_name,status,sum(exp_amount) as exp_amount,updated_at from exposures where status = 1 and main_type='fancy' group by event_id ORDER BY updated_at desc", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          undeclared_fancy = _context12.sent;
          return _context12.abrupt("return", undeclared_fancy);

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);

        case 9:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get all undeclared bookmaker


ExposureMaster.getAllUndeclaredBookmaker = function _callee13() {
  var undeclared_bookmaker;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id,runner_name,status,sum(exp_amount1) as exp_amount1,sum(exp_amount2) as exp_amount2, updated_at from exposures where status = 1 and main_type='bookmaker' group by event_id ORDER BY updated_at desc", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          undeclared_bookmaker = _context13.sent;
          return _context13.abrupt("return", undeclared_bookmaker);

        case 7:
          _context13.prev = 7;
          _context13.t0 = _context13["catch"](0);

        case 9:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = ExposureMaster;
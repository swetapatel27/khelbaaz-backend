"use strict";

var UserMaster = require("./../models/user");

var User = require("./../models/user");

exports.selfDetails = function (req, res) {
  User.selfDetails(req.userData.user["id"], function (err, user) {
    console.log("in controller");

    if (err) {
      res.send(err);
    } else {
      // console.log('res',user);
      res.send(user);
    }
  });
};

exports.findAllCreators = function (req, res) {
  User.findAllCreators(req.params.creator_id, req.params.role, function (err, users) {
    if (err) {
      res.send(err);
    } else {
      console.log("res", users);
      res.send(users);
    }
  });
};

exports.create = function (req, res) {
  var new_user = new User(req.body); //handles null error

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field"
    });
  } else {
    User.create(new_user, function (err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json({
          error: false,
          message: "User added successfully!",
          data: user
        });
      }
    });
  }
};

exports.update = function (req, res) {
  console.log("from cont", req.body); //handles null error

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field"
    });
  } else {
    User.update(req.params.id, new User(req.body), function (err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json({
          error: false,
          message: "User updated successfully!",
          data: user
        });
      }
    });
  }
};

exports.login = function (req, res) {
  console.log("controller");

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field"
    });
  } else {
    User.logIn(new User(req.body), function (err, user) {
      if (err) {
        res.send(err);
      } else {
        if (user.length === 0) {
          res.json({
            error: true,
            message: "username or password is incorrect!!"
          });
        } else {
          res.json({
            error: false,
            message: "User loggedIn successfully!",
            data: user
          });
        }
      }
    });
  }
};

exports.AdminLogin = function (req, res) {
  console.log("controller");

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field"
    });
  } else {
    User.AdminlogIn(new User(req.body), function (err, user) {
      if (err) {
        res.send(err);
      } else {
        if (user.length === 0) {
          res.json({
            error: true,
            message: "username or password is incorrect!!"
          });
        } else {
          res.json({
            error: false,
            message: "Admin loggedIn successfully!",
            data: user
          });
        }
      }
    });
  }
};

exports.getBalanceById = function (req, res) {
  User.getBalanceById(req.params.user_id, function (err, users) {
    if (err) {
      res.send(err);
    } else {
      console.log("res", users);
      res.send(users[0]);
    }
  });
};

exports.getUserByUsername = function _callee(req, res) {
  var username, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          username = req.params.username;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.getUserByUsername(username));

        case 4:
          data = _context.sent;
          if (data.length != 0) res.send(data);else {
            res.send({
              error: "User does not exists"
            });
          }
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.updateLastActivity = function _callee2(req, res) {
  var user_id, last_activity;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          user_id = req.body.user_id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(UserMaster.updateLastActivity(user_id));

        case 4:
          last_activity = _context2.sent;
          res.send(last_activity);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getActiveUsers = function _callee3(req, res) {
  var creator_id, active_users;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          creator_id = req.params.creator_id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(UserMaster.getActiveUsers(creator_id));

        case 4:
          active_users = _context3.sent;
          res.send(active_users);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getMyUsers = function _callee4(req, res) {
  var creator_id, my_users;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          creator_id = req.params.creator_id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(UserMaster.getMyUsers(creator_id));

        case 4:
          my_users = _context4.sent;
          res.send(my_users);
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getMyAgents = function _callee5(req, res) {
  var creator_id, my_agents;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          creator_id = req.params.creator_id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(UserMaster.getMyAgents(creator_id));

        case 4:
          my_agents = _context5.sent;
          res.send(my_agents);
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.changePassword = function _callee6(req, res) {
  var user_id, old_password, new_password, my_users;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context6.next = 5;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context6.next = 12;
          break;

        case 5:
          user_id = req.body.user_id;
          old_password = req.body.old_password;
          new_password = req.body.new_password;
          _context6.next = 10;
          return regeneratorRuntime.awrap(UserMaster.changePassword(user_id, old_password, new_password));

        case 10:
          my_users = _context6.sent;
          res.send(my_users);

        case 12:
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(500).send("Error getting data");

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.changeexposureLimit = function _callee7(req, res) {
  var user_id, exposure_limit, my_users;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context7.next = 5;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context7.next = 11;
          break;

        case 5:
          user_id = req.body.user_id;
          exposure_limit = req.body.exposure_limit;
          _context7.next = 9;
          return regeneratorRuntime.awrap(UserMaster.changeexposureLimit(user_id, exposure_limit));

        case 9:
          my_users = _context7.sent;
          res.send(my_users);

        case 11:
          _context7.next = 17;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).send("Error getting data");

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; //change password only by arjun admin


exports.passwordChange = function _callee8(req, res) {
  var is_logout, user_id, new_password, my_users;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context8.next = 5;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context8.next = 13;
          break;

        case 5:
          is_logout = false;
          user_id = req.body.user_id;

          if (!user_id) {
            user_id = req.userData.user.id;
          } else {
            // logout user
            is_logout = true;
          }

          new_password = req.body.new_password;
          _context8.next = 11;
          return regeneratorRuntime.awrap(UserMaster.passwordChange(user_id, new_password, is_logout));

        case 11:
          my_users = _context8.sent;
          res.send(my_users);

        case 13:
          _context8.next = 19;
          break;

        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          res.status(500).send("Error getting data");

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.deductBalance = function _callee9(req, res) {
  var user_id, event_id, event_name, event_type, my_users;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          user_id = req.body.user_id;
          event_id = req.body.event_id;
          event_name = req.body.event_name;
          event_type = req.body.event_type;
          _context9.next = 7;
          return regeneratorRuntime.awrap(UserMaster.deductBalance(user_id, event_id, event_name, event_type));

        case 7:
          my_users = _context9.sent;
          res.send(my_users);
          _context9.next = 15;
          break;

        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          res.status(500).send("Error getting data");

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.getUsersAddedByMe = function _callee10(req, res) {
  var user_id, my_users;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          user_id = req.params.user_id;
          _context10.next = 4;
          return regeneratorRuntime.awrap(UserMaster.getUsersAddedByMe(user_id));

        case 4:
          my_users = _context10.sent;
          res.status(200).send(my_users);
          _context10.next = 12;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.activateUser = function _callee11(req, res) {
  var user_id, type, my_user;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          user_id = req.body.user_id;
          type = req.body.type;
          _context11.next = 5;
          return regeneratorRuntime.awrap(UserMaster.activateUser(user_id, type));

        case 5:
          my_user = _context11.sent;
          res.status(200).send(my_user);
          _context11.next = 13;
          break;

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.deleteUser = function _callee12(req, res) {
  var user_id, my_user;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          user_id = req.params.id;
          _context12.next = 4;
          return regeneratorRuntime.awrap(UserMaster.deleteUser(user_id));

        case 4:
          my_user = _context12.sent;
          res.status(200).send(my_user);
          _context12.next = 12;
          break;

        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.addUPI = function _callee13(req, res) {
  var data, fileUrl, admin;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          data = req.body;
          fileUrl = req.body.qr_delete == "false" ? req.file ? "/" + req.file.filename : "noupdate" : "/no_file.png";
          _context13.next = 5;
          return regeneratorRuntime.awrap(UserMaster.addUPI(data, fileUrl));

        case 5:
          admin = _context13.sent;
          res.status(200).send(admin);
          _context13.next = 13;
          break;

        case 9:
          _context13.prev = 9;
          _context13.t0 = _context13["catch"](0);
          console.log(_context13.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getUPI = function _callee14(req, res) {
  var upi_data;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(UserMaster.getUPI());

        case 3:
          upi_data = _context14.sent;
          res.status(200).send(upi_data);
          _context14.next = 11;
          break;

        case 7:
          _context14.prev = 7;
          _context14.t0 = _context14["catch"](0);
          console.log(_context14.t0);
          res.status(500).send("Error getting data");

        case 11:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
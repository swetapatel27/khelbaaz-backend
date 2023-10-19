"use strict";

var Exposure = require("../models/exposure");

exports.addExposure = function _callee(req, res) {
  var exposure, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          exposure = new Exposure(req.body);

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context.next = 6;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context.next = 10;
          break;

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(Exposure.addExposure(exposure));

        case 8:
          data = _context.sent;
          res.send(data);

        case 10:
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.getExposureByUserId = function _callee2(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Exposure.getExposureByUserId(req.params.user_id));

        case 3:
          data = _context2.sent;
          res.send(data);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getExposureByRunner = function _callee3(req, res) {
  var runner_name, user_id, data;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          runner_name = req.params.runner_name;
          user_id = req.params.user_id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Exposure.getExposureByRunner(user_id, runner_name));

        case 5:
          data = _context3.sent;
          res.send(data);
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getExposureAmtByGroup = function _callee4(req, res) {
  var user_id, event_id, data;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          user_id = req.params.user_id;
          event_id = req.params.event_id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Exposure.getExposureAmtByGroup(user_id, event_id));

        case 5:
          data = _context4.sent;
          res.send(data);
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAllSessionExposure = function _callee5(req, res) {
  var user_id, data;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          user_id = req.params.user_id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Exposure.getAllSessionExposure(user_id));

        case 4:
          data = _context5.sent;
          res.send(data);
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

exports.getAllMatchExposure = function _callee6(req, res) {
  var user_id, data;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          user_id = req.params.user_id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Exposure.getAllMatchExposure(user_id));

        case 4:
          data = _context6.sent;
          res.send(data);
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getTotalAdminExposure = function _callee7(req, res) {
  var creator_id, total_exposure;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          creator_id = req.params.creator_id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(Exposure.getTotalAdminExposure(creator_id));

        case 4:
          total_exposure = _context7.sent;
          res.send(total_exposure);
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getFancyExposureAmtByGroup = function _callee8(req, res) {
  var user_id, event_id, data;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          user_id = req.params.user_id;
          event_id = req.params.event_id;
          _context8.next = 5;
          return regeneratorRuntime.awrap(Exposure.getFancyExposureAmtByGroup(user_id, event_id));

        case 5:
          data = _context8.sent;
          res.send(data);
          _context8.next = 13;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getExposureOverviewInAdmin = function _callee9(req, res) {
  var user_id, data;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          user_id = req.params.user_id;
          _context9.next = 4;
          return regeneratorRuntime.awrap(Exposure.getExposureOverviewInAdmin(user_id));

        case 4:
          data = _context9.sent;
          res.send(data);
          _context9.next = 12;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getAllUndeclaredSession = function _callee10(req, res) {
  var undeclared_sessions;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(Exposure.getAllUndeclaredSession());

        case 3:
          undeclared_sessions = _context10.sent;
          res.status(200).send(undeclared_sessions);
          _context10.next = 11;
          break;

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          res.status(500).send("Error getting data");

        case 11:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAllUndeclaredFancy = function _callee11(req, res) {
  var undeclared_fancy;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(Exposure.getAllUndeclaredFancy());

        case 3:
          undeclared_fancy = _context11.sent;
          res.status(200).send(undeclared_fancy);
          _context11.next = 11;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          res.status(500).send("Error getting data");

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAllUndeclaredBookmaker = function _callee12(req, res) {
  var undeclared_bookmaker;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(Exposure.getAllUndeclaredBookmaker());

        case 3:
          undeclared_bookmaker = _context12.sent;
          res.status(200).send(undeclared_bookmaker);
          _context12.next = 11;
          break;

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);
          res.status(500).send("Error getting data");

        case 11:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
"use strict";

var Setting = require("../models/settings");

exports.addPopup = function _callee(req, res) {
  var new_setting_request, fileUrl, setting_request;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          new_setting_request = new Setting(req.body); // console.log({new_setting_request,fileUrl});

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context.next = 6;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context.next = 11;
          break;

        case 6:
          fileUrl = req.body.popup_delete == "false" ? req.file ? "/" + req.file.filename : "/no_file.png" : null;
          _context.next = 9;
          return regeneratorRuntime.awrap(Setting.addSettingRequest(new_setting_request, fileUrl));

        case 9:
          setting_request = _context.sent;
          res.status(200).send(setting_request);

        case 11:
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error uploading data");

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.getPopup = function _callee2(req, res) {
  var admin_id, user_requests;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          admin_id = req.params.admin_id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Setting.getPopup(admin_id));

        case 4:
          user_requests = _context2.sent;
          res.status(200).send(user_requests);
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
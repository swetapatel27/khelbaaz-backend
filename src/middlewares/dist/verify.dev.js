"use strict";

var jwt = require("jsonwebtoken");

require("dotenv").config();

var dbConn = require("./../../config/db");

exports.isLoggedIn = function _callee(req, res, next) {
  var token, header_password_version, stored_token, stored_password_version, decoded, allow;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.headers.authorization.split(" ")[1];
          header_password_version = req.headers.password_version;
          stored_token = "";
          stored_password_version = ""; // console.log("token from header-->", token);

          decoded = jwt.verify(token, process.env.SECRET_KEY);
          req.userData = decoded;

          if (!(req.userData.user.role == 5)) {
            _context.next = 11;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select token from users where id = ?", req.userData.user.id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                // console.log("from db-->", res[0].token);
                resolve(res[0].token);
              }
            });
          }));

        case 10:
          stored_token = _context.sent;

        case 11:
          if (!(req.userData.user.role == 0)) {
            _context.next = 15;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select password_version from users where id = ?", req.userData.user.id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                // console.log("from db-->", res[0].token);
                resolve(res[0].password_version);
              }
            });
          }));

        case 14:
          stored_password_version = _context.sent;

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select status from users where id = ?", req.userData.user.id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                // console.log(res);
                resolve(res[0].status);
              }
            });
          }));

        case 17:
          allow = _context.sent;

          if (!(req.userData.user.role == 5)) {
            _context.next = 23;
            break;
          }

          if (!(stored_token !== token)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", res.status(401).send({
            msg: "Your session is not valid!"
          }));

        case 21:
          _context.next = 30;
          break;

        case 23:
          if (!(req.userData.user.role == 0)) {
            _context.next = 28;
            break;
          }

          if (!(stored_password_version !== Number(header_password_version))) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", res.status(401).send({
            msg: "Your session is not valid!"
          }));

        case 26:
          _context.next = 30;
          break;

        case 28:
          if (allow) {
            _context.next = 30;
            break;
          }

          return _context.abrupt("return", res.status(401).send({
            msg: "Access denied!"
          }));

        case 30:
          next();
          _context.next = 36;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(401).send({
            msg: "Your session is not valid!"
          }));

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 33]]);
};
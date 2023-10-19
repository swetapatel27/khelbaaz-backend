"use strict";

var dbConn = require("./../../config/db");

require("dotenv").config();

var WithdrawProofMaster = function WithdrawProofMaster(img_details) {
  this.withdraw_id = img_details.withdraw_id;
  this.image = img_details.image;
};

WithdrawProofMaster.uploadProof = function _callee(data) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO withdraw_proofs (withdraw_id,image) VALUES ?", [data.map(function (wp) {
              return [wp.withdraw_id, wp.image];
            })], function (err, res) {
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

WithdrawProofMaster.getWithdrawProofs = function _callee2(id) {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from withdraw_proofs WHERE withdraw_id = ? order by id desc;", [id], function (err, res) {
              if (err) {
                reject(err);
              } else {
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

module.exports = WithdrawProofMaster;
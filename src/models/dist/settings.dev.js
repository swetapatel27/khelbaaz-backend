"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dbConn = require("./../../config/db");

var Exposure = require("./exposure");

require("dotenv").config();

var SettingMaster = function SettingMaster(setting) {
  this.popup_img = setting.popup_img;
  this.deposit_whatsapp = setting.deposit_whatsapp;
  this.withdraw_whatsapp = setting.withdraw_whatsapp;
  this.technical_whatsapp = setting.technical_whatsapp;
  this.joining_bonus = setting.joining_bonus;
};

SettingMaster.addSettingRequest = function _callee(setting, fileUrl) {
  var setting_data, qry, qryData, result, result2;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (fileUrl != "/no_file.png") {
            setting_data = _objectSpread({}, setting, {
              popup_img: fileUrl
            });
            qry = "UPDATE settings SET popup_img=?,deposit_whatsapp=?,withdraw_whatsapp=?,technical_whatsapp=?,joining_bonus=? WHERE id=1";
            qryData = [fileUrl, setting_data.deposit_whatsapp, setting_data.withdraw_whatsapp, setting_data.technical_whatsapp, setting_data.joining_bonus];
          } else {
            setting_data = _objectSpread({}, setting);
            qry = "UPDATE settings SET deposit_whatsapp=?,withdraw_whatsapp=?,technical_whatsapp=?,joining_bonus=? WHERE id=1";
            qryData = [setting_data.deposit_whatsapp, setting_data.withdraw_whatsapp, setting_data.technical_whatsapp, setting_data.joining_bonus];
          } // console.log('sd--->',setting_data);


          _context.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(qry, qryData, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          result = _context.sent;
          return _context.abrupt("return", result);

        case 8:
          result2 = _context.sent;
          return _context.abrupt("return", result2);

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

SettingMaster.getJoiningBonus = function _callee2() {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select joining_bonus from settings where id = 1", function (err, res) {
              if (err) {
                reject(0);
              } else {
                resolve(res[0].joining_bonus);
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

SettingMaster.getPopup = function _callee3() {
  var result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from settings order by id desc;", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context3.sent;
          return _context3.abrupt("return", result);

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

module.exports = SettingMaster;
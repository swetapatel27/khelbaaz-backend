"use strict";

var Client = require("./../models/client");

exports.testt = function _callee(req, res) {
  var gg;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", res.json({
            res: 'testing'
          }));

        case 3:
          gg = _context.sent;
          return _context.abrupt("return", res.json(gg));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.register = function (req, res) {
  var new_user = new Client(req.body); //handles null error

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: 'Please provide all required field'
    });
  } else {
    Client.register(new_user, function (err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json({
          error: false,
          message: "Client added successfully!",
          data: user
        });
      }
    });
  }
};
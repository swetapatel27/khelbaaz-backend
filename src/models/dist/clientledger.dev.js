"use strict";

var dbConn = require("./../../config/db");

require("dotenv").config();

var ClientLedgerMaster = function ClientLedgerMaster(data) {
  this.user_id = data.user_id;
  this.event_id = data.event_id;
  this.event_name = data.event_name;
  this.type = data.type;
  this.subtype = data.subtype;
  this.runner_name = data.runner_name;
  this.profit_loss = data.profit_loss;
};

ClientLedgerMaster.getUserProfitLose = function _callee(user_id) {
  var qry, ledger;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          qry = "SELECT SUM(CASE WHEN profit_loss >= 0 THEN profit_loss ELSE 0 END) AS total_profit, SUM(CASE WHEN profit_loss < 0 THEN profit_loss ELSE 0 END) AS total_loss FROM `ledger` WHERE user_id = ? AND subtype = 'match_odd'";
          _context.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(qry, [user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          ledger = _context.sent;
          return _context.abrupt("return", ledger);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

ClientLedgerMaster.getClientLedgerByDays = function _callee2(user_id, days) {
  var qry, ledger;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          qry = "SELECT * FROM `ledger` where user_id = ? and created_at >= CURDATE() - INTERVAL ? DAY ORDER BY created_at desc";
          values = [user_id, days]; // qry =
          //   "SELECT union_result.*, CASE WHEN union_result.type = 'soccer' THEN se.event_name WHEN union_result.type = 'tennis' THEN te.event_name WHEN union_result.type = 'cricket' THEN ce.event_name END AS event_name FROM ( SELECT mb.user_id, mb.event_id, 'cricket' AS type, 'Match Odd' as sub_type, mb.market_id, mb.runner_name, mb.profit_loss, mb.updated_at FROM matchbets mb WHERE mb.user_id = ? AND mb.status = 0 AND mb.updated_at >= CURDATE() - INTERVAL ? DAY UNION ALL SELECT sb.user_id, sb.event_id, 'cricket' AS type, 'Sessions' as sub_type, NULL AS market_id, sb.runner_name, sb.profit_loss, sb.updated_at FROM sessionbets sb WHERE sb.user_id = ? AND sb.status = 0 AND sb.updated_at >= CURDATE() - INTERVAL ? DAY UNION ALL SELECT tb.user_id, tb.event_id, 'tennis' AS type, 'Match Odd' as sub_type, NULL AS market_id, tb.runner_name, tb.profit_loss, tb.updated_at FROM tennisbets tb WHERE tb.user_id = ? AND tb.status = 0 AND tb.updated_at >= CURDATE() - INTERVAL ? DAY UNION ALL SELECT sob.user_id, sob.event_id, 'soccer' AS type, 'Match Odd' as sub_type, NULL AS market_id, sob.runner_name, sob.profit_loss, sob.updated_at FROM soccerbets sob WHERE sob.user_id = ? AND sob.status = 0 AND sob.updated_at >= CURDATE() - INTERVAL ? DAY UNION ALL SELECT f.transfer_from_id as user_id, NULL as event_id, NULL as type, NULL as sub_type, NULL AS market_id, 'withdraw' AS runner_name, 0 - f.amount AS profit_loss, f.created_at as updated_at FROM funds f WHERE f.transfer_from_id = ? AND f.created_at >= CURDATE() - INTERVAL ? DAY UNION ALL SELECT f.transfer_to_id as user_id, NULL as event_id, NULL as type, NULL as sub_type, NULL AS market_id, 'deposit' AS runner_name, f.amount AS profit_loss, f.created_at as updated_at FROM funds f WHERE f.transfer_to_id = ? AND f.created_at >= CURDATE() - INTERVAL ? DAY ) AS union_result LEFT JOIN soccerevents se ON union_result.type = 'soccer' AND union_result.event_id = se.event_id LEFT JOIN tennisevents te ON union_result.type = 'tennis' AND union_result.event_id = te.event_id LEFT JOIN events ce ON union_result.type = 'cricket' AND union_result.event_id = ce.event_id ORDER BY updated_at DESC";

          _context2.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            // values = [
            //   user_id,
            //   days,
            //   user_id,
            //   days,
            //   user_id,
            //   days,
            //   user_id,
            //   days,
            //   user_id,
            //   days,
            //   user_id,
            //   days,
            // ];
            dbConn.query(qry, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          ledger = _context2.sent;
          return _context2.abrupt("return", ledger);

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // ClientLedgerMaster.addData = async function (data) {
//   try {
//     qry = "select balance from users where id = ?";
//     let old_limit = await new Promise((resolve, reject) => {
//       values = [data.user_id];
//       dbConn.query(qry, values, (err, res) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(res[0]);
//         }
//       });
//     });
//     let add_data = await new Promise((resolve, reject) => {
//       ledger_data = {
//         ...data,
//         old_limit: old_limit.balance,
//         new_limit: old_limit.balance + data.profit_loss,
//       };
//       console.log("ledger data-->", ledger_data);
//       dbConn.query("INSERT INTO ledger set ?", ledger_data, (err, res) => {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("res of client from client", res);
//           resolve(res);
//         }
//       });
//     });
//     return add_data;
//   } catch (error) {
//     console.error(error);
//   }
// };


module.exports = ClientLedgerMaster;
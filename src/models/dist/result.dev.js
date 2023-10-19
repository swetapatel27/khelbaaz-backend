"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var dbConn = require("./../../config/db"); // const winController = require("./../controllers/winner.controller");
// const lossController = require("../controllers/loser.controller");


var Winner = require("../models/winner");

var Loser = require("../models/loser");

var ClientLedger = require("../models/clientledger");

var _require = require("express-validator"),
    Result = _require.Result;

var moment = require("moment");

require("dotenv").config();

var ResultMaster = function ResultMaster(result) {
  this.event_id = result.event_id;
  this.runner_name = result.runner_name;
  this.main_type = result.main_type;
  this.type = result.type;
  this.event_name = result.event_name;
};

ResultMaster.addResult = function _callee(result, manual_session) {
  var connection, is_declared, qry_session, values_session, qry_winner, values_winner, qry_losers, values_losers, qry_players, values_players, all_players, i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, data, user_id, total_pl, event_id, runner_name, latest_created_at, query, values, ledger_data, qry_ledger, win_data, new_winner, qry_win, loss_data, new_loser, qry_loss, qry_exp, exp_values, qry_match, values_match, _qry_winner, _values_winner, _qry_losers, _values_losers, _qry_players, _values_players, _all_players, _i, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _data, _user_id, _total_pl, _event_id, _runner_name, _latest_created_at, _query, _values, _ledger_data, _qry_ledger, _win_data, _new_winner, _qry_win, _loss_data, _new_loser, _qry_loss, _qry_exp, _exp_values, msg, _msg;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getConnection(dbConn));

        case 2:
          connection = _context.sent;
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(this.isResultDeclared(result));

        case 6:
          is_declared = _context.sent;

          if (!(is_declared > 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", "Please refresh. Result already declared..!!");

        case 9:
          console.log(1);
          _context.next = 12;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 12:
          if (!(result.main_type == "session")) {
            _context.next = 97;
            break;
          }

          //update session table
          qry_session = "UPDATE sessions SET is_active = ?, is_suspended=?, is_declared=?, result=? WHERE event_id = ? and runner_name =?";
          values_session = [0, 1, 1, manual_session.price, result.event_id, result.runner_name];
          _context.next = 17;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_session, values_session));

        case 17:
          console.log(3); //update sessionbets table

          qry_winner = "update sessionbets set updated_at=?, is_won = 1,status=0, profit_loss = win_amount where event_id = ? and runner_name  = ? and ((type = 'Back' and price between 1 and ?) or (type= 'Lay' and price > ?))";
          values_winner = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id, result.runner_name, manual_session.price, manual_session.price];
          _context.next = 22;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_winner, values_winner));

        case 22:
          console.log(4);
          qry_losers = "UPDATE sessionbets set updated_at=?, is_won = 0, status=0, profit_loss = loss_amount where event_id = ? and runner_name=? and ((type = 'Lay' and price between 1 and ?) or (type= 'Back' and price > ?))";
          values_losers = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id, result.runner_name, manual_session.price, manual_session.price];
          _context.next = 27;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_losers, values_losers));

        case 27:
          console.log(5); //get all players total p/l of runner

          qry_players = "SELECT user_id, SUM(profit_loss) AS total_pl, event_id, runner_name, status, ( SELECT MAX(created_at) FROM sessionbets AS sub WHERE sub.user_id = sb.user_id AND sub.event_id = sb.event_id AND sub.runner_name = sb.runner_name ) AS latest_created_at FROM sessionbets AS sb WHERE event_id = ? AND runner_name = ? GROUP BY user_id, event_id, runner_name, status HAVING status = 0";
          values_players = [result.event_id, result.runner_name];
          _context.next = 32;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_players, values_players));

        case 32:
          all_players = _context.sent;
          console.log(6);
          i = 7; // Loop through the dataArray and insert each element into the database

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 38;
          _iterator = all_players[Symbol.iterator]();

        case 40:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 73;
            break;
          }

          data = _step.value;
          user_id = data.user_id, total_pl = data.total_pl, event_id = data.event_id, runner_name = data.runner_name, latest_created_at = data.latest_created_at; //update main balance

          query = "update users set balance = balance + ? where id = ?";
          values = [total_pl, user_id];
          _context.next = 47;
          return regeneratorRuntime.awrap(executeQuery(connection, query, values));

        case 47:
          console.log(i++);
          ledger_data = {
            user_id: user_id,
            event_id: event_id,
            event_name: result.event_name,
            type: "cricket",
            subtype: "session",
            runner_name: runner_name,
            profit_loss: total_pl,
            created_at: latest_created_at
          }; //add into ledger

          qry_ledger = "INSERT INTO ledger set ?";
          _context.next = 52;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_ledger, ledger_data));

        case 52:
          console.log(i++);

          if (!(total_pl > 0)) {
            _context.next = 62;
            break;
          }

          //add winner
          win_data = {
            user_id: user_id,
            win_amount: total_pl,
            event_id: event_id,
            main_type: result.main_type,
            runner_name: result.runner_name
          };
          new_winner = new Winner(win_data); //add to winners table

          qry_win = "INSERT INTO winners set ?";
          _context.next = 59;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_win, new_winner));

        case 59:
          console.log(i++);
          _context.next = 70;
          break;

        case 62:
          if (!(total_pl < 0)) {
            _context.next = 70;
            break;
          }

          loss_data = {
            user_id: user_id,
            loss_amount: total_pl,
            event_id: event_id,
            main_type: result.main_type,
            runner_name: result.runner_name
          };
          new_loser = new Loser(loss_data); //add to losers table

          qry_loss = "INSERT INTO losers set ?";
          _context.next = 68;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_loss, new_loser));

        case 68:
          console.log(i++);
          shareProfit("session", user_id, total_pl, event_id, runner_name);

        case 70:
          _iteratorNormalCompletion = true;
          _context.next = 40;
          break;

        case 73:
          _context.next = 79;
          break;

        case 75:
          _context.prev = 75;
          _context.t0 = _context["catch"](38);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 79:
          _context.prev = 79;
          _context.prev = 80;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 82:
          _context.prev = 82;

          if (!_didIteratorError) {
            _context.next = 85;
            break;
          }

          throw _iteratorError;

        case 85:
          return _context.finish(82);

        case 86:
          return _context.finish(79);

        case 87:
          //update exposure
          qry_exp = "update exposures set updated_at=?, exp_amount = 0, status=0 where event_id=? and runner_name = ?";
          exp_values = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id, result.runner_name];
          _context.next = 91;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, exp_values));

        case 91:
          console.log(i++); //add to result table

          _context.next = 94;
          return regeneratorRuntime.awrap(executeQuery(connection, "INSERT INTO results set ?", result));

        case 94:
          console.log(2);
          _context.next = 180;
          break;

        case 97:
          if (!(result.main_type == "match_odd")) {
            _context.next = 180;
            break;
          }

          //update match table
          qry_match = "UPDATE marketodds SET is_active0 = ?, is_suspended0=?,is_active1 = ?, is_suspended1=?,is_active2 = ?, is_suspended2=?, is_declared=?, result=?, result_type=? WHERE event_id = ?";
          values_match = [0, 1, 0, 1, 0, 1, 1, result.runner_name, result.type, result.event_id];
          _context.next = 102;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_match, values_match));

        case 102:
          console.log(3); //update matchbets table

          _qry_winner = "update matchbets set updated_at=?, is_won=1, profit_loss=win_amount, status = 0 where event_id = ? and ((runner_name = ? and type='Back')or(runner_name != ? and type='Lay'))";
          _values_winner = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id, result.runner_name, result.runner_name];
          _context.next = 107;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_winner, _values_winner));

        case 107:
          console.log(4);
          _qry_losers = "update matchbets set updated_at=?, is_won=0,profit_loss=loss_amount, status = 0 where event_id = ? and ((runner_name = ? and type='Lay') or (runner_name!=? and type='Back'))";
          _values_losers = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id, result.runner_name, result.runner_name];
          _context.next = 112;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_losers, _values_losers));

        case 112:
          console.log(5); //get all players total p/l of runner

          _qry_players = "SELECT user_id, SUM(profit_loss) AS total_pl, event_id, runner_name, ( SELECT MAX(created_at) FROM matchbets AS sub WHERE sub.status = 0 AND sub.event_id = ? AND sub.user_id = mb.user_id ) AS latest_created_at FROM matchbets AS mb WHERE status = 0 AND event_id = ? GROUP BY user_id, event_id";
          _values_players = [result.event_id, result.event_id];
          _context.next = 117;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_players, _values_players));

        case 117:
          _all_players = _context.sent;
          console.log(6);
          _i = 7; // Loop through the dataArray and insert each element into the database

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 123;
          _iterator2 = _all_players[Symbol.iterator]();

        case 125:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 158;
            break;
          }

          _data = _step2.value;
          _user_id = _data.user_id, _total_pl = _data.total_pl, _event_id = _data.event_id, _runner_name = _data.runner_name, _latest_created_at = _data.latest_created_at; //update main balance

          _query = "update users set balance = balance + ? where id = ?";
          _values = [_total_pl, _user_id];
          _context.next = 132;
          return regeneratorRuntime.awrap(executeQuery(connection, _query, _values));

        case 132:
          console.log(_i++);
          _ledger_data = {
            user_id: _user_id,
            event_id: _event_id,
            event_name: result.event_name,
            type: "cricket",
            subtype: "match_odd",
            runner_name: result.event_name,
            profit_loss: _total_pl,
            created_at: _latest_created_at
          }; //add into ledger

          _qry_ledger = "INSERT INTO ledger set ?";
          _context.next = 137;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_ledger, _ledger_data));

        case 137:
          console.log(_i++);

          if (!(_total_pl > 0)) {
            _context.next = 147;
            break;
          }

          //add winner
          _win_data = {
            user_id: _user_id,
            win_amount: _total_pl,
            event_id: _event_id,
            main_type: result.main_type,
            runner_name: result.runner_name
          };
          _new_winner = new Winner(_win_data); //add to winners table

          _qry_win = "INSERT INTO winners set ?";
          _context.next = 144;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_win, _new_winner));

        case 144:
          console.log(_i++);
          _context.next = 155;
          break;

        case 147:
          if (!(_total_pl < 0)) {
            _context.next = 155;
            break;
          }

          _loss_data = {
            user_id: _user_id,
            loss_amount: _total_pl,
            event_id: _event_id,
            main_type: result.main_type,
            runner_name: result.runner_name
          };
          _new_loser = new Loser(_loss_data); //add to losers table

          _qry_loss = "INSERT INTO losers set ?";
          _context.next = 153;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_loss, _new_loser));

        case 153:
          console.log(_i++);
          shareProfit("match_odd", _user_id, _total_pl, _event_id, _runner_name);

        case 155:
          _iteratorNormalCompletion2 = true;
          _context.next = 125;
          break;

        case 158:
          _context.next = 164;
          break;

        case 160:
          _context.prev = 160;
          _context.t1 = _context["catch"](123);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 164:
          _context.prev = 164;
          _context.prev = 165;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 167:
          _context.prev = 167;

          if (!_didIteratorError2) {
            _context.next = 170;
            break;
          }

          throw _iteratorError2;

        case 170:
          return _context.finish(167);

        case 171:
          return _context.finish(164);

        case 172:
          //get all players p/l
          // let qry_pl =
          //   "select user_id, profit_loss,event_id,runner_name,created_at from matchbets where status=0 and event_id = ?";
          // values_pl = [result.event_id];
          // let users_pl = await executeQuery(connection, qry_pl, values_pl);
          // console.log(i++);
          // // Loop through the dataArray and insert each element into the database
          // for (const data of users_pl) {
          //   const { user_id, profit_loss, event_id, runner_name, created_at } =
          //     data;
          //   let ledger_data = {
          //     user_id: user_id,
          //     event_id: event_id,
          //     event_name: result.event_name,
          //     type: "cricket",
          //     subtype: "match_odd",
          //     runner_name: runner_name,
          //     profit_loss: profit_loss,
          //     created_at: created_at,
          //   };
          //   //add into ledger
          //   const qry_ledger = `INSERT INTO ledger set ?`;
          //   await executeQuery(connection, qry_ledger, ledger_data);
          //   console.log(i++);
          // }
          //update exposure
          _qry_exp = "update exposures set updated_at=?, exp_amount = 0, status=0 where event_id=? and main_type='match_odd'";
          _exp_values = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id];
          _context.next = 176;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_exp, _exp_values));

        case 176:
          console.log(_i++); //add to result table

          _context.next = 179;
          return regeneratorRuntime.awrap(executeQuery(connection, "INSERT INTO results set ?", result));

        case 179:
          console.log(2);

        case 180:
          _context.next = 182;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 182:
          msg = _context.sent;
          return _context.abrupt("return", msg);

        case 186:
          _context.prev = 186;
          _context.t2 = _context["catch"](3);
          console.error("Error in transaction:", _context.t2); // Rollback the transaction if any query encounters an error

          _context.next = 191;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 191:
          _msg = _context.sent;
          return _context.abrupt("return", _msg);

        case 193:
          _context.prev = 193;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context.finish(193);

        case 197:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[3, 186, 193, 197], [38, 75, 79, 87], [80,, 82, 86], [123, 160, 164, 172], [165,, 167, 171]]);
};

var shareProfit = function shareProfit(subtype, user_id, profit, event_id, runner_name) {
  var connection, qry_puser, puser, qry_auser, applicant, applicantProfit, query, values, ledger_data, qry_ledger;
  return regeneratorRuntime.async(function shareProfit$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getConnection(dbConn));

        case 2:
          connection = _context2.sent;
          // find applicant
          qry_puser = "select added_by from users where id = ?";
          _context2.next = 6;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_puser, [user_id]));

        case 6:
          puser = _context2.sent;
          qry_auser = "select id,profit_share from users where id = ?";
          _context2.next = 10;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_auser, [puser[0].added_by]));

        case 10:
          applicant = _context2.sent;

          if (!(applicant[0] && applicant[0].profit_share !== null && applicant[0].profit_share !== undefined && applicant[0].profit_share > 0)) {
            _context2.next = 21;
            break;
          }

          applicantProfit = clcPerAmount(profit, applicant[0].profit_share); // update in applicant balance

          query = "update users set balance = balance + ? where id = ?";
          values = [applicantProfit, applicant[0].id];
          _context2.next = 17;
          return regeneratorRuntime.awrap(executeQuery(connection, query, values));

        case 17:
          ledger_data = {
            user_id: applicant[0].id,
            event_id: event_id,
            type: "cricket",
            subtype: subtype,
            runner_name: runner_name,
            profit_loss: applicantProfit
          }; //add into ledger

          qry_ledger = "INSERT INTO ledger set ?";
          _context2.next = 21;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_ledger, ledger_data));

        case 21:
          return _context2.abrupt("return", true);

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var RoleBackshareProfit = function RoleBackshareProfit(subtype, user_id, profit, event_id, runner_name) {
  var connection, qry_puser, puser, qry_auser, applicant, applicantProfit, qry_balance, values_balance, ledger_data, qry_ledger;
  return regeneratorRuntime.async(function RoleBackshareProfit$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(getConnection(dbConn));

        case 2:
          connection = _context3.sent;
          // find applicant
          qry_puser = "select added_by from users where id = ?";
          _context3.next = 6;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_puser, [user_id]));

        case 6:
          puser = _context3.sent;
          qry_auser = "select id,profit_share from users where id = ?";
          _context3.next = 10;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_auser, [puser[0].added_by]));

        case 10:
          applicant = _context3.sent;

          if (!(applicant[0] && applicant[0].profit_share !== null && applicant[0].profit_share !== undefined && applicant[0].profit_share > 0)) {
            _context3.next = 22;
            break;
          }

          applicantProfit = clcPerAmount(profit, applicant[0].profit_share);
          applicantProfit = -1 * applicantProfit; // update in applicant balance

          qry_balance = "update users set balance = balance - ? where id = ?";
          values_balance = [applicantProfit, applicant[0].id_id];
          _context3.next = 18;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_balance, values_balance));

        case 18:
          ledger_data = {
            user_id: applicant[0].id,
            event_id: event_id,
            type: "cricket",
            subtype: subtype,
            runner_name: runner_name,
            profit_loss: applicantProfit
          }; //add into ledger

          qry_ledger = "INSERT INTO ledger set ?";
          _context3.next = 22;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_ledger, ledger_data));

        case 22:
          return _context3.abrupt("return", true);

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  });
};

function clcPerAmount(amount, percentage) {
  var pamount = Math.abs(amount);
  return percentage / 100 * pamount;
} //rollback result


ResultMaster.rollBackResult = function _callee2(result) {
  var connection, is_declared, qry_total_session_pl, values_total_session_pl, players_total_pl, i, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, data, user_id, total_pl, qry_balance, values_balance, qry_session, values_session, qry_sessionbets, values_sessionbets, qry_losers, values_losers, qry_winners, values_winners, qry_ledger, values_ledger, qry_exp, values_exp, qry_delete_result, values_result, qry_total_match_pl, values_total_match_pl, _players_total_pl, _i2, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _data2, _user_id2, _total_pl2, _qry_balance, _values_balance, qry_match, values_match, qry_matchbets, values_matchbets, _qry_losers2, _values_losers2, _qry_winners, _values_winners, _qry_ledger2, _values_ledger, _qry_exp2, _values_exp, _qry_delete_result, _values_result, msg, _msg2;

  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(getConnection(dbConn));

        case 2:
          connection = _context4.sent;
          _context4.prev = 3;
          _context4.next = 6;
          return regeneratorRuntime.awrap(this.isResultDeclared(result));

        case 6:
          is_declared = _context4.sent;

          if (!(is_declared != 1)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", "No result found. Please Refresh");

        case 9:
          console.log(1);
          _context4.next = 12;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 12:
          if (!(result.main_type == "session")) {
            _context4.next = 88;
            break;
          }

          //update user balance
          qry_total_session_pl = "select user_id,sum(profit_loss)as total_pl,event_id,runner_name,status from sessionbets GROUP BY user_id,event_id,runner_name HAVING status=0 and event_id = ? and runner_name=?";
          values_total_session_pl = [result.event_id, result.runner_name];
          _context4.next = 17;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_total_session_pl, values_total_session_pl));

        case 17:
          players_total_pl = _context4.sent;
          console.log(2);
          i = 3;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context4.prev = 23;
          _iterator3 = players_total_pl[Symbol.iterator]();

        case 25:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context4.next = 37;
            break;
          }

          data = _step3.value;
          user_id = data.user_id, total_pl = data.total_pl;
          qry_balance = "update users set balance = balance - ? where id = ?";
          values_balance = [total_pl, user_id];
          _context4.next = 32;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_balance, values_balance));

        case 32:
          RoleBackshareProfit("session", user_id, total_pl, result.event_id, result.runner_name);
          console.log(i++);

        case 34:
          _iteratorNormalCompletion3 = true;
          _context4.next = 25;
          break;

        case 37:
          _context4.next = 43;
          break;

        case 39:
          _context4.prev = 39;
          _context4.t0 = _context4["catch"](23);
          _didIteratorError3 = true;
          _iteratorError3 = _context4.t0;

        case 43:
          _context4.prev = 43;
          _context4.prev = 44;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 46:
          _context4.prev = 46;

          if (!_didIteratorError3) {
            _context4.next = 49;
            break;
          }

          throw _iteratorError3;

        case 49:
          return _context4.finish(46);

        case 50:
          return _context4.finish(43);

        case 51:
          //update the sessions
          qry_session = "UPDATE sessions SET  is_active = ?, is_suspended=?, is_declared=?, result=? WHERE event_id = ? and runner_name =?";
          values_session = [1, 0, 0, null, result.event_id, result.runner_name];
          _context4.next = 55;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_session, values_session));

        case 55:
          console.log(i++); //update session bets

          qry_sessionbets = "UPDATE sessionbets set updated_at=?, is_won = ?,profit_loss=0, status=? where event_id = ? and runner_name=?";
          values_sessionbets = [moment().format("YYYY-MM-DD HH:mm:ss"), null, 1, result.event_id, result.runner_name];
          _context4.next = 60;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_sessionbets, values_sessionbets));

        case 60:
          console.log(i++); //delete from losers

          qry_losers = "delete from losers where event_id=? and runner_name=? and main_type='session'";
          values_losers = [result.event_id, result.runner_name];
          _context4.next = 65;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_losers, values_losers));

        case 65:
          console.log(i++); //delete winners

          qry_winners = "delete from winners where event_id=? and runner_name=? and main_type='session'";
          values_winners = [result.event_id, result.runner_name];
          _context4.next = 70;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_winners, values_winners));

        case 70:
          console.log(i++); //delete from ledger

          qry_ledger = "delete from ledger where event_id=? and runner_name=? and subtype='session'";
          values_ledger = [result.event_id, result.runner_name];
          _context4.next = 75;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_ledger, values_ledger));

        case 75:
          console.log(i++); //update exposures

          qry_exp = "update exposures set updated_at=?, exp_amount = deducted_amount, status=1 where event_id=? and runner_name = ?";
          values_exp = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id, result.runner_name];
          _context4.next = 80;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, values_exp));

        case 80:
          console.log(i++); //delete from results

          qry_delete_result = "Delete from results where event_id=? and runner_name= ? and  main_type=?";
          values_result = [result.event_id, result.runner_name, result.main_type];
          _context4.next = 85;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_delete_result, values_result));

        case 85:
          console.log(i++);
          _context4.next = 161;
          break;

        case 88:
          if (!(result.main_type == "match_odd")) {
            _context4.next = 161;
            break;
          }

          //update user balance
          qry_total_match_pl = "select user_id,sum(profit_loss)as total_pl,event_id from matchbets where status=0 and event_id = ? GROUP BY user_id";
          values_total_match_pl = [result.event_id];
          _context4.next = 93;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_total_match_pl, values_total_match_pl));

        case 93:
          _players_total_pl = _context4.sent;
          console.log(2);
          _i2 = 3;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context4.prev = 99;
          _iterator4 = _players_total_pl[Symbol.iterator]();

        case 101:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context4.next = 112;
            break;
          }

          _data2 = _step4.value;
          _user_id2 = _data2.user_id, _total_pl2 = _data2.total_pl;
          _qry_balance = "update users set balance = balance - ? where id = ?";
          _values_balance = [_total_pl2, _user_id2];
          _context4.next = 108;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_balance, _values_balance));

        case 108:
          RoleBackshareProfit("match_odd", _user_id2, _total_pl2, result.event_id, result.runner_name);

        case 109:
          _iteratorNormalCompletion4 = true;
          _context4.next = 101;
          break;

        case 112:
          _context4.next = 118;
          break;

        case 114:
          _context4.prev = 114;
          _context4.t1 = _context4["catch"](99);
          _didIteratorError4 = true;
          _iteratorError4 = _context4.t1;

        case 118:
          _context4.prev = 118;
          _context4.prev = 119;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 121:
          _context4.prev = 121;

          if (!_didIteratorError4) {
            _context4.next = 124;
            break;
          }

          throw _iteratorError4;

        case 124:
          return _context4.finish(121);

        case 125:
          return _context4.finish(118);

        case 126:
          //update the matchodds
          qry_match = "UPDATE marketodds SET is_active0 = ?, is_suspended0=?,is_active1 = ?, is_suspended1=?,is_active2 = ?, is_suspended2=?, is_declared=?, result=?, result_type=? WHERE event_id = ?";
          values_match = [1, 0, 1, 0, 1, 0, 0, null, null, result.event_id];
          _context4.next = 130;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_match, values_match));

        case 130:
          console.log(_i2++); //update matchbets

          qry_matchbets = "update matchbets set updated_at=?, is_won=?,profit_loss=0,is_switched=0, status = ? where event_id = ?";
          values_matchbets = [moment().format("YYYY-MM-DD HH:mm:ss"), null, 1, result.event_id];
          _context4.next = 135;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_matchbets, values_matchbets));

        case 135:
          console.log(_i2++); //delete losers

          _qry_losers2 = "delete from losers where event_id=? and main_type='match_odd'";
          _values_losers2 = [result.event_id, result.runner_name];
          _context4.next = 140;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_losers2, _values_losers2));

        case 140:
          console.log(_i2++); //delete winners

          _qry_winners = "delete from winners where event_id=? and main_type='match_odd'";
          _values_winners = [result.event_id, result.runner_name];
          _context4.next = 145;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_winners, _values_winners));

        case 145:
          console.log(_i2++); //delete from ledger

          _qry_ledger2 = "delete from ledger where event_id=? and subtype='match_odd'";
          _values_ledger = [result.event_id];
          _context4.next = 150;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_ledger2, _values_ledger));

        case 150:
          console.log(_i2++); //update exposures

          _qry_exp2 = "update exposures set updated_at=?, exp_amount = deducted_amount, status=1 where event_id=? and main_type='match_odd'";
          _values_exp = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id];
          _context4.next = 155;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_exp2, _values_exp));

        case 155:
          console.log(_i2++); //delete from results

          _qry_delete_result = "Delete from results where event_id=? and runner_name= ? and  main_type=?";
          _values_result = [result.event_id, result.runner_name, result.main_type];
          _context4.next = 160;
          return regeneratorRuntime.awrap(executeQuery(connection, _qry_delete_result, _values_result));

        case 160:
          console.log(_i2++);

        case 161:
          _context4.next = 163;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 163:
          msg = _context4.sent;
          return _context4.abrupt("return", msg);

        case 167:
          _context4.prev = 167;
          _context4.t2 = _context4["catch"](3);
          console.error("Error in transaction:", _context4.t2); // Rollback the transaction if any query encounters an error

          _context4.next = 172;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 172:
          _msg2 = _context4.sent;
          return _context4.abrupt("return", _msg2);

        case 174:
          _context4.prev = 174;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context4.finish(174);

        case 178:
        case "end":
          return _context4.stop();
      }
    }
  }, null, this, [[3, 167, 174, 178], [23, 39, 43, 51], [44,, 46, 50], [99, 114, 118, 126], [119,, 121, 125]]);
};

ResultMaster.declareDraw = function _callee3(result) {
  var connection, is_declared, qry_exp, values_exp, qry_player, values_players, all_players, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, data, user_id, total_pl, event_id, ledger_data, qry_ledger, qry_matchbets, values_matchbets, qry_update_matchodds, values_update_matchodds, qry_insert_deletebets, delete_values, qry_deletebets, deletebet_values, msg, _msg3;

  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(getConnection(dbConn));

        case 2:
          connection = _context5.sent;
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(this.isResultDeclared(result));

        case 6:
          is_declared = _context5.sent;

          if (!(is_declared > 0)) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", "Please refresh. Result already declared..!!");

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 11:
          //clear exposure for match_odd and event_id
          qry_exp = "UPDATE exposures e set exp_amount = 0, status = 0 where event_id = ? and main_type = 'match_odd'";
          values_exp = [result.event_id];
          _context5.next = 15;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, values_exp));

        case 15:
          //update ledger
          qry_player = "SELECT *, sum(profit_loss) 'total_pl' FROM matchbets where event_id = ? and status = 1 group by user_id;";
          values_players = [result.event_id];
          _context5.next = 19;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_player, values_players));

        case 19:
          all_players = _context5.sent;
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context5.prev = 23;
          _iterator5 = all_players[Symbol.iterator]();

        case 25:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context5.next = 35;
            break;
          }

          data = _step5.value;
          user_id = data.user_id, total_pl = data.total_pl, event_id = data.event_id;
          ledger_data = {
            user_id: user_id,
            event_id: event_id,
            event_name: result.event_name,
            type: "cricket",
            subtype: "match_odd",
            runner_name: "Match Drawn",
            profit_loss: total_pl
          }; //add into ledger

          qry_ledger = "INSERT INTO ledger set ?";
          _context5.next = 32;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_ledger, ledger_data));

        case 32:
          _iteratorNormalCompletion5 = true;
          _context5.next = 25;
          break;

        case 35:
          _context5.next = 41;
          break;

        case 37:
          _context5.prev = 37;
          _context5.t0 = _context5["catch"](23);
          _didIteratorError5 = true;
          _iteratorError5 = _context5.t0;

        case 41:
          _context5.prev = 41;
          _context5.prev = 42;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 44:
          _context5.prev = 44;

          if (!_didIteratorError5) {
            _context5.next = 47;
            break;
          }

          throw _iteratorError5;

        case 47:
          return _context5.finish(44);

        case 48:
          return _context5.finish(41);

        case 49:
          //update matchbets with event_id
          qry_matchbets = "update matchbets set status=0, is_won = 2, updated_at=? where event_id = ? and status = 1";
          values_matchbets = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id];
          _context5.next = 53;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_matchbets, values_matchbets));

        case 53:
          //is_declared in matchodds
          qry_update_matchodds = "update marketodds set is_active0=0, is_suspended0=1,is_active1=0, is_suspended1=1, is_active2 =0, is_suspended2 =1, is_declared = 1, result = 'Draw', result_type ='Back', updated_at=? where event_id = ?";
          values_update_matchodds = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id];
          _context5.next = 57;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_update_matchodds, values_update_matchodds));

        case 57:
          _context5.next = 59;
          return regeneratorRuntime.awrap(executeQuery(connection, "INSERT INTO results set ?", result));

        case 59:
          //add drawn bets into deletedbets table
          qry_insert_deletebets = "INSERT INTO deletedmatchbets(bet_id,user_id,event_id,market_id,event_name,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,exp_amount3,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM matchbets where event_id = ?";
          delete_values = [result.event_id];
          _context5.next = 63;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_insert_deletebets, delete_values));

        case 63:
          //delete bets
          qry_deletebets = "delete from matchbets where event_id = ?";
          deletebet_values = [result.event_id];
          _context5.next = 67;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_deletebets, deletebet_values));

        case 67:
          _context5.next = 69;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 69:
          msg = _context5.sent;
          return _context5.abrupt("return", msg);

        case 73:
          _context5.prev = 73;
          _context5.t1 = _context5["catch"](3);
          console.error("Error in transaction:", _context5.t1); // Rollback the transaction if any query encounters an error

          _context5.next = 78;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 78:
          _msg3 = _context5.sent;
          return _context5.abrupt("return", _msg3);

        case 80:
          _context5.prev = 80;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context5.finish(80);

        case 84:
        case "end":
          return _context5.stop();
      }
    }
  }, null, this, [[3, 73, 80, 84], [23, 37, 41, 49], [42,, 44, 48]]);
};

ResultMaster.clearBookmaker = function _callee4(result) {
  var connection, is_declared, qry_exp, values_exp, qry_player, values_players, all_players, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, data, user_id, total_pl, event_id, ledger_data, qry_ledger, qry_matchbets, values_matchbets, qry_update_matchodds, values_update_matchodds, qry_insert_deletebets, delete_values, qry_deletebets, deletebet_values, msg, _msg4;

  return regeneratorRuntime.async(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(getConnection(dbConn));

        case 2:
          connection = _context6.sent;
          _context6.prev = 3;
          _context6.next = 6;
          return regeneratorRuntime.awrap(this.isResultDeclared(result));

        case 6:
          is_declared = _context6.sent;

          if (!(is_declared > 0)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", "Please refresh. Result already declared..!!");

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(beginTransaction(connection));

        case 11:
          //clear exposure for bookmaker and event_id
          qry_exp = "UPDATE exposures e set exp_amount = 0, status = 0 where event_id = ? and main_type = 'bookmaker'";
          values_exp = [result.event_id];
          _context6.next = 15;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_exp, values_exp));

        case 15:
          //update ledger
          qry_player = "SELECT *, sum(profit_loss) 'total_pl' FROM bookmakerbets where event_id = ? and status = 1 group by user_id;";
          values_players = [result.event_id];
          _context6.next = 19;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_player, values_players));

        case 19:
          all_players = _context6.sent;
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context6.prev = 23;
          _iterator6 = all_players[Symbol.iterator]();

        case 25:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context6.next = 35;
            break;
          }

          data = _step6.value;
          user_id = data.user_id, total_pl = data.total_pl, event_id = data.event_id;
          ledger_data = {
            user_id: user_id,
            event_id: event_id,
            event_name: result.event_name,
            type: "cricket",
            subtype: "bookmaker",
            runner_name: "Match Drawn",
            profit_loss: total_pl
          }; //add into ledger

          qry_ledger = "INSERT INTO ledger set ?";
          _context6.next = 32;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_ledger, ledger_data));

        case 32:
          _iteratorNormalCompletion6 = true;
          _context6.next = 25;
          break;

        case 35:
          _context6.next = 41;
          break;

        case 37:
          _context6.prev = 37;
          _context6.t0 = _context6["catch"](23);
          _didIteratorError6 = true;
          _iteratorError6 = _context6.t0;

        case 41:
          _context6.prev = 41;
          _context6.prev = 42;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 44:
          _context6.prev = 44;

          if (!_didIteratorError6) {
            _context6.next = 47;
            break;
          }

          throw _iteratorError6;

        case 47:
          return _context6.finish(44);

        case 48:
          return _context6.finish(41);

        case 49:
          //update matchbets with event_id
          qry_matchbets = "update bookmakerbets set status=0, is_won = 2, updated_at=? where event_id = ? and status = 1";
          values_matchbets = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id];
          _context6.next = 53;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_matchbets, values_matchbets));

        case 53:
          //is_declared in matchodds
          qry_update_matchodds = "update bookmakerodds set is_suspended0=1, is_suspended1=1, is_suspended2 =1, is_declared = 1, result = 'Draw', result_type ='Back', updated_at=? where event_id = ?";
          values_update_matchodds = [moment().format("YYYY-MM-DD HH:mm:ss"), result.event_id];
          _context6.next = 57;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_update_matchodds, values_update_matchodds));

        case 57:
          _context6.next = 59;
          return regeneratorRuntime.awrap(executeQuery(connection, "INSERT INTO results set ?", result));

        case 59:
          //add drawn bets into deletedbets table
          qry_insert_deletebets = "INSERT INTO deletedbookmakerbets(`bet_id`, `user_id`, `event_id`, `market_id`, `event_name`, `main_type`, `runner_name`, `type`, `price`, `size`, `bet_amount`, `loss_amount`, `win_amount`, `exp_amount1`, `exp_amount2`, `exp_amount3`, `profit_loss`, `status`, `is_won`, `is_switched`, `updated_at`, `created_at`) SELECT * FROM bookmakerbets where event_id = ?";
          delete_values = [result.event_id];
          _context6.next = 63;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_insert_deletebets, delete_values));

        case 63:
          //delete bets
          qry_deletebets = "delete from bookmakerbets where event_id = ?";
          deletebet_values = [result.event_id];
          _context6.next = 67;
          return regeneratorRuntime.awrap(executeQuery(connection, qry_deletebets, deletebet_values));

        case 67:
          _context6.next = 69;
          return regeneratorRuntime.awrap(commitTransaction(connection));

        case 69:
          msg = _context6.sent;
          return _context6.abrupt("return", msg);

        case 73:
          _context6.prev = 73;
          _context6.t1 = _context6["catch"](3);
          console.error("Error in transaction:", _context6.t1); // Rollback the transaction if any query encounters an error

          _context6.next = 78;
          return regeneratorRuntime.awrap(rollbackTransaction(connection));

        case 78:
          _msg4 = _context6.sent;
          return _context6.abrupt("return", _msg4);

        case 80:
          _context6.prev = 80;
          // Release the connection back to the pool
          connection.release();
          console.log("Connection released.");
          return _context6.finish(80);

        case 84:
        case "end":
          return _context6.stop();
      }
    }
  }, null, this, [[3, 73, 80, 84], [23, 37, 41, 49], [42,, 44, 48]]);
}; //get all p/l after result


ResultMaster.getAllBetsPL = function _callee5(user_id) {
  var all_bets_pl;
  return regeneratorRuntime.async(function _callee5$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT  sb.user_id, sb.event_id,sb.event_name, sb.main_type, sb.runner_name, sb.type, sb.price, sb.size, sb.loss_amount, sb.win_amount,sb.bet_amount, sb.profit_loss, sb.status, sb.is_won, sb.updated_at FROM (SELECT user_id, event_id,event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM sessionbets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) UNION ALL SELECT user_id, event_id,event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM matchbets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) UNION ALL SELECT user_id, event_id, event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM bookmakerbets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) UNION ALL SELECT user_id, event_id, event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM fancybets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY)) AS sb ORDER BY sb.updated_at DESC,sb.event_id", [user_id, user_id, user_id, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          all_bets_pl = _context7.sent;
          return _context7.abrupt("return", all_bets_pl);

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
}; //get all bets detail(m+s+t) after result declared by grouping event for specific user in admin


ResultMaster.getAllBetsPLOverview = function _callee6(user_id) {
  var all_bets_pl;
  return regeneratorRuntime.async(function _callee6$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT event_id,event_name, total_profit_loss, runner_name FROM ( SELECT matchbets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, 'Match Odds' AS runner_name FROM matchbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY)  GROUP BY event_id UNION SELECT sessionbets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, runner_name FROM sessionbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id, runner_name UNION SELECT bookmakerbets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, runner_name FROM bookmakerbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id, runner_name UNION SELECT fancybets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, runner_name FROM fancybets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id, runner_name UNION SELECT tennisbets.event_id,event_name, SUM(profit_loss) AS total_profit_loss, 'Match Odds' AS runner_name FROM tennisbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id UNION SELECT soccerbets.event_id,event_name, SUM(profit_loss) AS total_profit_loss, 'Match Odds' AS runner_name FROM soccerbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id )As Combined_Result", [user_id, user_id, user_id, user_id, user_id, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                var queryResult = res;
                var eventsObj = {}; // Iterate over the query result

                for (var i = 0; i < queryResult.length; i++) {
                  var _queryResult$i = queryResult[i],
                      event_id = _queryResult$i.event_id,
                      event_name = _queryResult$i.event_name,
                      total_profit_loss = _queryResult$i.total_profit_loss,
                      runner_name = _queryResult$i.runner_name; // Check if the event already exists in the eventsObj

                  if (eventsObj[event_name]) {
                    // If the event exists, push a new object to its array
                    eventsObj[event_name].push({
                      event_id: event_id,
                      event_name: event_name,
                      total_profit_loss: total_profit_loss,
                      runner_name: runner_name
                    });
                  } else {
                    // If the event doesn't exist, create a new array with the event object
                    eventsObj[event_name] = [{
                      event_id: event_id,
                      event_name: event_name,
                      total_profit_loss: total_profit_loss,
                      runner_name: runner_name
                    }];
                  }
                } // Convert the eventsObj into the desired array format


                var eventsArray = Object.entries(eventsObj).map(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                      event_name = _ref2[0],
                      eventArr = _ref2[1];

                  return _defineProperty({}, event_name, eventArr);
                }); // Print the resulting array of objects

                console.log(eventsArray);
                resolve(eventsArray);
              }
            });
          }));

        case 3:
          all_bets_pl = _context8.sent;
          return _context8.abrupt("return", all_bets_pl);

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

ResultMaster.isResultDeclared = function _callee7(result) {
  return regeneratorRuntime.async(function _callee7$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            if (result.main_type == "match_odd" || result.main_type == "bookmaker") {
              sql_declare = "select * from results where event_id = ? and main_type = ?";
              value_sql = [result.event_id, result.main_type];
            } else if (result.main_type == "session") {
              sql_declare = "select * from results where event_id = ? and main_type = ? and runner_name = ?";
              value_sql = [result.event_id, result.main_type, result.runner_name];
            } else if (result.main_type == "fancy") {
              sql_declare = "select * from results where event_id = ? and main_type = ? and runner_name = ?";
              value_sql = [result.event_id, result.main_type, result.runner_name];
            }

            dbConn.query(sql_declare, value_sql, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res.length);
              }
            });
          }));

        case 3:
          return _context9.abrupt("return", _context9.sent);

        case 6:
          _context9.prev = 6;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          return _context9.abrupt("return", _context9.t0);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

module.exports = ResultMaster;
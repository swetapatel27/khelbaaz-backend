const { parse } = require("dotenv");
var dbConn = require("./../../config/db");
require("dotenv").config();

var ReportMaster = function () {};

ReportMaster.getCompanyReport = async function (creator_id, event_id) {
  try {
    let qry_str1 =
      "SELECT u.username, COALESCE(SUM(loss_amount), 0) AS total_loss_amount, COALESCE(SUM(win_amount), 0) AS total_win_amount, (COALESCE(SUM(loss_amount), 0) + COALESCE(SUM(win_amount), 0)) AS total FROM ( SELECT l.user_id, l.loss_amount, 0 AS win_amount FROM losers l WHERE l.event_id = ? AND l.main_type = 'match_odd' UNION ALL SELECT w.user_id, 0 AS loss_amount, w.win_amount FROM winners w WHERE w.event_id = ? AND w.main_type = 'match_odd' ) AS subquery LEFT JOIN users u ON u.id = subquery.user_id where FIND_IN_SET(?, u.creator_id) GROUP BY subquery.user_id";
    let values1 = [event_id, event_id, creator_id];
    let qry_str2 =
      "SELECT u.username, COALESCE(SUM(loss_amount), 0) AS total_loss_amount, COALESCE(SUM(win_amount), 0) AS total_win_amount, (COALESCE(SUM(loss_amount), 0) + COALESCE(SUM(win_amount), 0)) AS total FROM ( SELECT l.user_id, l.loss_amount, 0 AS win_amount FROM losers l WHERE l.event_id = ? AND l.main_type = 'session' UNION ALL SELECT w.user_id, 0 AS loss_amount, w.win_amount FROM winners w WHERE w.event_id = ? AND w.main_type = 'session' ) AS subquery LEFT JOIN users u ON u.id = subquery.user_id where FIND_IN_SET(?, u.creator_id) GROUP BY subquery.user_id";
    let values2 = [event_id, event_id, creator_id];
    const promises = [
      new Promise((resolve, reject) => {
        dbConn.query(qry_str1, values1, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        dbConn.query(qry_str2, values2, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }),
    ];
    const results = await Promise.all(promises);
    let matches_report = results[0];
    let session_report = results[1];

    const mergedArr = [];

    matches_report.forEach((obj1) => {
      const obj2 = session_report.find((obj) => obj.username === obj1.username);
      if (obj2) {
        let match_obj = { username: obj1.username, match_total: obj1.total };
        let session_obj = { session_total: obj2.total };
        mergedArr.push({ ...match_obj, ...session_obj, matched: true });
      } else {
        let match_obj = { username: obj1.username, match_total: obj1.total };
        mergedArr.push({ ...match_obj, matched: false });
      }
    });

    session_report.forEach((obj2) => {
      const obj1 = matches_report.find((obj) => obj.username === obj2.username);
      if (!obj1) {
        let session_obj = {
          username: obj2.username,
          session_total: obj2.total,
        };
        mergedArr.push({ ...session_obj, session_total: 0, matched: false });
      }
    });
    let final_matched = [];
    mergedArr.forEach((ele) => {
      if (
        ele.hasOwnProperty("match_total") &&
        ele.hasOwnProperty("session_total")
      ) {
        final_matched.push(ele);
      } else if (!ele.hasOwnProperty("match_total")) {
        let new_ele = { ...ele, match_total: 0 };
        final_matched.push(new_ele);
      } else if (!ele.hasOwnProperty("session_total")) {
        let new_ele = { ...ele, session_total: 0 };
        final_matched.push(new_ele);
      }
    });

    return final_matched;
  } catch (error) {
    console.log(error);
  }
};

ReportMaster.getAgentStats = async function (creator_id, event_id) {
  try {
    let match_loss = [];
    let match_win = [];
    let session_loss = [];
    let session_win = [];
    let final_matches = [];
    let final_session = [];
    let final_agents_data = [];
    let final_agentdata_withshare = [];
    //get my master
    let agent_ids = await new Promise((resolve, reject) => {
      dbConn.query(
        "select creator_id from users where id = ?",
        creator_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    let agents = agent_ids.creator_id.split(",");
    const shares = await new Promise((resolve, reject) => {
      dbConn.query(
        'select id,username,user_share from users where id in (' +agents.join() +')',
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    const query1 =
      "select sum(loss_amount) as match_loss, u.id, l.event_id from losers l join users u on u.id = l.user_id where l.event_id=? and main_type ='match_odd' and find_in_set(?,u.creator_id)";
    const query2 =
      "select sum(win_amount) as match_win from winners w join users u on u.id = w.user_id where w.event_id=? and w.main_type ='match_odd' and find_in_set(?,u.creator_id)";
    const query3 =
      "select sum(loss_amount) as session_loss from losers l join users u on u.id = l.user_id where l.event_id=? and main_type ='session' and find_in_set(?,u.creator_id)";
    const query4 =
      "select sum(win_amount) as session_win from winners w join users u on u.id = w.user_id where w.event_id=? and w.main_type ='session' and find_in_set(?,u.creator_id)";

    // create an array of promises for each array of IDs and queries
    const promises1 = agents.map((id) => {
      return new Promise((resolve, reject) => {
        dbConn.query(query1, [event_id, id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            let obj = {
              agent_id: id,
              event_id: event_id,
              type: "match_odd",
              loss_amount:
                results[0].match_loss == null ? "0" : results[0].match_loss,
            };
            match_loss.push(obj);
            resolve(match_loss);
          }
        });
      });
    });

    const promises2 = agents.map((id) => {
      return new Promise((resolve, reject) => {
        dbConn.query(query2, [event_id, id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            let obj = {
              agent_id: id,
              event_id: event_id,
              type: "match_odd",
              win_amount:
                results[0].match_win == null ? "0" : results[0].match_win,
            };
            match_win.push(obj);
            resolve(match_win);
          }
        });
      });
    });
    const promises3 = agents.map((id) => {
      return new Promise((resolve, reject) => {
        dbConn.query(query3, [event_id, id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            let obj = {
              agent_id: id,
              event_id: event_id,
              type: "session",
              loss_amount:
                results[0].session_loss == null ? "0" : results[0].session_loss,
            };
            session_loss.push(obj);
            resolve(session_loss);
          }
        });
      });
    });
    const promises4 = agents.map((id) => {
      return new Promise((resolve, reject) => {
        dbConn.query(query4, [event_id, id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            let obj = {
              agent_id: id,
              event_id: event_id,
              type: "session",
              win_amount:
                results[0].session_win == null ? "0" : results[0].session_win,
            };
            session_win.push(obj);
            resolve(session_win);
          }
        });
      });
    });

    // execute all promises in parallel using Promise.all()
    let data = await Promise.all([
      ...promises1,
      ...promises2,
      ...promises3,
      ...promises4,
    ])
      .then((results) => {
        // console.log(match_loss);
        // console.log(match_win);
        // console.log(session_loss);
        // console.log(session_win);

        // Loop through match_loss
        for (const obj1 of match_loss) {
          const agentId = obj1.agent_id;
          const obj2 = match_win.find((obj) => obj.agent_id === agentId);

          // If agent_id exists in array2, sum the fields
          if (obj2) {
            const sum = parseInt(obj1.loss_amount) + parseInt(obj2.win_amount);
            const newObj = {
              agent_id: agentId,
              match_sum: sum,
              event_id: obj2.event_id,
              type: "match_odd",
            };
            final_matches.push(newObj);
          }
        }

        // Loop through session_loss
        for (const obj1 of session_loss) {
          const agentId = obj1.agent_id;
          const obj2 = session_win.find((obj) => obj.agent_id === agentId);

          // If agent_id exists in array2, sum the fields
          if (obj2) {
            const sum = parseInt(obj1.loss_amount) + parseInt(obj2.win_amount);
            const newObj = {
              agent_id: agentId,
              session_sum: sum,
              event_id: obj2.event_id,
              type: "session",
            };
            final_session.push(newObj);
          }
        }

        final_matches.forEach((obj1) => {
          let obj2 = final_session.find(
            (obj2) => obj2.agent_id === obj1.agent_id
          );
          if (obj2) {
            final_agents_data.push({
              agent_id: obj1.agent_id,
              match_amount: obj1.match_sum,
              session_amount: obj2.session_sum,
              event_id: obj1.event_id,
            });
          }
        });

        final_agents_data.map((obj1) => {
          let match = shares.find((obj2) => obj1.agent_id == obj2.id);
          if (match) {
            let new_obj = {
              ...obj1,
              username: match.username,
              share: match.user_share,
            };
            final_agentdata_withshare.push(new_obj);
          }
        });
        return final_agentdata_withshare;
      })
      .catch((error) => {
        // handle the error
        console.error(error);
      });
    return final_agentdata_withshare;
  } catch (error) {
    console.log(error);
  }
};

module.exports = ReportMaster;

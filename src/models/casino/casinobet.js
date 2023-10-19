var dbConn = require("../../../config/db");
const Exposure = require("../../models/exposure");
const axios = require("axios");
require("dotenv").config();
const Winner = require("../../models/winner");
const Loser = require("../../models/loser");
const schedule = require("node-schedule");

var CasinoBetMaster = function (casinoBet) {
  this.user_id = casinoBet.user_id;
  this.game_name = casinoBet.game_name;
  (this.type = casinoBet.type), (this.mid = casinoBet.m_id);
  this.sid = casinoBet.s_id;
  this.game_id = casinoBet.game_id;
  this.runner_name = casinoBet.runner_name;
  this.odds = casinoBet.odds;
  this.loss_amount = casinoBet.loss_amount;
  this.win_amount = casinoBet.win_amount;
  this.exp_amount1 = casinoBet.hasOwnProperty("exp_amount1")
    ? casinoBet.exp_amount1
    : 0;
  this.exp_amount2 = casinoBet.hasOwnProperty("exp_amount2")
    ? casinoBet.exp_amount2
    : 0;
  this.exp_amount3 = casinoBet.hasOwnProperty("exp_amount3")
    ? casinoBet.exp_amount3
    : 0;
  this.exp_amount4 = casinoBet.hasOwnProperty("exp_amount4")
    ? casinoBet.exp_amount4
    : 0;
  this.exp_amount5 = casinoBet.hasOwnProperty("exp_amount5")
    ? casinoBet.exp_amount5
    : 0;
  this.exp_amount6 = casinoBet.hasOwnProperty("exp_amount6")
    ? casinoBet.exp_amount6
    : 0;
  this.exp_amount7 = casinoBet.hasOwnProperty("exp_amount7")
    ? casinoBet.exp_amount7
    : 0;
  this.exp_amount8 = casinoBet.hasOwnProperty("exp_amount8")
    ? casinoBet.exp_amount8
    : 0;
  this.exp_amount9 = casinoBet.hasOwnProperty("exp_amount9")
    ? casinoBet.exp_amount9
    : 0;
  this.exp_amount10 = casinoBet.hasOwnProperty("exp_amount10")
    ? casinoBet.exp_amount10
    : 0;
  this.exp_amount11 = casinoBet.hasOwnProperty("exp_amount11")
    ? casinoBet.exp_amount11
    : 0;
  this.exp_amount12 = casinoBet.hasOwnProperty("exp_amount12")
    ? casinoBet.exp_amount12
    : 0;
  this.exp_amount13 = casinoBet.hasOwnProperty("exp_amount13")
    ? casinoBet.exp_amount13
    : 0;
  this.exp_amount14 = casinoBet.hasOwnProperty("exp_amount14")
    ? casinoBet.exp_amount14
    : 0;
  this.exp_amount15 = casinoBet.hasOwnProperty("exp_amount15")
    ? casinoBet.exp_amount15
    : 0;
  this.exp_amount16 = casinoBet.hasOwnProperty("exp_amount16")
    ? casinoBet.exp_amount16
    : 0;
  this.exp_amount17 = casinoBet.hasOwnProperty("exp_amount17")
    ? casinoBet.exp_amount17
    : 0;
  this.exp_amount18 = casinoBet.hasOwnProperty("exp_amount18")
    ? casinoBet.exp_amount18
    : 0;
  this.exp_amount19 = casinoBet.hasOwnProperty("exp_amount19")
    ? casinoBet.exp_amount19
    : 0;
};

CasinoBetMaster.addCasinooBet = async function (casinoBet) {
  try {
    console.log("CB-->", casinoBet);
    dbConn.getConnection((err, conn) => {
      if (err) {
        throw err;
      }
      //insert into sessionbets
      conn.query("INSERT INTO casinobets set ?", casinoBet, (err, res) => {
        if (err) {
          return conn.rollback(() => {
            conn.release();
            throw err;
          });
        }

        //update the user balance
        conn.query(
          "UPDATE users SET balance = balance + ? WHERE id = ? ",
          [casinoBet.loss_amount, casinoBet.user_id],
          (err, res) => {
            if (err) {
              return conn.rollback(() => {
                conn.release();
                throw err;
              });
            }

            //insert exposure
            let newExp = {
              user_id: casinoBet.user_id,
              event_id: casinoBet.mid,
              runner_name: casinoBet.runner_name,
              main_type: casinoBet.game_name,
              type: casinoBet.type,
              price: casinoBet.odds,
              size: 0,
              deducted_amount: casinoBet.loss_amount,
              exp_amount: casinoBet.loss_amount,
            };
            const exposure = new Exposure(newExp);
            console.log("esp-->", exposure);
            conn.query("INSERT INTO exposures set ?", exposure, (err, res) => {
              if (err) {
                return conn.rollback(() => {
                  conn.release();
                  throw err;
                });
              }

              // commit the transaction if both queries were successful
              conn.query("COMMIT", (err) => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    throw err;
                  });
                }
                console.log("Transaction completed successfully.");
                conn.release();
              });
            });
          }
        );
      });
    });
    return "bet placed successfully";
  } catch (error) {
    console.error(error);
  }
};

CasinoBetMaster.getCasinoBetsByMarketId = async function (
  mid,
  user_id,
  game_name
) {
  try {
    let casinobets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from casinobets where game_name=? and mid = ? and user_id=? order by updated_at desc",
        [game_name, mid, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return casinobets;
  } catch (error) {
    console.log(error);
  }
};

CasinoBetMaster.getLiveResultByMarket = async function (mid) {
  try {
    let live_result = await axios.get(
      process.env.CASINO_URL + "3009/result/" + mid
    );
    console.log("LR-->>>", live_result);

    if (live_result.data.success) {
      return live_result.data;
    }
    // if (result.data.success) {
    //   let final_result = this.declareResult(result.data.data[0]);
    //   return final_result;
    // }
    let result = { success: false };
    return result;
  } catch (error) {
    console.log(error);
  }
};

CasinoBetMaster.declareResult = async function (result) {
  console.log(result);
  dbConn.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    //insert into result
    conn.query(
      "INSERT INTO casinoresults (mid,sid,win,result,description,gtype) values(?,?,?,?,?,?)",
      [
        result.mid,
        result.sid,
        result.win,
        result.cards,
        result.desc,
        result.gtype,
      ],
      (err, res) => {
        if (err) {
          return conn.rollback(() => {
            conn.release();
            throw err;
          });
        }
        //switch for each game
        switch (result.gtype) {
          case "teen20":
            qry_str1 =
              "update casinobets set is_win=?, status = ? where mid=? and sid=? and game_name=?";
            values1 = [1, 0, result.mid, result.win, result.gtype];
            qry_str2 =
              "update casinobets set is_win=?, status = ? where mid=? and sid != ? and game_name=?";
            values2 = [0, 0, result.mid, result.win, result.gtype];
            qry_str3 =
              "SELECT user_id,(ABS(loss_amount)+ABS(win_amount))as total_win,mid,runner_name,game_name FROM casinobets where mid=? and sid=? and game_name=?";
            values3 = [result.mid, result.win, result.gtype];
            qry_str4 =
              "SELECT user_id, loss_amount as loss_amount,mid,runner_name,game_name FROM casinobets where mid=? and sid != ? and game_name=?";
            values4 = [result.mid, result.win, result.gtype];
            break;
          case "lucky7":
            let desc_arr;
            if (result.desc.length > 0) {
              desc_arr = result.desc.split(" || ");
              desc_arr = desc_arr
                .map(function (substring) {
                  return "'" + substring.trim() + "'";
                })
                .join(",");
              desc_arr = "(" + desc_arr + ")";
            }
            // console.log("desc-arr-->", desc_arr);
            qry_str1 =
              "update casinobets set is_win=1, status = 0 where mid=" +
              result.mid +
              " and runner_name in " +
              desc_arr +
              " and game_name='" +
              result.gtype +
              "'";
            values1 = [];
            qry_str2 =
              "update casinobets set is_win=0, status = 0 where mid=" +
              result.mid +
              " and runner_name not in " +
              desc_arr +
              " and game_name='" +
              result.gtype +
              "'";
            values2 = [];
            qry_str3 =
              "SELECT user_id,(ABS(loss_amount)+ABS(win_amount))as total_win,mid,runner_name,game_name FROM casinobets where mid=" +
              result.mid +
              " and runner_name in " +
              desc_arr +
              " and game_name='" +
              result.gtype +
              "'";
            values3 = [];
            qry_str4 =
              "SELECT user_id, loss_amount as loss_amount,mid,runner_name,game_name FROM casinobets where mid=" +
              result.mid +
              " and runner_name not in " +
              desc_arr +
              " and game_name='" +
              result.gtype +
              "'";
            values4 = [];
            break;
          case "dt20":
            let desc_dt;
            if (result.desc.length > 0) {
              desc_dt = result.desc.split("*");
              desc_dt = desc_dt.map((data) => {
                return data.split("|");
              });
              for (i = 1; i <= 2; i++) {
                if (i == 1) {
                  desc_dt[i] = desc_dt[i].map((data) => {
                    return "Dragon " + data;
                  });
                } else if (i == 2) {
                  desc_dt[i] = desc_dt[i].map((data) => {
                    return "Tiger " + data;
                  });
                }
              }
              desc_dt = "('" + desc_dt.flat().join("','") + "')";
            }
            // console.log("dttt-->", desc_dt);
            // console.log("mid-->", result.mid);
            // console.log(
            //   "update casinobets set is_win=1, status = 0 where mid=" +
            //     result.mid +
            //     " and runner_name in " +
            //     desc_dt +
            //     " and game_name=" +
            //     String(result.gtype)
            // );
            qry_str1 =
              "update casinobets set is_win=1, status = 0 where mid=" +
              result.mid +
              " and runner_name in " +
              desc_dt +
              " and game_name='" +
              String(result.gtype) +
              "'";
            values1 = [];
            qry_str2 =
              "update casinobets set is_win=0, status = 0 where mid=" +
              result.mid +
              " and runner_name not in " +
              desc_dt +
              " and game_name='" +
              String(result.gtype) +
              "'";
            values2 = [];
            qry_str3 =
              "SELECT user_id,(ABS(loss_amount)+ABS(win_amount))as total_win,mid,runner_name,game_name FROM casinobets where mid=" +
              result.mid +
              " and runner_name in " +
              desc_dt +
              " and game_name='" +
              String(result.gtype) +
              "'";
            values3 = [];
            qry_str4 =
              "SELECT user_id, loss_amount as loss_amount,mid,runner_name,game_name FROM casinobets  where mid=" +
              result.mid +
              " and runner_name not in " +
              desc_dt +
              " and game_name='" +
              String(result.gtype) +
              "'";
            values4 = [];
            break;

          case "ab20":
            break;
          case "aaa":
            break;
          case "card32eu":
            break;
          case "card32":
            break;
        }
        //switch for each game

        // create an array of promises for each query
        final_promises = [
          new Promise((resolve, reject) => {
            conn.query(qry_str1, values1, (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          }),
          new Promise((resolve, reject) => {
            conn.query(qry_str2, values2, (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          }),
          new Promise((resolve, reject) => {
            conn.query(qry_str3, values3, (error, results) => {
              if (error) {
                reject(error);
              } else {
                const users = results.map((result) => {
                  return {
                    user_id: result.user_id,
                    total_win: result.total_win,
                    event_id: result.mid,
                    main_type: result.game_name,
                    runner_name: result.runner_name,
                  };
                });

                resolve(users);
              }
            });
          }),
          new Promise((resolve, reject) => {
            conn.query(qry_str4, values4, (error, results) => {
              if (error) {
                reject(error);
              } else {
                const losers = results.map((loser) => {
                  return {
                    user_id: loser.user_id,
                    loss_amount: loser.loss_amount,
                    event_id: loser.mid,
                    main_type: loser.game_name,
                    runner_name: loser.runner_name,
                  };
                });
                console.log("losss-->", losers);
                resolve(losers);
              }
            });
          }),
        ];

        // execute the promises in parallel using Promise.all()
        Promise.all(final_promises)
          .then((results) => {
            console.log("promise1 res-->", results[0]); // results of query1
            console.log("promise2 res-->", results[1]); // results of query2
            console.log("promise3 res-->", results[2]); // results of query3
            console.log("promise4 res-->", results[3]); // results of query4

            let winners = results[2];
            let losers = results[3];
            console.log("winners-->", winners);
            console.log("losers-->", losers);

            for (winner of winners) {
              console.log("each winner-->", winner);
              console.log("each winner win amt-->", winner.total_win);
              //update user balance
              conn.query(
                "update users set balance = balance + ? where id = ?",
                [Math.abs(winner.total_win), winner.user_id],
                (err, res) => {
                  if (err) {
                    return conn.rollback(() => {
                      conn.release();
                      throw err;
                    });
                  }
                }
              );
              //add winner
              let win_data = {
                user_id: winner.user_id,
                win_amount: Math.abs(winner.total_win),
                event_id: winner.event_id,
                main_type: winner.main_type,
                runner_name: winner.runner_name,
              };
              const new_winner = new Winner(win_data);
              Winner.create(new_winner, (err, winner) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("sucess--->");
                }
              });
            }

            // update ledger for losers
            for (loser of losers) {
              //add loser
              let loss_data = {
                user_id: loser.user_id,
                loss_amount: Math.abs(loser.loss_amount),
                event_id: loser.event_id,
                main_type: loser.main_type,
                runner_name: loser.runner_name,
              };
              const new_loser = new Loser(loss_data);
              console.log("loser-->", new_loser);
              Loser.create(new_loser, (err, loser) => {
                if (err) {
                  console.log(err);
                }
              });
            }

            //update exposures
            let exp_qry =
              "update exposures set exp_amount = 0, status=0 where event_id=? and main_type=?";
            exp_values = [result.mid, result.gtype];

            conn.query(exp_qry, exp_values, (err, res) => {
              if (err) {
                return conn.rollback(() => {
                  conn.release();
                  throw err;
                });
              }
              console.log(exp_qry);
              console.log(res);
              // commit the transaction if both queries were successful
              conn.query("COMMIT", (err) => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    throw err;
                  });
                }
                console.log("Transaction completed successfully.");
              });
            });

            conn.release();
          })
          .catch((error) => {
            return conn.rollback(() => {
              conn.release();
              throw error;
            });
          });
        // });
      }
    );
  });
  return "result declared successfully";
};

CasinoBetMaster.test = async function (p_mid) {
  console.log("called--->" + p_mid);
  let result_data = await axios.get(
    process.env.CASINO_URL + "3009/result/" + p_mid
  );
  while (result_data.data == "") {
    result_data = await axios.get(
      process.env.CASINO_URL + "3009/result/" + p_mid
    );
    console.log("ddd-->", result_data.data);
  }
  if (result_data.data.success) {
    console.log("gtype-->", result_data.data.data[0].gtype);
    this.declareResult(result_data.data.data[0]);
  }
};

const callAPI = async function (url) {
  let is_declared = false;
  let p_mid = 0;
  let is_set_pmid = false;
  while (true) {
    try {
      let result = await axios.get(url);
      let market = result.data;
      if (market != "") {
        // console.log("url-->" + url + "-->" + market.success);
        if (market.success) {
          // console.log("r-->", market.data.t1[0].hasOwnProperty("gtype"));
          // for non-gtype
          if (!market.data.t1[0].hasOwnProperty("gtype")) {
            // console.log("non");
            console.log(
              "fc",
              p_mid != market.data.t1[0].mid &&
                is_set_pmid == false &&
                is_declared == false
            );

            if (
              p_mid != market.data.t1[0].mid &&
              is_set_pmid == false &&
              is_declared == false
            ) {
              // console.log("in");
              p_mid = market.data.t1[0].mid;
              console.log("pmid-->", p_mid);
              is_set_pmid = true;
              is_declared = false;
            } else if (
              p_mid != market.data.t1[0].mid &&
              is_set_pmid == true &&
              is_declared == false
            ) {
              console.log("declare");
              CasinoBetMaster.test(p_mid);
              p_mid = market.data.t1[0].mid;
              console.log("pmid-->", p_mid);
              is_set_pmid = true;
              is_declared = false;
            }
          } else {
            //for gtype
            // console.log("yes");
            if (market.data.t1[0].mid != 0) {
              p_mid = market.data.t1[0].mid;
              is_declared = false;
              console.log("cmid-->" + p_mid);
            } else if (
              (market.data.t1[0].mid == 0 || market.data.t1[0].mid != p_mid) &&
              is_declared == false
            ) {
              is_declared = true;
              console.log("0000->");
              console.log(" previous-->" + p_mid);
              CasinoBetMaster.test(p_mid);
            }
          }
          //for gtype
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};

// Array of API URLs
const apiUrls = [
  // process.env.CASINO_URL + "3003/teenpatti/t20",
  // // process.env.CASINO_URL + "3002/ab",
  // // process.env.CASINO_URL + "3001/aaa/aaa",
  // process.env.CASINO_URL + "3005/lucky7/a",
  // // process.env.CASINO_URL + "3000/32card/b",
  // // process.env.CASINO_URL + "3000/32card/a",
  // process.env.CASINO_URL + "3004/dragontiger/t20",
];

// Function to call all APIs in parallel every second
const callAPIsInParallel = async () => {
  const promises = apiUrls.map((url) => callAPI(url));
  await Promise.all(promises);
};

// Start calling APIs
CasinoBetMaster.declareCasinoAllResult = async function () {
  callAPIsInParallel();
};

CasinoBetMaster.getDeclaredBetsByFilter = async function (
  game_name,
  user_id,
  f_date
) {
  try {
    let casinobets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from casinobets where game_name=? and user_id = ? and status = 0 and DATE(updated_at) = ? order by updated_at desc; ",
        [game_name, user_id, f_date],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return casinobets;
  } catch (error) {
    console.log(error);
  }
};

CasinoBetMaster.getCasinoResultsInDB = async function (game_name, f_date) {
  try {
    let casinobets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from casinoresults where gtype=? and DATE(updated_at) = ? order by updated_at desc; ",
        [game_name, f_date],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return casinobets;
  } catch (error) {
    console.log(error);
  }
};

module.exports = CasinoBetMaster;

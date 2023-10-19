var dbConn = require("./../../config/db");
const jwt = require("jsonwebtoken");
const db = require("./../../config/db");
require("dotenv").config();

var GiverMaster = function (giver) {
  this.giver_id = giver.giver_id;
  this.receiver_id = giver.receiver_id;
  this.amount = giver.amount;
  this.event_id = giver.event_id;
  this.main_type = giver.main_type;
  this.runner_name = giver.runner_name;
};

GiverMaster.create = function (new_giver, result) {
  dbConn.query("INSERT INTO givers set ?", new_giver, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

GiverMaster.addSubGivers = function (winner_data, result) {
  dbConn.query(
    "select creator_id from users where id = ?",
    winner_data.user_id,
    (err, res) => {
      console.log("ins elect");
      if (err) {
        console.log("err-->>", err);
        result(null, err);
      } else {
        let givers = res[0].creator_id.split(",");
        givers = givers.reverse();

        let main_giver = {
          giver_id: givers[0],
          receiver_id: winner_data.user_id,
          amount: winner_data.win_amount,
          event_id: winner_data.event_id,
          main_type: winner_data.main_type,
          runner_name: winner_data.runner_name,
        };
        const new_giver = new GiverMaster(main_giver);
        console.log("new giver-->", new_giver);
        GiverMaster.create(new_giver, (err, giver) => {
          if (err) {
            res.send(err);
          } else {
            const subledger = [];
            res.main_giver = giver;
            givers.forEach((receiver) => {
              console.log("giverid-->", receiver);
              console.log("res before------>", res);
              dbConn.query(
                "select user_share,creator_id from users where id = ?",
                receiver,
                (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    main_creator = data[0].creator_id.split(",").pop();
                    let share = 100 - data[0].user_share;
                    let final_amount = (winner_data.win_amount * share) / 100;
                    let main_giver = {
                      giver_id: main_creator,
                      receiver_id: receiver,
                      amount: final_amount,
                      event_id: winner_data.event_id,
                      main_type: winner_data.main_type,
                      runner_name: winner_data.runner_name,
                    };
                    const new_giver = new GiverMaster(main_giver);
                    console.log("new giver-->", new_giver);
                    GiverMaster.create(new_giver, (err, giver) => {
                      if (err) {
                        res.send(err);
                      } else {
                        subledger.push(main_giver);
                      }
                    });
                  }
                }
              );
            });
          }
          result(null, res);
        });
      }
    }
  );
};

GiverMaster.addSubLosers = function (loser_data, result) {
  dbConn.query(
    "select creator_id from users where id = ?",
    loser_data.user_id,
    (err, res) => {
      console.log("ins elect");
      if (err) {
        console.log("err-->>", err);
        result(null, err);
      } else {
        let givers = res[0].creator_id.split(",");
        givers = givers.reverse();

        let main_receiver = {
          receiver_id: givers[0],
          giver_id: loser_data.user_id,
          amount: loser_data.loss_amount,
          event_id: loser_data.event_id,
          main_type: loser_data.main_type,
          runner_name: loser_data.runner_name,
        };
        const new_receiver = new GiverMaster(main_receiver);
        console.log("new giver-->", new_receiver);
        GiverMaster.create(new_receiver, (err, receiver) => {
          if (err) {
            res.send(err);
          } else {
            const subledger = [];
            res.main_receiver = receiver;
            givers.forEach((giver) => {
              console.log("receiverrid-->", giver);
              console.log("res before------>", res);
              dbConn.query(
                "select creator_share,creator_id from users where id = ?",
                giver,
                (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    main_creator = data[0].creator_id.split(",").pop();
                    //    let share = (100 - data[0].user_share);
                    let final_amount =
                      (loser_data.loss_amount * data[0].creator_share) / 100;
                    let main_giver = {
                      giver_id: giver,
                      receiver_id: main_creator,
                      amount: final_amount,
                      event_id: loser_data.event_id,
                      main_type: loser_data.main_type,
                      runner_name: loser_data.runner_name,
                    };
                    const new_giver = new GiverMaster(main_giver);
                    console.log("new giver-->", new_giver);
                    GiverMaster.create(new_giver, (err, giver) => {
                      if (err) {
                        res.send(err);
                      } else {
                        subledger.push(main_giver);
                      }
                    });
                  }
                }
              );
            });
          }
          result(null, res);
        });
      }
    }
  );
};
GiverMaster.findGiverByRole = function (
  creator_id,
  role,
  type = "other",
  result
) {
  if (type == "self") {
    dbConn.query(
      "select g.role, amount, g.name as giver_name, r.name as recv_name from givers inner join users as g on giver_id = g.id INNER join users as r on receiver_id = r.id where giver_id = g.id and giver_id = ? ",
      creator_id,
      (err, res) => {
        if (err) {
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );
  } else {
    dbConn.query(
      "select g.role, amount, g.name as giver_name, r.name as recv_name from givers inner join users as g on giver_id = g.id INNER join users as r on receiver_id = r.id where giver_id = g.id and g.role = ? and FIND_IN_SET(?,g.creator_id)",
      [role, creator_id],
      (err, res) => {
        if (err) {
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );
  }
};

GiverMaster.findReceiverByRole = function (
  creator_id,
  role,
  type = "other",
  result
) {
  if (type == "self") {
    dbConn.query(
      "select amount, r.name as recv_name, g.name as giver_name from givers inner join users as r on receiver_id = r.id INNER join users as g on giver_id = g.id where receiver_id = r.id and receiver_id = ?",
      creator_id,
      (err, res) => {
        if (err) {
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );
  } else {
    dbConn.query(
      "select r.role, amount, r.name as recv_name, g.name as giver_name from givers inner join users as r on receiver_id = r.id INNER join users as g on giver_id = g.id where receiver_id = r.id and r.role = ? and FIND_IN_SET(?,r.creator_id)",
      [role, creator_id],
      (err, res) => {
        if (err) {
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );
  }
};

GiverMaster.getSelfGiversByEvent = async function (creator_id, event_id) {
  try {
    let self_givers = await new Promise((resolve, reject) => {
      dbConn.query(
        "select g.role, amount, g.name as giver_name, r.name as recv_name from givers inner join users as g on giver_id = g.id INNER join users as r on receiver_id = r.id where giver_id = g.id and giver_id = ? and givers.event_id = ?",
        [creator_id, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return self_givers;
  } catch (error) {}
};

GiverMaster.getSelfReceiversByEvent = async function (creator_id, event_id) {
  try {
    let self_receivers = await new Promise((resolve, reject) => {
      dbConn.query(
        "select amount, r.name as recv_name, g.name as giver_name from givers inner join users as r on receiver_id = r.id INNER join users as g on giver_id = g.id where receiver_id = r.id and receiver_id = ? and givers.event_id = ?",
        [creator_id, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return self_receivers;
  } catch (error) {}
};

module.exports = GiverMaster;

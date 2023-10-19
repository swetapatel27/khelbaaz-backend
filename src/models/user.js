var dbConn = require("./../../config/db");
var Fees = require("../models/fees");
const Fund = require("../models/fund");
const EventFees = require("../models/eventfees");
const jwt = require("jsonwebtoken");
const db = require("./../../config/db");
require("dotenv").config();

var UserMaster = function (user) {
  this.role = user.role;
  this.name = user.name;
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
  this.contact = user.contact;
  this.status = user.status;
  this.balance = user.balance;
  this.user_share = user.user_share;
  this.profit_share = user.profit_share;
  this.creator_share = user.creator_share;
  this.match_commission = user.match_commission;
  this.creator_id = user.creator_id;
  this.added_by = user.added_by;
};

UserMaster.selfDetails = function (id, result) {
  console.log("id-->", id);
  dbConn.query("select * from users where id = ?", id, function (err, res) {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
    } else {
      // console.log('users : ', res);
      result(null, res);
    }
  });
};

UserMaster.create = async function (newUser, result) {
  console.log("in model");
  console.log("newUser.role-->", newUser.role);

  let username = await new Promise((resolve, reject) => {
    dbConn.query(
      "select username from users where role = ? order by id desc limit 1",
      newUser.role,
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          // console.log(res);
          resolve(res[0]);
        }
      }
    );
  });
  var numb = parseInt(username["username"].replace(/[^0-9\.]/g, ""), 10);
  if (isNaN(numb)) {
    numb = 0;
  }
  console.log("numb--->", numb);
  let transfer_from_id = newUser.creator_id;
  let creator_ids = newUser.creator_id;
  let main_balance = newUser.balance;
  newUser.balance = 0;
  await dbConn.query(
    "select creator_id from users where id = ?",
    newUser.creator_id,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        if (res[0].creator_id.length == 0) {
          console.log("if");
          console.log(creator_ids);
          newUser.creator_id = creator_ids;
          // newUser.username = newUser.username + (numb + 1);
        } else {
          console.log("else");
          console.log(res[0].creator_id);
          creator_ids = (res[0].creator_id + "," + creator_ids).trim();
          newUser["creator_id"] = creator_ids;
          // newUser.username = newUser.username + (numb + 1);
          console.log(newUser.creator_id);
        }
        dbConn.query("INSERT INTO users set ?", newUser, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
          } else {
            console.log(res.insertId);
            result(null, res.insertId);
            let transfer_to_id = res.insertId;
            console.log(transfer_from_id);
            let data = {
              transfer_from_id: transfer_from_id,
              transfer_to_id: transfer_to_id,
              amount: main_balance,
            };
            this.fundTransfer(data, (err, resu) => {
              if (err) {
                res.send(err);
              } else {
                let new_fund = { ...data, transfer_by: transfer_from_id };
                Fund.create(new_fund, (err, result) => {
                  if (err) {
                    res.send(err);
                  } else {
                    console.log("result-->", result);
                    // result.json({
                    //   error: false,
                    //   message: "funds added into fundmaster successfully!",
                    //   data: result,
                    // });
                  }
                });
              }
            });
          }
        });
      }
    }
  );
  return "User added successfully..!!";
};

UserMaster.update = function (id, user, result) {
  dbConn.query(
    "UPDATE users SET role=?,name=?,username=?,contact=?,status=?,balance=?,user_share=?,profit_share=?,creator_share=?,match_commission=?,creator_id=? WHERE id = ?",
    [
      user.role,
      user.name,
      user.username,
      user.contact,
      user.status,
      user.balance,
      user.user_share,
      user.profit_share,
      user.creator_share,
      user.match_commission,
      user.creator_id,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

// UserMaster.logIn = function (user, result) {
//   console.log("user login model");
//   dbConn.query(
//     "select * from users where username=? and password = ?",
//     [user.username, user.password],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         return result(null, err);
//       } else {
//         if (!res.length) {
//           // console.log(res);
//           // err['msg']="'username or password is incorrect!'";
//           result(null, res);
//         } else {
//           const token = jwt.sign(
//             { user: res[0], date: Date.now() },
//             process.env.SECRET_KEY,
//             {
//               expiresIn: "7d",
//             }
//           );
//           const role = res[0].role;
//           const userId = res[0].id;
//           const username = res[0].username;
//           console.log("model token---->", token);
//           const user_details = res[0];
//           dbConn.query(
//             `UPDATE users SET token=?, last_login = now() WHERE id = '${res[0].id}'`,
//             token,
//             (err, res) => {
//               if (err) {
//                 console.log("error: ", err);
//                 return result(null, err);
//               } else {
//                 res["token"] = token;
//                 res["userId"] = userId;
//                 res["username"] = username;
//                 res["role"] = role;
//                 res["user_details"] = user_details;
//                 return result(null, res);
//               }
//             }
//           );
//         }
//       }
//     }
//   );
// };

UserMaster.logIn = async function (user, result) {
  console.log("user login model");

  let res = await new Promise((resolve, reject) => {
    dbConn.query(
      "select * from users where username=? and password = ?",
      [user.username, user.password],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (!res.length) {
            // console.log(res);
            // err['msg']="'username or password is incorrect!'";
            result(null, res);
          } else {
            resolve(res);
          }
        }
      }
    );
  });

  let data = await new Promise((resolve, reject) => {
    const token = jwt.sign(
      {
        user: { id: res[0].id, username: res[0].username, role: res[0].role },
        date: Date.now(),
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    const role = res[0].role;
    const userId = res[0].id;
    const username = res[0].username;
    console.log("model token---->", token);
    const user_details = res[0];
    dbConn.query(
      `UPDATE users SET token=?, last_login = now() WHERE id = '${res[0].id}'`,
      token,
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          res["token"] = token;
          res["userId"] = userId;
          res["username"] = username;
          res["role"] = role;
          res["user_details"] = user_details;
          resolve(res);
        }
      }
    );
  });
  return result(null, data);
};

//admin login
UserMaster.AdminlogIn = async function (user, result) {
  console.log("admin login model");

  let res = await new Promise((resolve, reject) => {
    dbConn.query(
      "select * from users where username=? and password = ?",
      [user.username, user.password],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (!res.length) {
            // console.log(res);
            // err['msg']="'username or password is incorrect!'";
            result(null, res);
          } else {
            if (res[0].role < 5) {
              resolve(res);
            } else {
              return result(null, { error: "Admins not allowed" });
            }
          }
        }
      }
    );
  });

  let data = await new Promise((resolve, reject) => {
    const token = jwt.sign(
      {
        user: { id: res[0].id, username: res[0].username, role: res[0].role },
        date: Date.now(),
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    const role = res[0].role;
    const userId = res[0].id;
    const username = res[0].username;
    console.log("model token---->", token);
    const user_details = res[0];
    dbConn.query(
      `UPDATE users SET token=?, last_login = now() WHERE id = '${res[0].id}'`,
      token,
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          res["token"] = token;
          res["userId"] = userId;
          res["username"] = username;
          res["role"] = role;
          res["user_details"] = user_details;
          resolve(res);
        }
      }
    );
  });
  return result(null, data);
};

UserMaster.fundTransfer = function (req, result) {
  transferFrom = req.transfer_from_id;
  transferTo = req.transfer_to_id;
  var mainBalance = req.amount;
  const current_time = new Date();
  const tmsg = "testlognavneet";
  console.log({tmsg,transferFrom,transferTo,mainBalance,current_time});

  dbConn.query(
    `select balance from users where id =${transferTo}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        _balance = res[0].balance;
        updatedBalance = parseInt(_balance) + parseInt(mainBalance);

        dbConn.query(
          `UPDATE users SET balance = ${updatedBalance} where id = ${transferTo}`,
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(null, err);
            } else {
              dbConn.query(
                `select balance from users where id= ${transferFrom}`,
                (err, res) => {
                  if (err) {
                    console.log("error: ", err);
                    result(null, err);
                  } else {
                    __balance = res[0].balance;
                    reductedBalance = __balance - mainBalance;

                    dbConn.query(
                      `update users SET balance = ${reductedBalance} where id = ${transferFrom}`,
                      (err, res) => {
                        if (err) {
                          console.log("error: ", err);
                          result(null, err);
                        } else {
                          result(null, res);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

//find all the creators of any particular admin
UserMaster.findAllCreators = function (creator_id, role, result) {
  console.log(creator_id);
  console.log(role);

  dbConn.query(
    "SELECT * FROM users WHERE FIND_IN_SET(?, creator_id) and role = ?",
    [creator_id, role],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        console.log(res);
        result(null, res);
      }
    }
  );
};

UserMaster.getBalanceById = function (user_id, result) {
  dbConn.query(
    "select balance,casino_balance,casino_active from users where id = ?",
    user_id,
    function (err, res) {
      if (err) {
        // console.log("error: ", err);
        result(null, err);
      } else {
        // console.log('users : ', res);
        result(null, res);
      }
    }
  );
};

UserMaster.getBalById = async function (user_id) {
  try {
    let user = await new Promise((resolve, reject) => {
      dbConn.query(
        "select balance,exposure_limit from users where id = ?",
        user_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.getUserByUsername = async function (username) {
  try {
    let user = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from users where username = ?",
        username,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.updateLastActivity = async function (user_id) {
  try {
    let last_activity = await new Promise((resolve, reject) => {
      dbConn.query(
        "update users set last_activity = now() where id = ?",
        [user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return last_activity;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.getActiveUsers = async function (creator_id) {
  try {
    let active_users = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT * FROM users WHERE last_activity >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MINUTE) and FIND_IN_SET(?, creator_id) ;",
        [creator_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return active_users;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.getMyUsers = async function (creator_id) {
  try {
    let active_users = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT users.*, COALESCE(SUM(exposures.exp_amount), 0) AS sum_exp_amount FROM users LEFT JOIN exposures ON users.id = exposures.user_id GROUP BY users.id, users.balance HAVING FIND_IN_SET(?, creator_id) order by role",
        [creator_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return active_users;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.getMyAgents = async function (creator_id) {
  try {
    let agents = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role != 5 order by role",
        [creator_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return agents;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.changePassword = async function (
  user_id,
  old_password,
  new_password
) {
  try {
    let users = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from users where id =? and password = ?",
        [user_id, old_password],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    if (users.length <= 0) {
      return { error: "You have entered wrong password" };
    } else {
      let password_changed = await new Promise((resolve, reject) => {
        dbConn.query(
          "update users set password = ? where id = ? and password=?",
          [new_password, user_id, old_password],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
      return password_changed;
    }
  } catch (error) {
    console.log(error);
  }
};
UserMaster.changeexposureLimit = async function (user_id, exposure_limit) {
  try {
    let qry="update users set exposure_limit = ? where id = ?";
    let password_changed = await new Promise((resolve, reject) => {
      dbConn.query(
        qry,
        [exposure_limit, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return password_changed;
  } catch (error) {
    console.log(error);
  }
}

//change password only by arjun admin
UserMaster.passwordChange = async function (user_id, new_password, is_logout=false) {
  try {
    let qry="update users set password = ?,password_version=password_version+1 where id = ?";
    if(is_logout){
      qry="update users set token=null, password = ? where id = ?";
    }
    let password_changed = await new Promise((resolve, reject) => {
      dbConn.query(
        qry,
        [new_password, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return password_changed;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.deductBalance = async function (
  user_id,
  event_id,
  event_name,
  event_type
) {
  try {
    let fees = await Fees.getFees();
    let balance_deducted = await new Promise((resolve, reject) => {
      dbConn.query(
        "update users set balance = balance - ? where id = ?",
        [fees.fees, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            let event_fees = {
              user_id: user_id,
              event_id: event_id,
              event_name: event_name,
              type: event_type,
              amount: fees.fees,
            };
            let result = EventFees.addEventFees(event_fees);
            resolve(result);
          }
        }
      );
    });
    return balance_deducted;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.getUsersAddedByMe = async function (user_id) {
  try {
    let users = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from users where added_by = ?",
        [user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return users;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.activateUser = async function (user_id, type) {
  try {
    let user = await new Promise((resolve, reject) => {
      if (type == 1) {
        qry = "update users set status = 1 where id = ?";
      }
      if (type == 0) {
        qry = "update users set status = 0 where id = ?";
      }
      dbConn.query(qry, [user_id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.deleteUser = async function (user_id) {
  try {
    let inserted_user = await new Promise((resolve, reject) => {
      qry =
        "INSERT INTO deletedusers(user_id,role,name,username,password,contact,email,status,balance,user_share,profit_share,creator_share,match_commission,creator_id,referer_name,added_by,created_at,last_login,last_activity,token) SELECT * FROM users WHERE id = ?;";
      dbConn.query(qry, [user_id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    if (inserted_user.affectedRows > 0) {
      let deleted_user = await new Promise((resolve, reject) => {
        qry = "delete FROM users WHERE id = ?;";
        dbConn.query(qry, [user_id], (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
      return deleted_user;
    }
  } catch (error) {
    console.log(error);
  }
};

UserMaster.addUPI = async function (data,fileUrl) {
  try {
    console.log("body", data);
    let admin = await new Promise((resolve, reject) => {
      dbConn.query("select * from users where id = ?", data.id, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[0]);
        }
      });
    });
    if (admin.role == 0) {
      let upi_data = { 
        type: "admin",
        gpay: data.gpay ?? null,
        paytm: data.paytm ?? null,
        phonepe: data.phonepe ?? null,
        account_id: data.account_id ?? null,
        ifsc_code: data.ifsc_code ?? null,
        bank_name: data.bank_name ?? null,
        branch: data.branch ?? null
      };
      if(fileUrl!="noupdate"){
        upi_data.qrcode = fileUrl;
      }
      let result = await new Promise((resolve, reject) => {
        dbConn.query("UPDATE upis set ? WHERE id = 1", [upi_data], (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
      return result;
    } else {
      return { error: "Access denied..!!" };
    }
  } catch (error) {
    console.log(error);
  }
};

UserMaster.getUPI = async function (data) {
  try {
    let upi_data = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from upis order by id desc limit 1",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return upi_data;
  } catch (error) {
    console.log(error);
  }
};

UserMaster.updateMainBalance = async function (user_id,amount) {
  try {
    let upi_data = await new Promise((resolve, reject) => {
      dbConn.query(
        "UPDATE users SET balance=balance + ? WHERE id = ?",
        [amount,user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return upi_data;
  } catch (error) {
    console.log(error);
  }
}

UserMaster.updateCasinoBalance = async function (user_id,amount) {
  try {
    let upi_data = await new Promise((resolve, reject) => {
      dbConn.query(
        //"UPDATE users SET casino_balance=casino_balance + ? WHERE id = ?",
        "UPDATE users SET balance=balance + ? WHERE id = ?",
        [amount,user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return upi_data;
  } catch (error) {
    console.log(error);
  }
}
UserMaster.updateCasinoAndMainBalance = async function (user_id,amount,casino_points,type) {
  try {
    if(type=="deposit"){
      var sqlquery = "UPDATE users SET balance=balance - ?, casino_balance=casino_balance + ? WHERE id = ?";
    }else{
      var sqlquery = "UPDATE users SET balance=balance + ?, casino_balance=casino_balance - ? WHERE id = ?";
    }
    let upi_data = await new Promise((resolve, reject) => {
      dbConn.query(
        sqlquery,
        [amount,casino_points,user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return upi_data;
  } catch (error) {
    console.log(error);
  }
}

UserMaster.getCasinoBalance = async function (username) {
  try {
    let upi_data = await new Promise((resolve, reject) => {
      dbConn.query(
        // "SELECT id,casino_balance FROM users WHERE username = ?",
        "SELECT id,balance FROM users WHERE username = ?",
        [username],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    return upi_data;
  } catch (error) {
    console.log(error);
  }
}

UserMaster.casinoAccountActivation = async function (user_id) {
  try {
    let updatedUser = await new Promise((resolve, reject) => {
      dbConn.query(
        "UPDATE users SET casino_active='1' WHERE id = ?",
        [user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            // After the update, fetch the updated user data
            dbConn.query(
              "SELECT username FROM users WHERE id = ?",
              [user_id],
              (err, user) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(user[0]);
                }
              }
            );
          }
        }
      );
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to propagate it further if needed
  }
}

module.exports = UserMaster;

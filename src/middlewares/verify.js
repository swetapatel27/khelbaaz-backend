const jwt = require("jsonwebtoken");
require("dotenv").config();
var dbConn = require("./../../config/db");

exports.isLoggedIn = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const header_password_version = req.headers.password_version;
    let stored_token = "";
    let stored_password_version = "";
    // console.log("token from header-->", token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = decoded;
    if (req.userData.user.role == 5) {
      stored_token = await new Promise((resolve, reject) => {
        dbConn.query(
          "select token from users where id = ?",
          req.userData.user.id,
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              // console.log("from db-->", res[0].token);
              resolve(res[0].token);
            }
          }
        );
      });
    }
    if (req.userData.user.role == 0) {
      stored_password_version = await new Promise((resolve, reject) => {
        dbConn.query(
          "select password_version from users where id = ?",
          req.userData.user.id,
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              // console.log("from db-->", res[0].token);
              resolve(res[0].password_version);
            }
          }
        );
      });
    }

    // console.log("correctnesss------>", stored_token == token);
    // console.log("user data-->", req.userData.user.status);
    let allow = await new Promise((resolve, reject) => {
      dbConn.query(
        "select status from users where id = ?",
        req.userData.user.id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            // console.log(res);
            resolve(res[0].status);
          }
        }
      );
    });

    if (req.userData.user.role == 5) {
      if (stored_token !== token) {
        return res.status(401).send({
          msg: "Your session is not valid!",
        });
      }
    } else if (req.userData.user.role == 0) {
      // console.log(
      //   stored_password_version + "---" + Number(header_password_version)
      // );
      // console.log(
      //   typeof stored_password_version + "---" + typeof header_password_version
      // );
      if (stored_password_version !== Number(header_password_version)) {
        return res.status(401).send({
          msg: "Your session is not valid!",
        });
      }
    } else {
      if (!allow) {
        return res.status(401).send({
          msg: "Access denied!",
        });
      }
    }
    next();
  } catch (err) {
    return res.status(401).send({
      msg: "Your session is not valid!",
    });
  }
};

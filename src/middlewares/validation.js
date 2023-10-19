const { check, validationResult } = require("express-validator");
const Exposure = require("../models/exposure");
var dbConn = require("./../../config/db");

const userValidationRules = () => {
  return [
    check("role", "Role is required").not().isEmpty().bail(),
    check("role", "role must be numeric").isNumeric(),
    check("role", "You cannot create a higher order role.").custom(
      (roleVal, { req }) => {
        return new Promise((resolve, reject) => {
          const creator_id = req.body.creator_id;
          dbConn.query(
            `select role from users where id= ${creator_id}`,
            (err, res) => {
              if (err) {
                reject(new Error("Server Error"));
              } else {
                if (res.length > 0) {
                  jsonData = JSON.stringify(res);
                  roleParsed = JSON.parse(jsonData);
                  role = roleParsed[0].role;
                  console.log("creatorID", creator_id);
                  console.log("role", role);
                  console.log("roleval", roleVal);
                  if (role > roleVal || roleVal > 5) {
                    console.log(role > roleVal || roleVal > 5);
                    reject(new Error(`You cannot create a higher order role.`));
                  }
                }
                resolve(true);
              }
            }
          );
        });
      }
    ),
    check("name", "Name is requied").not().isEmpty(),
    check("username", "Username is requied").not().isEmpty(),
    check("username", "Username must be unique").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        dbConn.query(
          "select username from users where username = ?",
          value,
          (err, res) => {
            if (err) {
              reject(new Error("Server Error"));
            } else {
              if (res.length > 0) {
                reject(new Error("Username already exists"));
              } else {
                resolve(true);
              }
            }
          }
        );
      });
    }),
    // check("email", "Please include a valid email")
    //   .isEmail()
    //   .normalizeEmail({ gmail_remove_dots: true }),
    check("password", "Password is required").not().isEmpty(),
    check("contact", "contact must be valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    // check('status','Status is required').not().isEmpty(),
    check("status", "status must be numeric").isNumeric(),
    // check('balance','Balance is required').not().isEmpty().bail(),
    check("balance", "Balance must be numeric")
      .default(0)
      .optional()
      .isNumeric(),
    // check('user_share','User Share is required').not().isEmpty().bail(),
    check("user_share", "User Share must be numeric")
      .isNumeric()
      .optional({ nullable: true, checkFalsy: true })
      .bail(),
    check("user_share")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          creator_id = req.body.creator_id;
          dbConn.query(
            `select user_share from users where id= ${creator_id}`,
            (err, res) => {
              if (err) {
                reject(new Error("Server Error"));
              } else {
                if (res.length > 0) {
                  jsonData = JSON.stringify(res);
                  uSharedParsed = JSON.parse(jsonData);
                  ushare = uSharedParsed[0].user_share;
                  if (value > ushare) {
                    reject(
                      new Error(`User Share cannot be greater than ${ushare}`)
                    );
                  }
                }
              }
              resolve(true);
            }
          );
        });
      })
      .bail(),
    // check('creator_share','Creator Share is required').not().isEmpty().bail(),
    check("creator_share", "Creator Share must be numeric")
      .isNumeric()
      .optional({ nullable: true, checkFalsy: true }),
    check("creator_share")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          user_share = req.body.user_share;
          creator_id = req.body.creator_id;
          dbConn.query(
            `select user_share from users where id= ${creator_id}`,
            (err, res) => {
              if (err) {
                reject(new Error("Server Error"));
              } else {
                if (res.length > 0) {
                  jsonData = JSON.stringify(res);
                  uSharedParsed = JSON.parse(jsonData);
                  _ushare = uSharedParsed[0].user_share;
                  console.log("to be shared", _ushare);

                  sumShare = parseInt(value) + parseInt(user_share);
                  console.log("cshare", value);
                  console.log("ushare", user_share);
                  console.log("sum", sumShare);

                  if (sumShare > _ushare) {
                    reject(
                      new Error(
                        `Total distribution of share must be less than or equal to ${_ushare}`
                      )
                    );
                  }
                }
              }
              resolve(true);
            }
          );
        });
      })
      .optional({ nullable: true, checkFalsy: true }),
    // check('match_commission','Match Commission is required').not().isEmpty().bail(),
    check("match_commission", "Match Commission must be numeric")
      .isNumeric()
      .optional({ nullable: true, checkFalsy: true }),
    // check('creator_id','Match creatorID must be numeric').isNumeric().bail(),
    check("creator_id", "Creator is required").not().isEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

const updateUserValidationRules = () => {
  return [
    check("role", "Role is required").not().isEmpty().bail(),
    check("role", "role must be numeric").isNumeric(),
    check("username", "Username must be unique").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        dbConn.query(
          "select username from users where username = ?",
          value,
          (err, res) => {
            if (err) {
              reject(new Error("Server Error"));
            } else {
              if (res.length > 0) {
                reject(new Error("Username already exists"));
              } else {
                resolve(true);
              }
            }
          }
        );
      });
    }),
    // check('role',"You cannot create a higher order role.").custom((roleVal,{req})=>{

    //     return new Promise((resolve, reject)=> {
    //         const creator_id = req.body.creator_id;
    //         dbConn.query(`select role from users where id= ${creator_id}`,(err,res)=>{
    //             if(err) {
    //                 reject(new Error('Server Error'))
    //               }
    //               else{
    //                 if(res.length > 0) {
    //                     jsonData = JSON.stringify(res);
    //                     roleParsed = JSON.parse(jsonData);
    //                     role = roleParsed[0].role;
    //                     console.log("creatorID",creator_id);
    //                     console.log("role",role);
    //                      console.log("roleval",roleVal);
    //                     if(role > roleVal || roleVal >= 5){
    //                         console.log(role>roleVal || roleVal >=5)
    //                         reject(new Error(`You cannot create a higher order role.`))
    //                     }
    //                   }
    //                   resolve(true);
    //               }

    //         })
    // });

    // }),
    check("name", "Name is requied").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    // check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check("password", "Password is required").not().isEmpty(),
    check("contact", "contact must be valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    // check('status','Status is required').not().isEmpty(),
    check("status", "status must be numeric").isNumeric(),
    // check('balance','Balance is required').not().isEmpty().bail(),
    check("balance", "Balance must be numeric")
      .default(0)
      .optional()
      .isNumeric(),
    // check('user_share','User Share is required').not().isEmpty().bail(),
    check("user_share", "User Share must be numeric")
      .isNumeric()
      .optional({ nullable: true, checkFalsy: true })
      .bail(),
    check("user_share")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          creator_id = req.body.creator_id;
          creator_id = creator_id.split(",").pop();
          dbConn.query(
            `select user_share from users where id= ${creator_id}`,
            (err, res) => {
              if (err) {
                reject(new Error("Server Error"));
              } else {
                if (res.length > 0) {
                  jsonData = JSON.stringify(res);
                  uSharedParsed = JSON.parse(jsonData);
                  ushare = uSharedParsed[0].user_share;
                  if (value > ushare) {
                    reject(
                      new Error(`User Share cannot be greater than ${ushare}`)
                    );
                  }
                }
              }
              resolve(true);
            }
          );
        });
      })
      .bail(),
    // check('creator_share','Creator Share is required').not().isEmpty().bail(),
    check("creator_share", "Creator Share must be numeric")
      .isNumeric()
      .optional({ nullable: true, checkFalsy: true }),
    check("creator_share")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          user_share = req.body.user_share;
          creator_id = req.body.creator_id;
          creator_id = creator_id.split(",").pop();
          dbConn.query(
            `select user_share from users where id= ${creator_id}`,
            (err, res) => {
              if (err) {
                reject(new Error("Server Error"));
              } else {
                if (res.length > 0) {
                  jsonData = JSON.stringify(res);
                  uSharedParsed = JSON.parse(jsonData);
                  _ushare = uSharedParsed[0].user_share;
                  console.log("to be shared", _ushare);

                  sumShare = parseInt(value) + parseInt(user_share);
                  console.log("cshare", value);
                  console.log("ushare", user_share);
                  console.log("sum", sumShare);

                  if (sumShare > _ushare) {
                    reject(
                      new Error(
                        `Total distribution of share must be less than or equal to ${_ushare}`
                      )
                    );
                  }
                }
              }
              resolve(true);
            }
          );
        });
      })
      .optional({ nullable: true, checkFalsy: true }),
    // check('match_commission','Match Commission is required').not().isEmpty().bail(),
    check("match_commission", "Match Commission must be numeric")
      .isNumeric()
      .optional({ nullable: true, checkFalsy: true }),
    // check('creator_id','Match creatorID must be numeric').isNumeric().bail(),
    check("creator_id", "Creator is required").not().isEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

const logInValidationRules = () => {
  console.log("valid rules");
  return [
    check("username", "Username is requied").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("username", "You are blocked.").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        dbConn.query(
          "select role,status from users where username = ?",
          value,
          (err, res) => {
            if (err) {
              reject(new Error("Server Error"));
            } else {
              if (res.length > 0) {
                if (res[0].status == 0) {
                  reject(
                    new Error("You are blocked. Please contact your admin.")
                  );
                } else if (res[0].role != 5) {
                  reject(new Error("Only customers are allowed to login."));
                } else {
                  resolve(true);
                }
              } else {
                resolve(true);
              }
            }
          }
        );
      });
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

const AdminLogInValidationRules = () => {
  return [
    check("username", "Username is requied").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("username", "You are blocked.").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        dbConn.query(
          "select role,status from users where username = ?",
          value,
          (err, res) => {
            if (err) {
              reject(new Error("Server Error"));
            } else {
              if (res.length > 0) {
                if (res[0].status == 0) {
                  reject(
                    new Error("You are blocked. Please contact your admin.")
                  );
                } else if (res[0].role >= 5) {
                  reject(new Error("Customers are not allowed to login"));
                } else {
                  resolve(true);
                }
              } else {
                resolve(true);
              }
            }
          }
        );
      });
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

const registerValidationRules = () => {
  return [
    check("name", "name is requied").not().isEmpty(),
    check("username", "Username is requied").not().isEmpty(),
    check("username", "Username must be unique").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        dbConn.query(
          "select username from users where username = ?",
          value,
          (err, res) => {
            if (err) {
              reject(new Error("Server Error"));
            } else {
              if (res.length > 0) {
                reject(new Error("Username already exists"));
              } else {
                resolve(true);
              }
            }
          }
        );
      });
    }),
    check("password", "Password is required").not().isEmpty(),
    //check("email", "email is required").not().isEmpty(),
    //check("email", "enter proper email address").isEmail(),
    check("contact", "contact is required").not().isEmpty(),
    check("contact", "contact must be valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

//for arjun client to be created by only agents.
const ClientValidationRules = () => {
  return [
    check("name", "name is requied").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    check("username", "Username must be unique").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        dbConn.query(
          "select username from users where username = ?",
          value,
          (err, res) => {
            if (err) {
              reject(new Error("Server Error"));
            } else {
              if (res.length > 0) {
                reject(new Error("Username already exists"));
              } else {
                resolve(true);
              }
            }
          }
        );
      });
    }),
    check("password", "Password is required").not().isEmpty(),
    check("balance", "Balance is required").not().isEmpty().bail(),
    check("balance", "Balance must be numeric").isNumeric(),
    // check("email", "email is required").not().isEmpty(),
    // check("email", "enter proper email address").isEmail(),
    // check("contact", "contact is required").not().isEmpty(),
    // check("contact", "contact must be valid mobile number").isLength({
    //   min: 10,
    //   max: 10,
    // }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};
const ClientValidationUpdationRules = () => {
  return [
    check("name", "name is requied").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    check("balance", "Balance is required").not().isEmpty().bail(),
    check("balance", "Balance must be numeric").isNumeric(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

const fundTransferValidateRules = () => {
  return [
    check("transfer_from_id", "transfer_from_id is required")
      .not()
      .isEmpty()
      .bail(),
    check("transfer_from_id", "transfer_from_id must be numeric").isNumeric(),
    check("transfer_to_id", "transfer_to_id is required")
      .not()
      .isEmpty()
      .bail(),
    check("transfer_to_id", "transfer_to_id  must be numeric").isNumeric(),
    check("amount", "amount is required").not().isEmpty().bail(),
    check("amount", "amount must be numeric").isNumeric(),
    check("amount")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          transfer_from_id = req.body.transfer_from_id;
          dbConn.query(
            `select role,balance from users where id= ${transfer_from_id}`,
            (err, res) => {
              if (err) {
                reject(new Error("Server Error"));
              } else {
                if (res.length > 0) {
                  if (res[0].role < 5) {
                    jsonData = JSON.stringify(res);
                    balanceParsed = JSON.parse(jsonData);
                    balance = balanceParsed[0].balance;

                    if (value > balance) {
                      reject(
                        new Error(`Amount cannot be greater than ${balance}`)
                      );
                    } else {
                      resolve(true);
                    }
                  } else if (res[0].role == 5) {
                    jsonData = JSON.stringify(res);
                    balanceParsed = JSON.parse(jsonData);
                    balance = balanceParsed[0].balance;
                    Exposure.getExposureByUserId(transfer_from_id).then(
                      (result) => {
                        let exp = result[0].exp_amount;
                        // console.log("exp 524------->", result[0].exp_amount);
                        // console.log("balance------->", balance);
                        // console.log("value------->", value);
                        // console.log("value------->", balance + exp);

                        if (value > balance + exp) {
                          reject(
                            new Error(
                              `Amount cannot be greater than ${balance + exp}`
                            )
                          );
                        } else {
                          resolve(true);
                        }
                      }
                    );
                  }
                }
              }
            }
          );
        });
      })
      .bail(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

const validateWithdroValidateRules = () => {
  return [
    check("user_id")
      .trim()
      .not()
      .isEmpty()
      .withMessage("User name can not be empty!")
      .bail(),
    check("amount")
      .trim()
      .not()
      .isEmpty()
      .withMessage("invalid amount!")
      .bail()
      .isInt({ min: 1, max: 50000 })
      .withMessage("Maximun amount 50K!")
      .bail(),
    check("txn_type").not().isEmpty().withMessage("txn_type is required!"),
    check("txn_type").custom((value, { req }) => {
      if (value == "upi") {
        if (!req.body.upi) {
          throw new Error("Upi is required");
        }
      } else {
        if (!req.body.account_id) {
          throw new Error("account_id is required");
        } else if (!req.body.ifsc_code) {
          throw new Error("ifsc_code is required");
        } else if (!req.body.bank_name) {
          throw new Error("bank_name is required");
        } else if (!req.body.branch) {
          throw new Error("branch is required");
        }
      }
      return true;
    }),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(400).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

const validateDepositValidateRules = () => {
  return [
    check("user_id")
      .trim()
      .not()
      .isEmpty()
      .withMessage("User name can not be empty!")
      .bail(),
    check("amount")
      .trim()
      .not()
      .isEmpty()
      .withMessage("invalid amount!")
      .bail()
      .bail(),
    check("method").not().isEmpty().withMessage("method is required!"),
    check("transaction_id").not().isEmpty().withMessage("transaction_id is required!"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
          errors: extractedErrors,
        });
      } else {
        next();
      }
    },
  ];
};

// const validate = (req, res, next) => {
//     const errors = validationResult(req)
//     if (errors.isEmpty()) {
//       return next()
//     }
//     const extractedErrors = []
//     errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

//     return res.status(422).json({
//       errors: extractedErrors,
//     })
// }

module.exports = {
  userValidationRules,
  updateUserValidationRules,
  logInValidationRules,
  fundTransferValidateRules,
  registerValidationRules,
  ClientValidationRules,
  ClientValidationUpdationRules,
  AdminLogInValidationRules,
  validateWithdroValidateRules,
  validateDepositValidateRules,
  // validate,
};

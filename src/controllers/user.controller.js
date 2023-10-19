const UserMaster = require("./../models/user");
const User = require("./../models/user");

exports.selfDetails = function (req, res) {
  User.selfDetails(req.userData.user["id"], (err, user) => {
    console.log("in controller");
    if (err) {
      res.send(err);
    } else {
      // console.log('res',user);
      res.send(user);
    }
  });
};

exports.findAllCreators = function (req, res) {
  User.findAllCreators(req.params.creator_id, req.params.role, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      console.log("res", users);
      res.send(users);
    }
  });
};

exports.create = function (req, res) {
  const new_user = new User(req.body);

  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    User.create(new_user, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          error: false,
          message: "User added successfully!",
          data: user,
        });
      }
    });
  }
};

exports.update = function (req, res) {
  console.log("from cont", req.body);

  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    User.update(req.params.id, new User(req.body), (err, user) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          error: false,
          message: "User updated successfully!",
          data: user,
        });
      }
    });
  }
};

exports.login = function (req, res) {
  console.log("controller");
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    User.logIn(new User(req.body), (err, user) => {
      if (err) {
        res.send(err);
      } else {
        if (user.length === 0) {
          res.json({
            error: true,
            message: "username or password is incorrect!!",
          });
        } else {
          res.json({
            error: false,
            message: "User loggedIn successfully!",
            data: user,
          });
        }
      }
    });
  }
};

exports.AdminLogin = function (req, res) {
  console.log("controller");
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    User.AdminlogIn(new User(req.body), (err, user) => {
      if (err) {
        res.send(err);
      } else {
        if (user.length === 0) {
          res.json({
            error: true,
            message: "username or password is incorrect!!",
          });
        } else {
          res.json({
            error: false,
            message: "Admin loggedIn successfully!",
            data: user,
          });
        }
      }
    });
  }
};

exports.getBalanceById = function (req, res) {
  User.getBalanceById(req.params.user_id, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      console.log("res", users);
      res.send(users[0]);
    }
  });
};

exports.getUserByUsername = async function (req, res) {
  try {
    const username = req.params.username;
    const data = await User.getUserByUsername(username);
    if (data.length != 0) res.send(data);
    else {
      res.send({ error: "User does not exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.updateLastActivity = async function (req, res) {
  try {
    const user_id = req.body.user_id;
    const last_activity = await UserMaster.updateLastActivity(user_id);
    res.send(last_activity);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getActiveUsers = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const active_users = await UserMaster.getActiveUsers(creator_id);
    res.send(active_users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getMyUsers = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const my_users = await UserMaster.getMyUsers(creator_id);
    res.send(my_users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getMyAgents = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const my_agents = await UserMaster.getMyAgents(creator_id);
    res.send(my_agents);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.changePassword = async function (req, res) {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const user_id = req.body.user_id;
      const old_password = req.body.old_password;
      const new_password = req.body.new_password;

      const my_users = await UserMaster.changePassword(
        user_id,
        old_password,
        new_password
      );
      res.send(my_users);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.changeexposureLimit = async function (req, res) {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const user_id = req.body.user_id;
      const exposure_limit = req.body.exposure_limit;
      const my_users = await UserMaster.changeexposureLimit(user_id, exposure_limit);
      res.send(my_users);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

//change password only by arjun admin
exports.passwordChange = async function (req, res) {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      let is_logout=false;
      let user_id = req.body.user_id;
      if(!user_id){
        user_id = req.userData.user.id;
      }else{
        // logout user
        is_logout=true;
      }
      const new_password = req.body.new_password;

      const my_users = await UserMaster.passwordChange(user_id, new_password, is_logout);
      res.send(my_users);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.deductBalance = async function (req, res) {
  try {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;
    const event_name = req.body.event_name;
    const event_type = req.body.event_type;
    const my_users = await UserMaster.deductBalance(
      user_id,
      event_id,
      event_name,
      event_type
    );
    res.send(my_users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getUsersAddedByMe = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const my_users = await UserMaster.getUsersAddedByMe(user_id);
    res.status(200).send(my_users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.activateUser = async function (req, res) {
  try {
    const user_id = req.body.user_id;
    const type = req.body.type;
    const my_user = await UserMaster.activateUser(user_id, type);
    res.status(200).send(my_user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.deleteUser = async function (req, res) {
  try {
    const user_id = req.params.id;
    const my_user = await UserMaster.deleteUser(user_id);
    res.status(200).send(my_user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.addUPI = async function (req, res) {
  try {
    const data = req.body;
    const fileUrl = req.body.qr_delete=="false" ? req.file ? "/" + req.file.filename : "noupdate" : "/no_file.png";
    const admin = await UserMaster.addUPI(data,fileUrl);
    res.status(200).send(admin);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

exports.getUPI = async function (req, res) {
  try {
    const upi_data = await UserMaster.getUPI();
    res.status(200).send(upi_data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};

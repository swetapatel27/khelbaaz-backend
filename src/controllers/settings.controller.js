const Setting = require("../models/settings");

exports.addPopup = async function (req, res) {
  try {
    let new_setting_request = new Setting(req.body);
    // console.log({new_setting_request,fileUrl});
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const fileUrl = req.body.popup_delete=="false" ? req.file ? "/" + req.file.filename : "/no_file.png" : null;
      let setting_request = await Setting.addSettingRequest(
        new_setting_request,
        fileUrl
      );
      res.status(200).send(setting_request);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error uploading data");
  }
};


exports.getPopup = async function (req, res) {
  try {
    let admin_id = req.params.admin_id;
    let user_requests = await Setting.getPopup(admin_id);
    res.status(200).send(user_requests);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};


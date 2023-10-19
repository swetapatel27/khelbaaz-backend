var dbConn = require("./../../config/db");
const Exposure = require("./exposure");
require("dotenv").config();

var SettingMaster = function (setting) {
  this.popup_img = setting.popup_img;
  this.deposit_whatsapp = setting.deposit_whatsapp;
  this.withdraw_whatsapp = setting.withdraw_whatsapp;
  this.technical_whatsapp = setting.technical_whatsapp;
  this.joining_bonus = setting.joining_bonus;
};

SettingMaster.addSettingRequest = async function (setting, fileUrl) {
    try {
      let setting_data;
      let qry;
      let qryData;
      if(fileUrl!="/no_file.png"){
        setting_data = {
          ...setting,
          popup_img: fileUrl,
          };
        qry = "UPDATE settings SET popup_img=?,deposit_whatsapp=?,withdraw_whatsapp=?,technical_whatsapp=?,joining_bonus=? WHERE id=1";
        qryData = [fileUrl,setting_data.deposit_whatsapp,setting_data.withdraw_whatsapp,setting_data.technical_whatsapp,setting_data.joining_bonus];
      }else{
        setting_data = {
          ...setting,
        }
        qry = "UPDATE settings SET deposit_whatsapp=?,withdraw_whatsapp=?,technical_whatsapp=?,joining_bonus=? WHERE id=1";
        qryData = [setting_data.deposit_whatsapp,setting_data.withdraw_whatsapp,setting_data.technical_whatsapp,setting_data.joining_bonus];
      }

      // console.log('sd--->',setting_data);
      let result = await new Promise((resolve, reject) => {
        dbConn.query(
          qry,
          qryData,
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
      return result;
      let result2 = await new Promise((resolve, reject) => {
        dbConn.query(
          "SELECT count(*) as total FROM settings",
          (err, res1) => {
            if (err) {
              reject(err);
            } else {
              if(res1[0].total > 0) {
                dbConn.query(
                  "UPDATE settings set ? WHERE id = ?",
                  [setting_data, '1'],
                  (err, res) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(res);
                    }
                  }
                );
              }else{
                dbConn.query(
                  "INSERT settings set ?",
                  [setting_data],
                  (err, res) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(res);
                    }
                  }
                );
              }
            }
          }
        );
      });
      return result2;
    } catch (error) {
      console.log(error);
    }
  };

  SettingMaster.getJoiningBonus = async function () {
    try {
      let result = await new Promise((resolve, reject) => {
        dbConn.query(
          "select joining_bonus from settings where id = 1",
          (err, res) => {
            if (err) {
              reject(0);
            } else {
              resolve(res[0].joining_bonus);
            }
          }
        );
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  SettingMaster.getPopup = async function () {
    try {
      let result = await new Promise((resolve, reject) => {
        dbConn.query(
          "select * from settings order by id desc;",
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  };

module.exports = SettingMaster;

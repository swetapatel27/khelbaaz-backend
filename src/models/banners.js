var dbConn = require("./../../config/db");
require("dotenv").config();

var BannerMaster = function (img_details) {
  this.path = img_details.path;
};

BannerMaster.uploadBanner = async function (banner_details) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO banners (path) VALUES ?",
        [banner_details.map((banner) => [banner.path])],
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

BannerMaster.getBanner = async function () {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from banners order by id desc;",
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

BannerMaster.deleteBanner = async function (id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query("delete from banners where id = ?", id, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = BannerMaster;

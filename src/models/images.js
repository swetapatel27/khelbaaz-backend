var dbConn = require("./../../config/db");
require("dotenv").config();

var ImageMaster = function (img_details) {
  this.path = img_details.path;
};

ImageMaster.uploadBanner = async function (banner_details) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO images (path) VALUES ?",
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

ImageMaster.getBanner = async function () {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from images order by id desc;",
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

ImageMaster.deleteBanner = async function (id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query("delete from images where id = ?", id, (err, res) => {
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
module.exports = ImageMaster;

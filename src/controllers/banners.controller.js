var Banners = require("../models/banners");

exports.uploadBanner = async function (req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      console.log("No file upload");
    } else {
      const fileNames = req.files.map((file) => {
        console.log(file.filename);
        return "/" + file.filename;
      });
      const imageObjects = fileNames.map(
        (fileName) => new Banners({ path: fileName })
      );
      const data = await Banners.uploadBanner(imageObjects);
      res.send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
exports.updateBanner = async function (req, res) {
  try {
    const id = req.params.id;
    if (!req.files || req.files.length === 0) {
      console.log("No file upload");
    } else {
      const fileNames = req.files.map((file) => {
        console.log(file.filename);
        return "/" + file.filename;
      });
      const imageObjects = fileNames.map(
        (fileName) => new Banners({ path: fileName })
      );
      const data = await Banners.updateBanner(imageObjects,id);
      res.send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getBanner = async function (req, res) {
  try {
    const data = await Banners.getBanner();
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.deleteBanner = async function (req, res) {
  try {
    const id = req.params.id;
    const data = await Banners.deleteBanner(id);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

var Images = require("../models/images");

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
        (fileName) => new Images({ path: fileName })
      );
      const data = await Images.uploadBanner(imageObjects);
      res.send(data);
      // console.log(req.file.filename);
      // var imgsrc = "/" + req.file.filename;
      // const new_image = new Images(imgsrc);
      // const data = await Images.uploadBanner(new_image);
      // res.send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getBanner = async function (req, res) {
  try {
    const data = await Images.getBanner();
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.deleteBanner = async function (req, res) {
  try {
    const id = req.params.id;
    const data = await Images.deleteBanner(id);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

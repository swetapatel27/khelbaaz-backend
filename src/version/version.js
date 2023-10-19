let version = 1.2;

getVersion = function (req, res) {
  try {
    res.status(200).send({ version: version });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getVersion,
};

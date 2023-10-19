// const axios = require("axios");
// const cheerio = require("cheerio");

var VideoMaster = function () {};

// VideoMaster.getVideo = async function () {
//   try {
//     const htmlResponse = await axios.get(
//       "https://nikhilm.gq/bettingapi/match_tv.php?Action=match&EventID=32473058"
//     );

//     return(htmlResponse.data);

//   } catch (error) {
//     console.log("err-->", error);
//     res.status(500).json({ error: "Failed to retrieve video URL" });
//   }
// };

module.exports = VideoMaster;

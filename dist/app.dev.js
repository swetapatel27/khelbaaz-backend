"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var userRoute = require("./src/routes/user.route");

var fundRoute = require("./src/routes/fund.route");

var giverRoute = require("./src/routes/giver.route");

var winnerRoute = require("./src/routes/winner.route");

var loserRoute = require("./src/routes/loser.route"); // const cronJob = require("./src/cron/matcheCron");
// const cronJobSession = require("./src/cron/matcheCron");
// const cronJobMatchOdds = require("./src/cron/matcheCron");


var marketOddRoute = require("./src/routes/marketodd.route");

var bookmakerOddRoute = require("./src/routes/bookmakerodd.route");

var eventRoute = require("./src/routes/event.route");

var sessionRoute = require("./src/routes/session.route");

var scoreRoute = require("./src/routes/score.route");

var clientRoute = require("./src/routes/client.route");

var transactionRoute = require("./src/routes/transaction.route");

var sessionBetsRoute = require("./src/routes/sessionbets.route");

var matchBetsRoute = require("./src/routes/matchbets.route");

var tennisBetsRoute = require("./src/routes/tennisbets.route");

var socccerBetsRoute = require("./src/routes/soccerbets.route");

var exposureRoute = require("./src/routes/exposure.route");

var resultRoute = require("./src/routes/result.route");

var reportRoute = require("./src/routes/report.route");

var feesRoute = require("./src/routes/fees.route");

var cashoutRoute = require("./src/routes/cashout.route");

var imageRoute = require("./src/routes/images.route");

var bannerRoute = require("./src/routes/banners.route");

var teenpatti20Route = require("./src/routes/casino/teenpatti20.route");

var lucky7Route = require("./src/routes/casino/lucky7.route");

var dt20Route = require("./src/routes/casino/dt20.route");

var card32aRoute = require("./src/routes/casino/card32a.route");

var casioBetsRoute = require("./src/routes/casino/casinobet.route");

var tenniOddsRoute = require("./src/routes/tennisodds.route");

var soccerOddsRoute = require("./src/routes/soccerodds.route");

var tennisResultRoute = require("./src/routes/tennisresult.route");

var soccerResultRoute = require("./src/routes/soccerresult.route");

var tennisEventRoute = require("./src/routes/tennisevent.route");

var soccerEventRoute = require("./src/routes/soccerevents.route");

var eventFeesRoute = require("./src/routes/eventfees.route");

var clientLedgerRoute = require("./src/routes/clientledger.route");

var depositRoute = require("./src/routes/deposit.route");

var withdrawRoute = require("./src/routes/withdraw.route");

var videoRoute = require("./src/routes/video.route");

var settingRoute = require("./src/routes/settings.route");

var livecasinoRoute = require("./src/routes/livecasino.route");

var newsoccerRoute = require("./src/routes/newsoccer.route");

var testRoute = require("./src/routes/test.route");

var versionRoute = require("./src/routes/version.route");

var webhookRoute = require("./src/routes/webhook.route");

var fancyRoute = require("./src/routes/fancy.route");

var fancybetsRoute = require("./src/routes/fancybets.route");

var fancyresultRoute = require("./src/routes/fancyresult.route");

var bookmakerResultRoute = require("./src/routes/bookmakerresult.route");

var BookmakerOddRoute = require("./src/routes/bookmakerodds.route");

var bookmakerBetsRoute = require("./src/routes/bookmakerbets.route");

var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs"); //use express static folder

app.use(express["static"]("public/images"));
app.use(express["static"]("public/deposits"));
app.use(express["static"]("public/withdraws"));
app.use(express["static"]("public/banners"));
app.use(express["static"]("public/payments"));
app.use(express["static"]("public/popup"));
app.use(express["static"]("public/json"));
app.use("/api/v1/", userRoute);
app.use("/api/v1/", fundRoute);
app.use("/api/v1/", giverRoute);
app.use("/api/v1/", winnerRoute);
app.use("/api/v1/", loserRoute);
app.use("/api/v1/", clientRoute);
app.use("/api/v1/", transactionRoute);
app.use("/api/v1/", eventRoute);
app.use("/api/v1/", sessionRoute);
app.use("/api/v1/", scoreRoute);
app.use("/api/v1/", sessionBetsRoute);
app.use("/api/v1/", matchBetsRoute);
app.use("/api/v1/", tennisBetsRoute);
app.use("/api/v1/", socccerBetsRoute);
app.use("/api/v1/", casioBetsRoute);
app.use("/api/v1/", exposureRoute);
app.use("/api/v1/", resultRoute);
app.use("/api/v1/", reportRoute);
app.use("/api/v1/", feesRoute);
app.use("/api/v1/", testRoute);
app.use("/api/v1/", cashoutRoute);
app.use("/api/v1/", imageRoute);
app.use("/api/v1/", bannerRoute);
app.use("/api/v1/", marketOddRoute);
app.use("/api/v1/", bookmakerOddRoute);
app.use("/api/v1/", teenpatti20Route);
app.use("/api/v1/", lucky7Route);
app.use("/api/v1/", dt20Route);
app.use("/api/v1/", card32aRoute);
app.use("/api/v1/", tenniOddsRoute);
app.use("/api/v1/", soccerOddsRoute);
app.use("/api/v1/", versionRoute);
app.use("/api/v1/", tennisResultRoute);
app.use("/api/v1/", soccerResultRoute);
app.use("/api/v1/", tennisEventRoute);
app.use("/api/v1/", soccerEventRoute);
app.use("/api/v1/", eventFeesRoute);
app.use("/api/v1/", clientLedgerRoute);
app.use("/api/v1/", depositRoute);
app.use("/api/v1/", withdrawRoute);
app.use("/api/v1/", videoRoute);
app.use("/api/v1/", settingRoute);
app.use("/api/v1/", livecasinoRoute);
app.use("/api/v1/", webhookRoute);
app.use("/api/v1/", newsoccerRoute);
app.use("/api/v1/", fancyRoute);
app.use("/api/v1/", fancybetsRoute);
app.use("/api/v1/", fancyresultRoute);
app.use("/api/v1/", bookmakerResultRoute);
app.use("/api/v1/", BookmakerOddRoute);
app.use("/api/v1/", bookmakerBetsRoute); // setting error path

app.use(function (req, res, next) {
  var err = new Error("".concat(req.url, " not found in this server"));
  err.status = 404;
  next(err);
}); // setting another error program

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: err.message
  });
}); // export app

module.exports = app;
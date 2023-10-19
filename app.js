const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./src/routes/user.route");
const fundRoute = require("./src/routes/fund.route");
const giverRoute = require("./src/routes/giver.route");
const winnerRoute = require("./src/routes/winner.route");
const loserRoute = require("./src/routes/loser.route");
// const cronJob = require("./src/cron/matcheCron");
// const cronJobSession = require("./src/cron/matcheCron");
// const cronJobMatchOdds = require("./src/cron/matcheCron");
const marketOddRoute = require("./src/routes/marketodd.route");
const bookmakerOddRoute = require("./src/routes/bookmakerodd.route");
const eventRoute = require("./src/routes/event.route");
const sessionRoute = require("./src/routes/session.route");
const scoreRoute = require("./src/routes/score.route");
const clientRoute = require("./src/routes/client.route");
const transactionRoute = require("./src/routes/transaction.route");
const sessionBetsRoute = require("./src/routes/sessionbets.route");
const matchBetsRoute = require("./src/routes/matchbets.route");
const tennisBetsRoute = require("./src/routes/tennisbets.route");
const socccerBetsRoute = require("./src/routes/soccerbets.route");
const exposureRoute = require("./src/routes/exposure.route");
const resultRoute = require("./src/routes/result.route");
const reportRoute = require("./src/routes/report.route");
const feesRoute = require("./src/routes/fees.route");
const cashoutRoute = require("./src/routes/cashout.route");
const imageRoute = require("./src/routes/images.route");
const bannerRoute = require("./src/routes/banners.route");
const teenpatti20Route = require("./src/routes/casino/teenpatti20.route");
const lucky7Route = require("./src/routes/casino/lucky7.route");
const dt20Route = require("./src/routes/casino/dt20.route");
const card32aRoute = require("./src/routes/casino/card32a.route");
const casioBetsRoute = require("./src/routes/casino/casinobet.route");
const tenniOddsRoute = require("./src/routes/tennisodds.route");
const soccerOddsRoute = require("./src/routes/soccerodds.route");
const tennisResultRoute = require("./src/routes/tennisresult.route");
const soccerResultRoute = require("./src/routes/soccerresult.route");
const tennisEventRoute = require("./src/routes/tennisevent.route");
const soccerEventRoute = require("./src/routes/soccerevents.route");
const eventFeesRoute = require("./src/routes/eventfees.route");
const clientLedgerRoute = require("./src/routes/clientledger.route");
const depositRoute = require("./src/routes/deposit.route");
const withdrawRoute = require("./src/routes/withdraw.route");
const videoRoute = require("./src/routes/video.route");
const settingRoute = require("./src/routes/settings.route");
const livecasinoRoute = require("./src/routes/livecasino.route");
const newsoccerRoute = require("./src/routes/newsoccer.route");

const testRoute = require("./src/routes/test.route");
const versionRoute = require("./src/routes/version.route");

const webhookRoute = require("./src/routes/webhook.route");
const fancyRoute = require("./src/routes/fancy.route");
const fancybetsRoute = require("./src/routes/fancybets.route");
const fancyresultRoute = require("./src/routes/fancyresult.route");

const bookmakerResultRoute = require("./src/routes/bookmakerresult.route");
const BookmakerOddRoute = require("./src/routes/bookmakerodds.route");
const bookmakerBetsRoute = require("./src/routes/bookmakerbets.route");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
//use express static folder
app.use(express.static("public/images"));
app.use(express.static("public/deposits"));
app.use(express.static("public/withdraws"));
app.use(express.static("public/banners"));
app.use(express.static("public/payments"));
app.use(express.static("public/popup"));
app.use(express.static("public/json"));

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
app.use("/api/v1/", bookmakerBetsRoute);

// setting error path
app.use((req, res, next) => {
  const err = new Error(`${req.url} not found in this server`);
  err.status = 404;
  next(err);
});

// setting another error program
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// export app
module.exports = app;

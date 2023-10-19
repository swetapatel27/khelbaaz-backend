const http = require("http");
const app = require("./app");
const server = http.createServer(app);
require("dotenv").config();
const CasinoBetController = require("./src/controllers/casino/casinobet.controller");

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`server running in port ${port}`);
  CasinoBetController.declareCasinoAllResult();
});

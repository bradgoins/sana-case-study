const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");

const UsersResource = require("./resources/users.resource");
const TokenResource = require("./resources/token.resource");

function startServer() {
  const app = express();

  var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
  };

  app.use(compression());
  app.use(cors(corsOptions));

  // parse requests
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(bodyParser.json({ limit: "50mb", extended: true }));

  //  === Routes
  app.use("/users", new UsersResource().router);
  app.use("/tokens", new TokenResource().router);

  const DB = require("./db");
  DB.connect()
    .then(() => {
      console.log("🚀 Successfully connected to the database");
    })
    .catch((err) => {
      console.log("👎 Could not connect to the database. Exiting now...", err);
      process.exit();
    });

  port = process.env.PORT || process.env.NODE_PORT || 3001;

  // listening
  app.listen(port, () => {
    console.log(`👂 Server is listening on port ${port}`);
  });

  // default route is she working?
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to horizon API" });
  });

  // catch favicon
  app.get("/favicon.ico", (req, res) => res.status(204));
}

startServer();

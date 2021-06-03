const express = require("express");
const jwt = require("jsonwebtoken");
const privateKey = process.env.PRIVATE_KEY;
const DB = require("../db");

class TokenResource {
  constructor() {
    this.router = express.Router({ mergeParams: true });
    this.init();
  }

  init() {
    this.router.post("/", this.add.bind(this));
    this.authentication = {};
  }

  async add(req, res) {
    const results = await DB.MongoClient.model('users')
      .find({email: req.body.email, password: req.body.password});
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ _id: user._id, email: user.email }, privateKey);
      res.send(`Bearer ${token}`);
    } else {
      res.status(422);
      res.end();
    }
  }
}

module.exports = TokenResource;

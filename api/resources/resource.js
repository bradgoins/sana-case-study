const express = require("express");
const jwt = require("jsonwebtoken");
const privateKey = process.env.PRIVATE_KEY;
const DB = require("../db");

const mongodb = require("mongodb");

class Resource {
  constructor(collection = "public") {
    this.router = express.Router();
    this.authentication = {
      get: true,
      select: true,
      add: true,
      update: true,
      delete: true,
    }
    this.init();

    this.collection = collection;

    this.model = DB.MongoClient.model(this.collection);
  }

  init() {
    this.router.get("/", this.get.bind(this));
    this.router.get("/:id", this.select.bind(this));
    this.router.post("/", this.add.bind(this));
    this.router.put("/:id", this.update.bind(this));
    this.router.delete("/:id", this.delete.bind(this));
  }

  static isAuthenticated(req) {
    try{
      const token = req.header("Authorization").replace("Bearer ", "");
      const values = jwt.verify(token, privateKey);
      console.log(values);
      return true;
    }catch(e){
      return false;
    }

  }

  static getFilterString(req) {
    var filterString;

    if (req.query.filter) {
      filterString = { $or: [] };

      let filters = req.query.filter.split(/\)/);
      filters = filters.filter(function (a) {
        return a !== "";
      });

      filters.forEach((f) => {
        if (f != "") {
          f = f.replace("(", "");
          f = f.replace(")", "");

          let items = f.split(",");
          items = items.filter(function (a) {
            return a !== "";
          });

          let filter = { $and: [] };
          items.forEach((item) => {
            const singleFilter = {};
            let i = item.split(":");

            if (i[2] == "true") i[2] = true;
            if (i[2] == "false") i[2] = false;

            switch (i[1]) {
              case "eq":
                singleFilter[i[0]] = new RegExp("^" + i[2] + "$", "i");
                break;

              case "eqObject":
                singleFilter[i[0]] = mongodb.ObjectId(i[2]);
                break;

              case "ne":
                singleFilter[i[0]] = new RegExp("^(?!" + i[2] + "$).*$", "i");
                break;

              case "contains":
                singleFilter[i[0]] = new RegExp(`.*${i[2]}.*`, "i");
                break;

              case "boolean":
                singleFilter[i[0]] = i[2];
                break;

              default:
                singleFilter[i[0]] = new RegExp("^" + i[2] + "$", "i");
            }

            filter.$and.push(singleFilter);
          });
          filterString.$or.push(filter);
        }
      });
    }
    return filterString;
  }

  static staticGetSort(req) {
    if (req.query.sortby) {
      let sortArray = req.query.sortby.split(",");

      let sortObject = {};

      sortArray.forEach((a) => {
        let sort = a.split(":");

        sortObject[sort[0]] = (() => {
          if (sort[1] === "desc") {
            return -1;
          }

          return 1;
        })();
      });

      return sortObject;
    }

    return;
  }
  static buildGetResponse(err, results) {
    if (err) {
      results = [];
    }

    if (!results) {
      results = [];
    }

    return {
      items: results,
      page: {
        totalCount: results.length,
      },
    };
  }

  async getInit(req, res) {}
  async get(req, res, next) {

    if (this.authentication.get && !Resource.isAuthenticated(req)) {
      res.status(401);
      res.send();
      return;
    }

    this.getInit(req, res);

    let filterString = Resource.getFilterString(req);
    let sort = Resource.staticGetSort(req);
    let model = DB.MongoClient.model(this.collection);

    const aggregate = [];

    if (req.query.expand) {
      req.query.expand.split(",").forEach((e) => {
        aggregate.push(this.expand[e]);
      });
    }

    if (filterString) {
      aggregate.push({ $match: filterString });
    }
    if (sort) {
      aggregate.push({ $sort: sort });
    }

    aggregate.push({ $skip: req.query.offset ? Number(req.query.offset) : 0 });
    aggregate.push({ $limit: req.query.limit ? Number(req.query.limit) : 5 });

    model.aggregate(aggregate).exec(async (error, results) => {
      if (error) {
        res.status(422);
        res.send({ error: error });
      }

      if (req.query.expand) {
        results.forEach((r) => {
          req.query.expand.split(",").forEach((e) => {
            if (r[e]) {
              r[e] = r[e][0];
            }
          });
        });
      }

      const response = Resource.buildGetResponse(error, results);
      response.page.totalCount = await Resource.getCount(model, req, this);
      res.send(response);
    });
  }

  static getCount(model, req, resource) {
    return new Promise((resolve, reject) => {
      let filterString = Resource.getFilterString(req);

      const aggregate = [];

      if (req.query.expand) {
        req.query.expand.split(",").forEach((e) => {
          aggregate.push(resource.expand[e]);
        });
      }

      if (filterString) {
        aggregate.push({ $match: filterString });
      }

      aggregate.push({ $count: "count" });

      model.aggregate(aggregate).exec((error, results) => {
        if (error) {
          reject(error);
        }

        if (results.length > 0) {
          resolve(results[0].count);
        } else {
          resolve(0);
        }
      });
    });
  }

  selectInit(req, res) {}
  select(req, res, next) {

    if (this.authentication.select && !Resource.isAuthenticated(req)) {
      res.status(401);
      res.send();
      return;
    }

    this.selectInit(req, res);

    DB.MongoClient.model(this.collection)
      .findById(req.params.id)
      .then((result, err) => {
        res.send(result);
      });
  }

  async addInit(req, res) {}
  async addCallback(result, req) {
    return new Promise((resolve) => {
      resolve(result);
    });
  }
  async add(req, res) {

    if (this.authentication.add && !Resource.isAuthenticated(req)) {
      res.status(401);
      res.send();
      return;
    }

    try {
      const init = await this.addInit(req, res);
      let result = await DB.MongoClient.model(this.collection).create(req.body);
      result = await this.addCallback(result, req);
      res.send(result);
    } catch (e) {
      console.log(e);
      res.status(422);
      res.send(e);
    }
  }

  updateInit(req, res) {}
  async update(req, res) {

    if (this.authentication.update && !Resource.isAuthenticated(req)) {
      res.status(401);
      res.send();
      return;
    }

    try {
      this.updateInit(req, res);

      let ObjectID = require("mongodb").ObjectID;
      delete req.body._id;

      let result = await DB.MongoClient.model(this.collection).findOneAndUpdate(
        { _id: ObjectID(req.params.id) },
        { $set: req.body },
        { new: true }
      );

      res.send(result);
    } catch (e) {
      console.log(e);
      res.status(422);
      res.send(e);
    }
  }

  async deleteInit(req, res) {}
  async deleteCallback(result, req) {
    return await result;
  }
  async delete(req, res) {
    
    if (this.authentication.delete && !Resource.isAuthenticated(req)) {
      res.status(401);
      res.send();
      return;
    }

    await this.deleteInit(req, res);

    await DB.MongoClient.model(this.collection).findOneAndDelete({
      _id: new mongodb.ObjectID(req.params.id),
    });

    res.send();
  }
}

module.exports = Resource;

'use strict';

const Model = require('./models/model');

class DB {
	constructor() {}

	static setClient(client) {
		DB.client = client;
	}

	static connect() {
		return new Promise((resolve, reject) => {
			DB.MongoClient.connect(process.env.MONGODB_URI || process.env.DATABASE_URL, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			})
				.then(client => {
					DB.setClient(client);

					resolve();
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}

DB.MongoClient = Model;
module.exports = DB;

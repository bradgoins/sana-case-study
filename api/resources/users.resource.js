"use strict";

const Resource = require('./resource');

class UsersResource extends Resource {

	constructor(){
		super('users');
		this.authentication.add = false;
	}
}

module.exports = UsersResource;
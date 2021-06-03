'use strict';

const Model = require('mongoose');
const UserSchema = require('./user.schema');

Model.model('users', UserSchema);

Model.set('debug', true);

module.exports = Model;

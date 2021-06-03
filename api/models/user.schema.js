const model = require("mongoose");

const schema = model.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    threshold: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = schema;

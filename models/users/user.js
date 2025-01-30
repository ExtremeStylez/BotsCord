const { Schema, model } = require('mongoose');

const users = model(
  'users',
  new Schema({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    apps: [String],
  })
);

module.exports = { users };

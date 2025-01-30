const { Schema, model } = require('mongoose');

const apps = model(
  'apps',
  new Schema({
    token: {
      type: String,
      // required: true,
      // unique: true,
    },
    id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
      default: null,
    },
  })
);

module.exports = { apps };

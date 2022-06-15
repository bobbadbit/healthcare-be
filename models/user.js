const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    is_active: {
      type: Boolean,
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
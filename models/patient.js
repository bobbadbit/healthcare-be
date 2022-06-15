const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    temp: {
      type: Number,
    },
    owner_id: {
      type: String,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Patient', patientSchema);
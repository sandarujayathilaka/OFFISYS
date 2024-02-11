const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  did: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Department", departmentSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  eid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  roles: {
    type: Schema.Types.Mixed, // Allow any data type for the roles field
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  department: {
    type: Schema.Types.Mixed,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  subject: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],

  report: [
    {
      name: {
        type: String,

        required: true,
      },

      date: {
        type: String,

        default: "",
      },

      due: {
        type: String,

        default: "",
      },
    },
  ],
});

module.exports = mongoose.model("Employee", employeeSchema);

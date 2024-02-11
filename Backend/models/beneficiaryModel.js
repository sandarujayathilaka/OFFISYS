const mongoose = require("mongoose");

const beneficiarySchema = mongoose.Schema({
  division: {
    type: String,
    required: [true, "Please add a division"],
  },
  officerid: {
    type: String,
    required: [true, "Please add an id"],
  },
  subject: {
    type: String,
    required: [true, "Please add an id"],
  },
  benname: {
    type: String,
    required: [true, "Please add a ben name"],
  },
  nic: {
    type: String,
    required: [true, "Please add an nic"],
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
  },
  task: {
    type: String,
    required: [true, "Please add a matter"],
  },
  status: {
    type: String,
    enum: ["Done", "Pending", "Rejected"],
    default: "Done",
    required: [true, "Please add a status"],
  },
  reason: {
    type: String,
    required: [false, "Please add a reason"],
  },

  pending: [
    {
      reason: {
        type: String,
        required: [false, "Please add a reason"],
      },
      sysdate: {
        type: String,
        required: [false, "Please add a reason"],
      },
    },
  ],

  rejreason: {
    type: String,
    required: [false, "Please add a reason"],
  },
  time: {
    type: String,
    required: [false, "Please add a time"],
  },
  scheduledate: {
    type: String,
    required: [false, "Please add a schedule date"],
  },
  lastUpdatedDate: {
    type: String,
    required: [false, "Please add a schedule date"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

module.exports = mongoose.model("beneficiary", beneficiarySchema);

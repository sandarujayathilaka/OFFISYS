const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  department: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    task: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    pending: [
        {
          name: {
            type: String,
            required: true,
          },
        },
      ],
      reject: [
        {
          name: {
            type: String,
            required: true,
          },
        },
      ],
      
});

module.exports = mongoose.model('Subject', subjectSchema);

const Record = require('../models/beneficiaryModel');

const deleteOldRecords = async () => {
  const expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() - 12);
  

  try {
    //await Record.deleteMany({
    //  $or: [
     //   { status: "Done", createdAt: { $lt: expirationDate } },
      //  { status: "Rejected", createdAt: { $lt: expirationDate } },
    //  ],
   // });

    console.log("Data Delete things stopped Untill AG Office says")

  } catch (error) {
   
  }
};

module.exports = deleteOldRecords;

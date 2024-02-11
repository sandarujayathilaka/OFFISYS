const Subject = require('../models/Subject');
const beneficiaryModel = require("../models/beneficiaryModel");
const Employee = require("../models/Employee");
const ROLES_LIST = require("../config/roles_list");

const getAllSubjects = async (req, res) => {
    const subjects = await Subject.find();
    if (!subjects) return res.status(204).json({ 'message': 'No subjects found.' });
    res.json(subjects);
}

const createNewSubject = async (req, res) => {
  if (!req?.body?.department || !req?.body?.subject) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const passedTasks = req.body.task.map((subject) => subject.name);

  let hasTDuplicate = false; // Flag variable

  for (let i = 0; i < passedTasks.length; i++) {
    const passedTask = passedTasks[i];

    for (let j = i + 1; j < passedTasks.length; j++) {
      const passedTask2 = passedTasks[j];

      if (passedTask === passedTask2) {
        hasTDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    if (hasTDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasTDuplicate) {
    return res
      .status(405)
      .json({ message: "Same task value is passed multiple times" });
  }

  const passedPends = req.body.pending.map((subject) => subject.name);

  let hasPDuplicate = false; // Flag variable

  for (let i = 0; i < passedPends.length; i++) {
    const passedPend = passedPends[i];

    for (let j = i + 1; j < passedPends.length; j++) {
      const passedPend2 = passedPends[j];

      if (passedPend === passedPend2) {
        hasPDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    if (hasPDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasPDuplicate) {
    return res
      .status(403)
      .json({ message: "Same Pending value is passed multiple times" });
  }

  const passedRejects = req.body.reject.map((subject) => subject.name);

  let hasRDuplicate = false; // Flag variable

  for (let i = 0; i < passedRejects.length; i++) {
    const passedReject = passedRejects[i];

    for (let j = i + 1; j < passedRejects.length; j++) {
      const passedReject2 = passedRejects[j];

      if (passedReject === passedReject2) {
        hasRDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    if (hasRDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasRDuplicate) {
    return res
      .status(402)
      .json({ message: "Same Reject value is passed multiple times" });
  }

  try {
    const result = await Subject.create({
      department: req.body.department,
      subject: req.body.subject,
      task: req.body.task,
      pending: req.body.pending,
      reject: req.body.reject,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};





const deleteSubject = async (req, res) => {
    
    if (!req.params.id) {
         return res.status(400).json({ 'message': 'subject ID required.' });
    }
    const subject = await Subject.findOne({ _id: req.params.id  }).exec();
    if (!subject) {
        return res.status(204).json({ "message": `No subject matches ID ${req.params.id}.` });
    }
    const result = await subject.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getSubject = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'subject ID required.' });

    const subject = await Subject.findOne({ _id: req.params.id }).exec();
    if (!subject) {
        return res.status(204).json({ "message": `No subject matches ID ${req.params.id}.` });
    }
    res.json(subject);
}


const addNew = async (req, res) => {
  const passedTasks = req.body.task.map((subject) => subject.name);

  let hasTDuplicate = false; // Flag variable

  for (let i = 0; i < passedTasks.length; i++) {
    const passedTask = passedTasks[i];

    for (let j = i + 1; j < passedTasks.length; j++) {
      const passedTask2 = passedTasks[j];

      if (passedTask === passedTask2) {
        hasTDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    //  Check if the passed subject value already exists in the database
    const existingTask = await Subject.findOne({
      _id: req.params.id,
      "task.name": passedTask,
    });

    if (existingTask) {
      return res
        .status(403)
        .json({
          message: `Task '${passedTask}' is already saved in the database`,
        });
    }

    if (hasTDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasTDuplicate) {
    return res
      .status(402)
      .json({ message: "Same task value is passed multiple times" });
  }

  const passedPends = req.body.pending.map((subject) => subject.name);

  let hasPDuplicate = false; // Flag variable

  for (let i = 0; i < passedPends.length; i++) {
    const passedPend = passedPends[i];

    for (let j = i + 1; j < passedPends.length; j++) {
      const passedPend2 = passedPends[j];

      if (passedPend === passedPend2) {
        hasPDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    const existingPend = await Subject.findOne({
      _id: req.params.id,
      "pending.name": passedPend,
    });

    if (existingPend) {
      return res
        .status(406)
        .json({
          message: `Pending '${passedPend}' is already saved in the database`,
        });
    }
    if (hasPDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasPDuplicate) {
    return res
      .status(408)
      .json({ message: "Same pending value is passed multiple times" });
  }

  const passedRejects = req.body.reject.map((subject) => subject.name);

  let hasRDuplicate = false; // Flag variable

  for (let i = 0; i < passedRejects.length; i++) {
    const passedReject = passedRejects[i];

    for (let j = i + 1; j < passedRejects.length; j++) {
      const passedReject2 = passedRejects[j];

      if (passedReject === passedReject2) {
        hasRDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    const existingRej = await Subject.findOne({
      _id: req.params.id,
      "reject.name": passedReject,
    });

    if (existingRej) {
      return res
        .status(405)
        .json({
          message: `Reject '${passedReject}' is already saved in the database`,
        });
    }
    if (hasRDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasRDuplicate) {
    return res
      .status(409)
      .json({ message: "Same reject value is passed multiple times" });
  }
  try {
    const reportData = await Subject.findOne({ _id: req.params.id });
    if (!reportData) return res.status(404).json({ error: "Report not found" });

    // Update beneficiaries
    await beneficiaryModel.updateMany(
      { subject: reportData.subject },
      { subject: req.body.subject }
    );

    // Update Employee
    const employees = await Employee.find();
    for (const employee of employees) {
      for (let index = 0; index < employee.subject.length; index++) {
        const subjectObj = employee.subject[index];
        if (subjectObj.name === reportData.subject) {
          subjectObj.name = req.body.subject;
        }
      }

      await employee.save();
    }
    await Subject.updateOne(
      { _id: req.params.id },
      {
        $set: {
          subject: req.body.subject,
          department: req.body.department,
        },
        $push: {
          task: { $each: req.body.task },
          pending: { $each: req.body.pending },
          reject: { $each: req.body.reject },
        },
      }
    );

    // Return success response
    res.status(200).json({ message: "Report updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


  const deleteTask = async (req, res) => {
    try {
      const { id, index } = req.params;
      const { word } = req.body;
      
      const subject = await Subject.findOne({ _id: id });
      if (!subject) {
        return res.status(404).json({ error: "subject not found" });
      }
  if(word=="task"){
      subject.task.splice(index, 1);
  }else if(word=="pending"){
    subject.pending.splice(index, 1);
  }else if(word=="reject"){
    subject.reject.splice(index, 1);
  }
     
      await subject.save();
  
      res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      
      res.status(500).json({ error: "Internal server error" });
    }
  };

  
 const updateTask = async (req, res) => {
   const { id, index } = req.params;
   const { subject, task, pending, reject, status } = req.body;

   if (!id) {
     return res.status(400).json({ message: "ID parameter is required." });
   }

   const sub = await Subject.findOne({ _id: id });

   if (!sub) {
     return res.status(204).json({ message: `No subject matches ID ${id}.` });
   }

   if (req.body.subject) {
     sub.subject = req.body.subject;
   }

   if (status === "task") {
     if (req.body.task && req.body.task[index]) {
       const existingtask = await Subject.findOne({
         _id: req.params.id,
         "task.name": req.body.task[index].name,
       });

       if (existingtask) {
         return res
           .status(402)
           .json({
             message: `Task '${req.body.task[index].name}' is already saved in the database`,
           });
       }

       await beneficiaryModel.updateMany(
         { task: sub.task[index].name },
         { task: req.body.task[index].name }
       );

       sub.task[index].name = req.body.task[index].name;
     }
   } else if (status === "pending") {
     if (req.body.pending && req.body.pending[index]) {
       const existingpend = await Subject.findOne({
         _id: req.params.id,
         "pending.name": req.body.pending[index].name,
       });

       if (existingpend) {
         return res
           .status(403)
           .json({
             message: `Pending '${req.body.pending[index].name}' is already saved in the database`,
           });
       }

       const ben = await beneficiaryModel.find();

       for (const bene of ben) {
         for (let index = 0; index < bene.pending.length; index++) {
           const subjectObj = bene.pending[index];

           if (subjectObj.reason === sub.pending[index].name) {
             subjectObj.reason = req.body.pending[index].name;
           }
         }

         await bene.save();
       }

       sub.pending[index].name = req.body.pending[index].name;
     }
   } else if (status === "reject") {
     if (req.body.reject && req.body.reject[index]) {
       const existingrej = await Subject.findOne({
         _id: req.params.id,
         "reject.name": req.body.reject[index].name,
       });

       if (existingrej) {
         return res
           .status(405)
           .json({
             message: `Reject '${req.body.reject[index].name}' is already saved in the database`,
           });
       }

       await beneficiaryModel.updateMany(
         { rejreason: sub.reject[index].name },
         { rejreason: req.body.reject[index].name }
       );
       sub.reject[index].name = req.body.reject[index].name;
     }
   }

   const result = await sub.save(); // Save the updated object

   res.json(result);
 };


 

module.exports = {
    getAllSubjects,
    createNewSubject,
    deleteSubject,
    getSubject,
    addNew,
    deleteTask,
    updateTask
}
const Employee = require("../models/Employee");
const User = require("../models/User");
const beneficiaryModel = require("../models/beneficiaryModel");
const ROLES_LIST = require("../config/roles_list");


const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
}

const getDepartmentEmp = async (req, res) => {
 
   const employees = await Employee.find({ department: req.params.dep}).exec();
  if (!employees)
    return res.status(204).json({ message: "No employees found." });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const { roles } = req.body
 
  if(roles=="Divisional_Secretariat"){
    const existingEditor = await Employee.findOne({ "roles.Divisional_Secretariat": { $exists: true } });
  
    if (existingEditor) {
     return res.status(405).json({ message: "A Divisional_Secretariat already exists. Only one Divisional_Secretariat is allowed." });
   }
  }
  if(roles=="Admin"){
    const existingAdmin = await Employee.findOne({ "roles.Admin": { $exists: true } });
    
      if (existingAdmin) {
       return res.status(405).json({ message: "An Admin already exists. Only one Admin is allowed." });
      }
  }
  if(roles=="Assistant_Director"){
      const existingAssistant_Director = await Employee.findOne({ "roles.Assistant_Director": { $exists: true } });
     
      if (existingAssistant_Director) {
        return res.status(405).json({ message: "An Assistant_Director already exists. Only one Assistant_Director is allowed." });
      }
  }
  if(roles=="Assistant_District_Registar"){
      const existingAssistant_District_Registar = await Employee.findOne({ "roles.Assistant_District_Registar": { $exists: true } });
       
      if (existingAssistant_District_Registar) {
         return res.status(405).json({ message: "An Assistant_District_Registar already exists. Only one Assistant_District_Registar is allowed." });
      }
  }
  if(roles=="Cheif_Clerk"){
      const existingCheif_Clerk = await Employee.findOne({ "roles.Cheif_Clerk": { $exists: true } });
         
      if (existingCheif_Clerk) {
          return res.status(405).json({ message: "A Cheif_Clerk already exists. Only one Cheif_Clerk is allowed." });
      }
  }
  if(roles=="Accountant"){
      const existingAccountant = await Employee.findOne({ "roles.Accountant": { $exists: true } });
            
      if (existingAccountant) {
        return res.status(405).json({ message: "An Accountant already exists. Only one Accountant is allowed." });
     }
  }
  if(roles=="Administrative_Officer"){
    const existingAdministrative_Officer = await Employee.findOne({ "roles.Administrative_Officer": { $exists: true } });
              
      if (existingAdministrative_Officer) {
          return res.status(405).json({ message: "An Administrative_Officer already exists. Only one Administrative_Officer is allowed." });
      }
  }

 
  const { report } = req.body
    

    if (!req?.body?.eid || !req?.body?.name || !req?.body?.roles || !req?.body?.nic || !req?.body?.phoneNumber || !req?.body?.department || !req?.body?.email) {
        return res.status(400).json({ 'message': 'Please fill in all fields' });
    }
    const passedSubjects = req.body.subject.map((subject) => subject.name);

    let hasDuplicate = false; // Flag variable

    for (let i = 0; i < passedSubjects.length; i++) {
      const passedSubject = passedSubjects[i];

      for (let j = i + 1; j < passedSubjects.length; j++) {
        const passedSubject2 = passedSubjects[j];

        if (passedSubject === passedSubject2) {
          hasDuplicate = true; // Set the flag to true
          break; // Exit the inner loop
        }
      }

      if (hasDuplicate) {
        break; // Exit the outer loop if a duplicate is found
      }
    }

    if (hasDuplicate) {
      return res
        .status(402)
        .json({ message: "Same subject value is passed multiple times" });
    }

    const passedReports = req.body.report.map((subject) => subject.name);

    let hasRDuplicate = false; // Flag variable

    for (let i = 0; i < passedReports.length; i++) {
      const passedReport = passedReports[i];

      for (let j = i + 1; j < passedReports.length; j++) {
        const passedReport2 = passedReports[j];

        if (passedReport === passedReport2) {
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
        .status(403)
        .json({ message: "Same report value is passed multiple times" });
    }


    
    try {
        const { roles } = req.body; 
      
        const result = await Employee.create({
            eid: req.body.eid,
            name: req.body.name,
            roles: { [roles]: ROLES_LIST[roles] },
            nic: req.body.nic,
            phoneNumber: req.body.phoneNumber,
            department: req.body.department,
            email:req.body.email,
            subject:req.body.subject,
            report:req.body.report
        });

        res.status(201).json(result);
    } catch (err) {
       
        res.status(500).json({ 'message': 'Internal Server Error' });
    }
  

}

const updateSubject = async (req, res) => {
  const { id, index } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const employee = await Employee.findOne({ _id: id });

  if (!employee) {
    return res.status(204).json({ message: `No employee matches ID ${id}.` });
  }

  if (req.body.eid) {
    employee.eid = req.body.eid;
  }

  if (status === "subject") {
    if (req.body.subject && req.body.subject[index]) {
      const existingSubject = await Employee.findOne({
        _id: req.params.id,
        "subject.name": req.body.subject[index].name,
      });

      if (existingSubject) {
        return res
          .status(403)
          .json({
            message: `Subject '${req.body.subject[index].name}' is already saved in the database`,
          });
      }

      employee.subject[index].name = req.body.subject[index].name;
    }
  } else if (status === "report") {
    if (req.body.report && req.body.report[index]) {
      const existingReport = await Employee.findOne({
        _id: req.params.id,
        "report.name": req.body.report[index].name,
      });

      if (existingReport) {
        return res
          .status(405)
          .json({
            message: `Report '${req.body.report[index].name}' is already saved in the database`,
          });
      }

      employee.report[index].name = req.body.report[index].name;
    }
  }

  const result = await employee.save();
  res.json(result);
};




const deleteEmployee = async (req, res) => {
    
    if (!req.params.id) {
         return res.status(400).json({ 'message': 'Employee ID required.' });
    }
    const employee = await Employee.findOne({ _id: req.params.id  }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    const result = await employee.deleteOne(); 
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ eid: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.json(employee);
}


const addSub = async (req, res) => {
  if (req.body.roles && req.body.roles.Divisional_Secretariat) {
    const existingEditor = await Employee.findOne({
      "roles.Divisional_Secretariat": { $exists: true },
      _id: { $ne: req.params.id },
    });
    if (existingEditor) {
      return res
        .status(405)
        .json({
          message:
            "An Divisional_Secretariat already exists. Only one Divisional_Secretariat is allowed.",
        });
    }
  }
  if (req.body.roles && req.body.roles.Admin) {
    const existingAdmin = await Employee.findOne({
      "roles.Admin": { $exists: true },
      _id: { $ne: req.params.id },
    });
    if (existingAdmin) {
      return res
        .status(405)
        .json({
          message: "An Admin already exists. Only one Admin is allowed.",
        });
    }
  }
  if (req.body.roles && req.body.roles.Assistant_Director) {
    const existingAssistant_Director = await Employee.findOne({
      "roles.Assistant_Director": { $exists: true },
      _id: { $ne: req.params.id },
    });
    if (existingAssistant_Director) {
      return res
        .status(405)
        .json({
          message:
            "An Assistant_Director already exists. Only one Assistant_Director is allowed.",
        });
    }
  }
  if (req.body.roles && req.body.roles.Assistant_District_Registar) {
    const existingAssistant_District_Registar = await Employee.findOne({
      "roles.Assistant_District_Registar": { $exists: true },
      _id: { $ne: req.params.id },
    });
    if (existingAssistant_District_Registar) {
      return res
        .status(405)
        .json({
          message:
            "An Assistant_District_Registar already exists. Only one Assistant_District_Registar is allowed.",
        });
    }
  }
  if (req.body.roles && req.body.roles.Cheif_Clerk) {
    const existingCheif_Clerk = await Employee.findOne({
      "roles.Cheif_Clerk": { $exists: true },
      _id: { $ne: req.params.id },
    });
    if (existingCheif_Clerk) {
      return res
        .status(405)
        .json({
          message:
            "A Cheif_Clerk already exists. Only one Cheif_Clerk is allowed.",
        });
    }
  }
  if (req.body.roles && req.body.roles.Accountant) {
    const existingAccountant = await Employee.findOne({
      "roles.Accountant": { $exists: true },
      _id: { $ne: req.params.id },
    });
    if (existingAccountant) {
      return res
        .status(405)
        .json({
          message:
            "An Accountant already exists. Only one Accountant is allowed.",
        });
    }
  }
  if (req.body.roles && req.body.roles.Administrative_Officer) {
    const existingAdministrative_Officer = await Employee.findOne({
      "roles.Administrative_Officer": { $exists: true },
      _id: { $ne: req.params.id },
    });
    if (existingAdministrative_Officer) {
      return res
        .status(405)
        .json({
          message:
            "An Administrative_Officer already exists. Only one Administrative_Officer is allowed.",
        });
    }
  }
  const employee = await Employee.find();

  const passedSubjects = req.body.subject.map((subject) => subject.name);

  let hasDuplicate = false; // Flag variable

  for (let i = 0; i < passedSubjects.length; i++) {
    const passedSubject = passedSubjects[i];

    for (let j = i + 1; j < passedSubjects.length; j++) {
      const passedSubject2 = passedSubjects[j];

      if (passedSubject === passedSubject2) {
        hasDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    //  Check if the passed subject value already exists in the database
    const existingEmployee = await Employee.findOne({
      _id: req.params.id,
      "subject.name": passedSubject,
    });

    if (existingEmployee) {
      return res
        .status(403)
        .json({
          message: `Subject '${passedSubject}' is already saved in the database`,
        });
    }

    if (hasDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasDuplicate) {
    return res
      .status(402)
      .json({ message: "Same subject value is passed multiple times" });
  }

  const passedReports = req.body.report.map((subject) => subject.name);

  let hasRDuplicate = false; // Flag variable

  for (let i = 0; i < passedReports.length; i++) {
    const passedReport = passedReports[i];

    for (let j = i + 1; j < passedReports.length; j++) {
      const passedReport2 = passedReports[j];

      if (passedReport === passedReport2) {
        hasRDuplicate = true; // Set the flag to true
        break; // Exit the inner loop
      }
    }

    const existingEmployee = await Employee.findOne({
      _id: req.params.id,
      "report.name": passedReport,
    });

    if (existingEmployee) {
      return res
        .status(406)
        .json({
          message: `Report '${passedReport}' is already saved in the database`,
        });
    }
    if (hasRDuplicate) {
      break; // Exit the outer loop if a duplicate is found
    }
  }

  if (hasRDuplicate) {
    return res
      .status(408)
      .json({ message: "Same report value is passed multiple times" });
  }

  try {
    const reportData = await Employee.findOne({ _id: req.params.id });
    if (!reportData) return res.status(404).json({ error: "Report not found" });

    // Update beneficiaries
    await beneficiaryModel.updateMany(
      { officerid: reportData.eid },
      { officerid: req.body.eid }
    );

    // Update user
    await User.updateMany(
      { username: reportData.eid },
      { username: req.body.eid }
    );

    await Employee.updateOne(
      { _id: req.params.id },
      {
        $set: {
          eid: req.body.eid,
          name: req.body.name,
          nic: req.body.nic,
          roles: req.body.roles,
          phoneNumber: req.body.phoneNumber,
          department: req.body.department,
          email: req.body.email,
        },
        $push: {
          subject: { $each: req.body.subject },
          report: { $each: req.body.report },
        },
      }
    );

    res.status(200).json({ message: "Report updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
  
 
  const deleteSub = async (req, res) => {
    try {
      const { id, index } = req.params;
      const { word } = req.body;
      
      const employee = await Employee.findOne({ _id: id });
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      if(word=="subject"){
        employee.subject.splice(index, 1);
    }else if(word=="report"){
      employee.report.splice(index, 1);
    }


      
      
      await employee.save();
  
      res.status(200).json({ message: "Subject deleted" });
    } catch (error) {
      
      res.status(500).json({ error: "Internal server error" });
    }
  };

   const ReportDate = async (req, res) => {
    try {
      const { id, reportId } = req.params;
      const { date,due } = req.body;

      // Find the employee by ID
      const employee = await Employee.findOne({ eid: id });
      
      console.log(employee.report.map((r) => r._id.toString()));

      // Find the report within the employee's report array by reportId
      const report = employee.report.find((r) => r._id.toString() === reportId);

      // Update the report's date
      report.date = date;
      report.due = due;
      

      // Save the changes to the employee
      await employee.save();

      res.status(200).json({ message: "Report date updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the report date" });
    }
  };
  
  

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateSubject,
  deleteEmployee,
  getEmployee,
  addSub,
  deleteSub,
  getDepartmentEmp,
  ReportDate,
};

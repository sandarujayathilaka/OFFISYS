const Beneficiary = require("../models/beneficiaryModel");
const Employee = require("../models/Employee");
const Subject = require("../models/Subject");

const caseRegister = async (req, res) => {


  try {
    // Create a new beneficiary
    const newBen = new Beneficiary({
      division: req.body.section,
      officerid: req.body.officerid,
      subject: req.body.subject,
      benname: req.body.benname,
      nic: req.body.nic,
      phone: req.body.phone,
      task: req.body.task,
      status: req.body.status,
      pending: req.body.pending,
      rejreason: req.body.rejReason,
      scheduledate: req.body.scheduledate,
      lastUpdatedDate: req.body.date,
    });

    // Save the new beneficiary to the database
    await newBen.save();

    res.status(201).json({ message: "Task is added", ben: newBen });
  } catch (error) {
   
    res.status(500).json({ error: "Failed to add profile" });
  }
};

//-----get all tasks for specific employee----

const getAllTasks = async (req, res) => {
  try {
    const empId = req.params.empId; // Assuming the employee ID is provided in the URL parameter

    // Retrieve all the tasks related to the specific employee ID
    const tasks = await Beneficiary.find({ officerid: empId }); // Replace 'empId' with the actual field name in your schema

    res.status(200).json({ tasks });
  } catch (err) {
   
    res.status(500).json({ error: "Internal server error" });
  }
};

//-------get one task-------

const getTask = async (req, res) => {
  const { id } = req.params;

  let task = null;

  try {
    task = await Beneficiary.findOne({ _id: id });
  } catch (err) {
    
    return res.status(500).json({
      error: "Internal server error",
    });
  }

  // check if task exists
  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }
  res.status(200).json({ task });
};

const pendingUpdate = async (req, res) => {
  const { id } = req.params;
  const {
    division_up,
    officerid_up,
    subject_up,
    benname_up,
    nic_up,
    phone_up,
    task_up,
    status_up,
    rejReason_up,
    pending,
    scheduledate_up,
    date,
  } = req.body;

  const updateData = {
    division: division_up,
    officerid: officerid_up,
    subject: subject_up,
    benname: benname_up,
    nic: nic_up,
    phone: phone_up,
    task: task_up,
    status: status_up,
    pending: pending,
    rejreason: rejReason_up,
    scheduledate: scheduledate_up,
    lastUpdatedDate: date,
  };

  try {
    // Ensure the breed belongs to the user making the request
    const pendingTask = await Beneficiary.findOne({ _id: id });

    if (!pendingTask) {
      return res.status(404).send({ error: "Task is not found" });
    }

    await Beneficiary.findOneAndUpdate({ _id: id }, updateData);

    // Return success response
    res.status(200).send({ status: "Task updated" });
  } catch (err) {
    
    res.status(500).send({ error: "Internal server error" });
  }
};

//------delete tasks------

const deleteTask = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  try {
    // Check if the profile exists
    const deletedTask = await Beneficiary.findOne({ _id: id });
    if (!deletedTask) {
      return res.status(404).json({ error: "profile not found" });
    }
    // Delete the profile
    await Beneficiary.findOneAndDelete({ _id: id });

    return res
      .status(200)
      .json({ message: "Task deleted successfully", deletedTask });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//fetch all cases for AG dash

const getAllCases = async (req, res) => {
  try {
    // get all the profile

    const cases = await Beneficiary.find();

    res.status(200).json({ cases });
  } catch (err) {
   
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employeeId = req?.params?.id;
   
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID required." });
    }

    const employee = await Employee.findOne({ eid: employeeId });
    if (!employee) {
      return res
        .status(404)
        .json({ message: `No employee matches ID ${employeeId}.` });
    }

    res.json(employee);
  } catch (error) {
    
    res.status(500).json({ message: "Failed to retrieve employee." });
  }
};

const getSubTasks = async (req, res) => {
  try {
    const employeeId = req?.params?.id;
    const sub = req?.params?.sid;
    if (!sub) {
      return res.status(400).json({ message: "subject required." });
    }

    const subtask = await Subject.findOne({ subject: sub });
    if (!subtask) {
      return res
        .status(404)
        .json({ message: `No employee matches ID ${employeeId}.` });
    }

    res.json(subtask);
  } catch (error) {
    
    res.status(500).json({ message: "Failed to retrieve employee." });
  }
};

const getTasks = async (req, res) => {
  const task = await Beneficiary.find();
  if (!task) return res.status(204).json({ message: "No forms found." });
  res.json(task);
};

module.exports = {
  caseRegister,
  getAllTasks,
  deleteTask,
  getTask,
  pendingUpdate,
  getEmployee,
  getSubTasks,
  getTasks,
  getAllCases,
};

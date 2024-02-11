const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Subject = require("../models/Subject");
const beneficiaryModel = require("../models/beneficiaryModel");

const getAllDepartment = async (req, res) => {
    const department = await Department.find();
    if (!department) return res.status(204).json({ 'message': 'No departments found.' });
    res.json(department);
}

const createNewDepartment = async (req, res) => {
    if (!req?.body?.did || !req?.body?.name ) {
        return res.status(400).json({ 'message': 'Please filled all fields' });
    }

    try {
        const result = await Department.create({
            did: req.body.did,
            name: req.body.name,
        });
        
        res.status(201).json(result);
    } catch (err) {
        
    }
}

const updateDepartment = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(203).json({ message: "ID parameter is required." });
  }

  try {
    const department = await Department.findOne({ _id: req.body.id }).exec();
    if (!department) {
      return res
        .status(404)
        .json({ message: `No department matches ID ${req.body.id}.` });
    }

    if (req.body.did === department.did && req.body.name === department.name) {
      return res
        .status(400)
        .json({ message: "No changes made to the department." });
    }

    await Employee.updateMany(
      { department: department.name },
      { department: req.body.name }
    );

    // Update beneficiaries
    await beneficiaryModel.updateMany(
      { division: department.name },
      { division: req.body.name }
    );

    // Update subjects
    await Subject.updateMany(
      { department: department.name },
      { department: req.body.name }
    );
    const existingDepartment = await Department.findOne({
      _id: { $ne: req.body.id },
      $or: [{ did: req.body.did }, { name: req.body.name }],
    }).exec();

    if (existingDepartment) {
      return res
        .status(409)
        .json({ message: "Department ID or Name is already used." });
    }

    if (req.body.did) department.did = req.body.did;
    if (req.body.name) department.name = req.body.name;

    const result = await department.save();

    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the department." });
  }
};

const deleteDepartment = async (req, res) => {
   
    if (!req.params.id) {
      return res.status(400).json({ message: 'Department ID required.' });
    }
  
    const department = await Department.findOne({ _id: req.params.id }).exec();
    if (!department) {
      return res.status(204).json({ message: `No department matches ID ${req.params.id}.` });
    }
  
    const result = await department.deleteOne();
    res.json(result);
  };
  
  

const getDepartment = async (req, res) => {
   
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Department ID required.' });

    const department = await Department.findOne({ _id: req.params.id }).exec();
    if (!department) {
        return res.status(204).json({ "message": `No department matches ID ${req.params.id}.` });
    }
    res.json(department);
}

module.exports = {
    getAllDepartment,
    createNewDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartment
}
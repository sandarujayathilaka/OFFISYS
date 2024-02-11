const User = require('../models/User');
const bcrypt = require('bcrypt');


const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
   
    const attributeValue = req.query.attribute;
    
    if (!attributeValue) {
        return res.status(400).json({ "message": 'Attribute value required' });
      }

    const user = await User.findOne({ username: attributeValue }).exec();
    
    if (!user) {
        return res.status(200).json({ 'message': `still not registered` });
    }
    const result = await user.deleteOne({ username: attributeValue });
    res.json(result);


}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}


const updateUser = async (req, res) => {
    const { eid } = req.params;
    const { confirmPwd , pwd, matchPwd } = req.body;
    if (!eid) {
      return res.status(400).json({ 'message': 'ID parameter is required.' });
    }
  
    const employee = await User.findOne({ username: eid });
    const match = await bcrypt.compare(confirmPwd, employee.password);

    if(match){
        if(pwd===matchPwd){
        const hashedPwd = await bcrypt.hash(pwd, 10);
        employee.password=hashedPwd;
        const result = await employee.save();
        res.json(result);
    }else{
         return res.status(405).json({ 'message': 'New and Re-password is not matched.' });
    }
}
else{
     return res.status(409).json({ 'message': 'Confirm password is not matched.' });
}
   
   
  };
module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUser
}
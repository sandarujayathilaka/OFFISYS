const User = require('../models/User');
const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');

const handleNewUser = async (req, res) => {
    const { user, pwd ,matchPwd} = req.body;
    if (!user || !pwd ) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); // Conflict
   
  const checking = await Employee.findOne({ eid: user }).exec();
  
    if (checking){ 
        if(pwd==matchPwd){

    try {

        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store the new user
        const result = await User.create({
            username: user,
            password: hashedPwd
        });

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}else{
    return res.sendStatus(401);
}
}else{
    return res.sendStatus(404); // Conflict
}

};

module.exports = { handleNewUser };

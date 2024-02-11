require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 8080



connectDB()

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());



// routes


app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/emp', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);

app.use('/users', require('./routes/api/users'));
app.use('/getUsers', require('./routes/api/users'));
app.use('/deleteUser', require('./routes/api/users'));
app.use('/updatepass', require('./routes/api/users'));


app.use("/task",require('./routes/api/beneficiaryRoutes'))
app.use("/dep", require("./routes/api/department"));
app.use("/employee", require("./routes/api/employees"));
app.use("/sub", require("./routes/api/subject"));



mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  const cron = require('node-cron');
  const deleteOldRecords = require('../backend/controller/autodelete');

  // Schedule the deletion task to run at your desired interval
  cron.schedule('0 0 * * *', deleteOldRecords); // Runs at midnight every day



  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

var nodemailer = require("nodemailer");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(402); //Unauthorized

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const foundEmployee = await Employee.findOne({ eid: user }).exec();
    const roles = foundEmployee.roles
      ? Object.values(foundEmployee.roles).filter(Boolean)
      : [];

    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({ user: user, roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};

const forget = async (req, res) => {
  const { user, pwd } = req.body;
  try {
    const emp = await Employee.findOne({ eid: user });
    const oldUser = await User.findOne({ username: user });

    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }

    const email = emp.email;

    const password = crypto.randomBytes(8).toString("hex"); // Generate a random password

    const encryptedPassword = await bcrypt.hash(password, 10);
    oldUser.password = encryptedPassword;
    const result = await oldUser.save();
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "offsys.pwchange@gmail.com",
        pass: "steeeeukszdwgnjy",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "offsys.pwchange@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Your new password is: ${password}. \nYou change login using this password and update new password using this as your current password. `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
      }
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleLogin, forget };

const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
const { sendEmail } = require("../../emailType/emailType");
const upload = require("../../multer/profilepic");
const {
  uploadOnCloudinary,
} = require("../../uploadonCloudinary/uploadOnCloudinary");
require("dotenv").config();
function generateRandomNumber() {
  const length = 50;
  let result = "";

  // Generate random digits until the desired length is reached
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
    result += randomDigit;
  }

  return result;
}

// Example usage:
const randomNum = generateRandomNumber();

function isEmailValid(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}
Router.post("/", upload.single("profilepic"), async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      fullname,
      bio,
      location,
      website,
      dob,
      gender,
      language,
      is_verified,
    } = req.body;

    const isEmail = isEmailValid(email);

    if (!isEmail) {
      return res.status(200).send({
        status: 5,
        msg: "Email is not valid.",
      });
    }
    const newUsername = username?.trim()?.toLowerCase();
    // Check if email or username already exist
    const isUserExist = await UserModel.findOne({
      $or: [{ email: email }, { username: newUsername }],
    });

    const profileLocalPath = req.file.path;

    const profile = await uploadOnCloudinary(profileLocalPath);

    if (!profile) {
      return res.status(200).send({
        status: 5,
        msg: "Profile is required.",
      });
    }
    if (!isUserExist) {
      const user = await UserModel.create({
        fullname: fullname,
        email: email,
        username: newUsername,
        password: password,
        profilepicture: profile?.url || "",
        coverpic: req.body.coverpic || "",
        bio: bio,
        location: location,
        website: website,
        dob: dob,
        gender: gender,
        language: language,
        isActivated: is_verified,
        activateToken: is_verified === true ? "" : randomNum,
      });
      is_verified === true
        ? sendEmail("account_opened", email, user.activateToken)
        : sendEmail("account_activation", email, user.activateToken);
      res.status(200).send({
        status: 1,
        msg: "Account created successfully.",
      });
    } else if (isUserExist.email === email) {
      res.status(200).send({
        status: 0,
        msg: "Email already exists.",
      });
    } else {
      res.status(200).send({
        status: 2,
        msg: "Username already exists.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 3,
      msg: "Server error. Please try again later.",
    });
  }
});

module.exports = Router;

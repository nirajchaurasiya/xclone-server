const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
const { sendEmail } = require("../../emailType/emailType");
Router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(200).send({
        msg: "Provide us an email!",
        status: 2,
      });
    }
    const isUserExist = await UserModel.findOne({ email: email });
    if (!isUserExist) {
      return res.status(200).send({
        msg: "Email doesn't exists!",
        status: 2,
      });
    }

    const activateToken = isUserExist.activateToken;

    if (!activateToken || isUserExist.isActivated) {
      return res.status(200).send({
        msg: "Token doesn't exists or user's account is already activated!",
        status: 2,
      });
    }

    await sendEmail("account_activation", email, activateToken);
    return res.status(200).send({
      msg: "Link sent!",
      status: 1,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
      status: 3,
    });
  }
});

module.exports = Router;

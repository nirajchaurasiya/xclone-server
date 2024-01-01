const Router = require("express").Router();

Router.use("/sendOTP", require("./sendOTP/sendOTP"));

Router.use(
  "/sendActivationLink",
  require("./sendActivationLink/sendActivationLink")
);
module.exports = Router;

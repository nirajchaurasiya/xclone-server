const Router = require("express").Router();
const UserModel = require("../Models/UserModel/UserModel");
const path = require("path");
Router.get("/:uemail/:token", async (req, res) => {
  try {
    const { uemail, token } = req.params;
    const findUser = await UserModel.findOne({ email: uemail });
    if (findUser) {
      const userToken = await findUser.activateToken;
      const isUserTokenAndProvidedTokenMatched =
        parseInt(userToken) === parseInt(token);
      if (isUserTokenAndProvidedTokenMatched) {
        await UserModel.findOneAndUpdate(
          { email: uemail },
          {
            $set: {
              isActivated: true,
              activateToken: "", // Clear the activation token
            },
          }
        );

        const successFile = path.resolve(__dirname, "activationsuccess.html");

        // Send the HTML file
        res.status(400).sendFile(successFile);
      } else {
        const tokennotmatched = path.resolve(__dirname, "tokennotmatched.html");

        // Send the HTML file
        res.status(400).sendFile(tokennotmatched);
      }
    } else {
      const couldntbefoundtheuser = path.resolve(
        __dirname,
        "couldntbefoundtheuser.html"
      );

      // Send the HTML file
      res.status(400).sendFile(couldntbefoundtheuser);
    }
  } catch (error) {
    const servererror = path.resolve(__dirname, "servererror.html");

    // Send the HTML file
    res.status(400).sendFile(servererror);
  }
});

module.exports = Router;

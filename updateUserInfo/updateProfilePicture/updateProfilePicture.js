const UserModel = require("../../Models/UserModel/UserModel");
const upload = require("../../multer/profilepic");
const {
  uploadOnCloudinary,
} = require("../../uploadonCloudinary/uploadOnCloudinary");

const Router = require("express").Router();

Router.put("/:id", upload.single("profilepicture"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(200).send({
        msg: "Id is invalid",
        status: 2,
      });
    }
    const isUserExist = await UserModel.findById(id);
    if (!isUserExist) {
      return res.status(200).send({
        msg: "Id is invalid",
        status: 2,
      });
    }
    const profilImage = await uploadOnCloudinary(req.file.path);
    if (!profilImage) {
      return res.status(200).send({
        msg: "Profile image is empty",
        status: 2,
      });
    }
    isUserExist.profilepicture = profilImage.url;
    isUserExist.save();
    return res.status(200).send({
      msg: "Updated Successfully!",
      status: 1,
      user: isUserExist,
    });
  } catch (error) {
    return res.status(500).send({
      status: 3,
      msg: "Internal server error!",
    });
  }
});

module.exports = Router;

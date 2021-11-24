const User = require("../models/userModel");
const Tinh = require("../models/tinhModel");
const Huyen = require("../models/huyenModel");
const Xa = require("../models/xaModel");
const Phuong = require("../models/phuongModel");
const sanitize = require("mongo-sanitize");
require("dotenv").config();



//sign-up controller
/* ding dang gui len
{user: {
  userName: 01 -> 2 so,
  password,
  name
}}
*/
signup_post = async (req, res) => {
  try {
    // lay du lieu tu node ben tren
    const parent = req.user;
    // kiem tra xem tai khoan co bi cam tu truoc ko
    await User.checkIsBanned(parent.userName);
    const { userName, password, name } = req.body.user;
    let tier = parent.tier;
    if (tier <= 3 && tier >= 0) {
      tier++;
    } else {
      throw new Error(
        "Tài khoản này không có đủ thẩm quyền để cấp tài khoản mới",
      );
    }
    // kiem tra tai khoan co hop le ko
    let sanitizedUserName = sanitize(userName);
    let sanitizedPassword = sanitize(password);
    let sanitizedName = sanitize(name);
    if (
      sanitizedUserName.length !== 2 ||
      !/^[0-9]*$/gi.test(sanitizedUserName)
    ) {
      throw new Error("Tài khoản không hợp lệ");
    }
    // kiem tra xem noi nay co ton tai ko
    let data;
    let finalName;
    if (parent.tier === 0) {
      finalName = sanitizedUserName;
    } else {
      finalName = parent.userName + sanitizedUserName;
    }
    // kiem tra co ton tai ko
    switch (tier) {
      case 1:
        data = await Tinh.findOne({ userName: finalName });
        break;
      case 2:
        data = await Huyen.findOne({ userName: finalName });
        break;
      case 3:
        data = await Xa.findOne({ userName: finalName });
        break;
      case 4:
        data = await Phuong.findOne({ userName: finalName });
        break;
    }

    if (!data) {
      throw new Error("Nơi này không tồn tại");
    }
    //tao tai khoan
    const user = await User.create({
      userName: finalName,
      password: sanitizedPassword,
      name: sanitizedName,
      tier,
    });
    res.status(201).json({
      user: _.pick(user, ["userName", "name", "tier", "isBanned"]),
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Tài khoản này đã được cấp trước đó" });
        return;
      }
    }
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
 
};

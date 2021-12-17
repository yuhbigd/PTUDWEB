const User = require("../models/userModel");
const Tinh = require("../models/tinhModel");
const Huyen = require("../models/huyenModel");
const Xa = require("../models/xaModel");
const To = require("../models/toModel");
const sanitize = require("mongo-sanitize");
const updateAnalyticsAfterDelete = require("../models/trigger_country/postDelete");
require("dotenv").config();

//lay danh sach cac don vi hanh chinh cap ngay duoi cap nguoi goi va thong ke cua chung
getCountry = async (req, res) => {
  try {
    const parent = req.user;
    const id = parent.userName;

    let countries;
    let cacheCountries;

    if (parent.tier === 0) {
      // lay data trong redis
      cacheCountries = JSON.parse(await redisClient.get("country:"));
      // neu khong co data -> tra ve
      if (cacheCountries) {
        countries = cacheCountries;
      } else {
        // ko co data trong redis -> query db
        countries = await Tinh.find({});
      }
    } else if (parent.tier < 4) {
      cacheCountries = JSON.parse(await redisClient.get(`country:${id}`));
      if (cacheCountries) {
        countries = cacheCountries;
      } else if (parent.tier === 1) {
        countries = await Huyen.find({
          id: { $regex: `^${id}`, $options: "i" },
        });
      } else if (parent.tier === 2) {
        countries = await Xa.find({
          id: { $regex: `^${id}`, $options: "i" },
        });
      } else if (parent.tier === 3) {
        countries = await To.find({
          id: { $regex: `^${id}`, $options: "i" },
        });
      }
    }

    if (!countries || _.isEmpty(countries)) {
      throw new Error("Không tìm thấy dữ liệu");
    }
    if (!cacheCountries) {
      if (parent.tier === 0) {
        redisClient.set("country:", JSON.stringify(countries));
        redisClient.expire("country:", 3600);
      } else if (parent.tier < 4) {
        redisClient.setEx(`country:${id}`, 3600, JSON.stringify(countries));
      }
    }
    res.status(200).json({
      data: countries,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//lay danh sach cac don vi hanh chinh cap duoi cua cap duoi dua tren id cua cap duoi
getCountryByParameter = async (req, res) => {
  try {
    // id cua cap duoi dc truyen dua tren parameter
    const paramId = sanitize(req.params.id);
    const parent = req.user;
    if (
      parent.tier !== 0 &&
      (parent.userName.length >= paramId.length ||
        paramId.indexOf(parent.userName) !== 0)
    ) {
      throw new Error(
        "Không đủ thẩm quyền để xem dữ liệu hoặc mã đơn vị không đúng định dạng",
      );
    }

    if (
      paramId.length > 8 ||
      paramId.length % 2 !== 0 ||
      !/^[0-9]*$/gi.test(paramId)
    ) {
      throw new Error("Id không đúng định dạng");
    }

    let tier = paramId.length / 2;
    let countries;
    // tim data trong cache dua tren paramId
    let cacheCountries = JSON.parse(
      await redisClient.get(`country:${paramId}`),
    );
    if (cacheCountries) {
      countries = cacheCountries;
    } else {
      // lay danh sach cac don vi hanh chinh nam ben duoi paramId (ma don vi) dua tren tier
      switch (tier) {
        case 1:
          countries = await Huyen.find({
            id: { $regex: `^${paramId}`, $options: "i" },
          });
          break;
        case 2:
          countries = await Xa.find({
            id: { $regex: `^${paramId}`, $options: "i" },
          });
          break;
        case 3:
          countries = await To.find({
            id: { $regex: `^${paramId}`, $options: "i" },
          });
          break;
        case 4:
          // ko co cai nao be hon cap To
          throw new Error("Không có đơn vị hành chính nào bé hơn");
      }
    }
    // neu khong tim thay don vi hanh chinh ben duoi trong db
    if (!countries || _.isEmpty(countries)) {
      throw new Error("Không tìm thấy dữ liệu (đơn vị này bị trống)");
    }
    // neu khong co trong cache thi luu vao trong cache
    if (!cacheCountries) {
      redisClient.setEx(`country:${paramId}`, 3600, JSON.stringify(countries));
    }
    res.status(200).json({
      data: countries,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//tao ra don vi hanh chinh ms controller
/* dinh dang gui len
{data: {
  id: 01 -> 2 so,
  name
}}
*/
postCountry = async (req, res) => {
  try {
    // lay du lieu tu node ben tren
    const parent = req.user;
    // kiem tra xem tai khoan co bi cam tu truoc ko
    await User.checkIsBanned(parent);
    const { id, name } = req.body.data;
    let tier = parent.tier;
    if (tier <= 3 && tier >= 0) {
      tier++;
    } else {
      throw new Error(
        "Tài khoản này không có đủ thẩm quyền để cấp mã đơn vị mới",
      );
    }
    // kiem tra tai khoan co hop le ko
    let sanitizedName = sanitize(name);
    let sanitizedId = sanitize(id);
    if (sanitizedId.length !== 2 || !/^[0-9]*$/gi.test(sanitizedId)) {
      throw new Error("Mã đơn vị không hợp lệ");
    }
    // kiem tra xem noi nay co ton tai ko
    let data;
    let finalName;
    if (parent.tier === 0) {
      finalName = sanitizedId;
    } else {
      finalName = parent.userName + sanitizedId;
    }
    // kiem tra co ton tai ko
    switch (tier) {
      case 1:
        data = await Tinh.create({ id: finalName, name: sanitizedName });
        break;
      case 2:
        data = await Huyen.create({
          id: finalName,
          name: sanitizedName,
          tinh: parent.userName,
        });
        break;
      case 3:
        data = await Xa.create({
          id: finalName,
          name: sanitizedName,
          huyen: parent.userName,
        });
        break;
      case 4:
        data = await To.create({
          id: finalName,
          name: sanitizedName,
          xa: parent.userName,
        });
        break;
    }
    if (!data) {
      throw new Error("Có lỗi đã xảy ra trên server");
    }
    //xoa cache cua parent de dam bao consistency va xoa cache children account cua parent account
    if (parent.tier === 0) {
      redisClient.DEL("country:");
      redisClient.DEL("account:");
      redisClient.DEL(`account::children`);
    } else {
      redisClient.DEL(`country:${parent.userName}`);
      redisClient.DEL(`account:${parent.userName}:children`);
      redisClient.DEL(`account:${parent.userName}`);
    }
    res.status(201).json({
      data: data,
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Mã này đã được cấp trước đó" });
        return;
      }
    }
    res.status(400).json({ error: error.message });
  }
};

//dinh dang data {data: {name: ""}}
putCountry = async (req, res) => {
  try {
    // id cua cap duoi dc truyen dua tren parameter
    const paramId = sanitize(req.params.id);
    const parent = req.user;
    await User.checkIsBanned(parent);
    const name = sanitize(req.body.data.name);
    if (
      paramId.length > 8 ||
      paramId.length % 2 !== 0 ||
      !/^[0-9]*$/gi.test(paramId) ||
      !name
    ) {
      throw new Error("Id không đúng định dạng");
    }
    if (
      parent.tier !== 0 &&
      (parent.userName.length >= paramId.length ||
        paramId.indexOf(parent.userName) !== 0)
    ) {
      throw new Error(
        "Không đủ thẩm quyền để thay đổi dữ liệu hoặc mã đơn vị không đúng định dạng",
      );
    }

    let tier = paramId.length / 2;
    let unit;
    // lay danh sach cac don vi hanh chinh nam ben duoi paramId (ma don vi) dua tren tier
    switch (tier) {
      case 1:
        unit = await Tinh.findOneAndUpdate(
          {
            id: paramId,
          },
          {
            $set: {
              name: name,
            },
          },
          {
            // For adding new user to be updated
            new: true,
            // upsert: true,
            // Active validating rules from Schema model when updating
            runValidators: true,
            context: "query",
          },
        );
        break;
      case 2:
        unit = await Huyen.findOneAndUpdate(
          {
            id: paramId,
          },
          {
            $set: {
              name: name,
            },
          },
          {
            // For adding new user to be updated
            new: true,
            // upsert: true,
            // Active validating rules from Schema model when updating
            runValidators: true,
            context: "query",
          },
        );
        break;
      case 3:
        unit = await Xa.findOneAndUpdate(
          {
            id: paramId,
          },
          {
            $set: {
              name: name,
            },
          },
          {
            // For adding new user to be updated
            new: true,
            // upsert: true,
            // Active validating rules from Schema model when updating
            runValidators: true,
            context: "query",
          },
        );
        break;
      case 4:
        unit = await To.findOneAndUpdate(
          {
            id: paramId,
          },
          {
            $set: {
              name: name,
            },
          },
          {
            // For adding new user to be updated
            new: true,
            // upsert: true,
            // Active validating rules from Schema model when updating
            runValidators: true,
            context: "query",
          },
        );
        break;
    }
    // neu khong tim thay don vi hanh chinh ben duoi trong db
    if (!unit || _.isEmpty(unit)) {
      throw new Error("Không tìm thấy dữ liệu (đơn vị này bị trống)");
    }
    // xoa cache de dam bao consistency
    // xoa cache children account cua parent account va
    // chinh account cua don vi duoc chinh sua

    let parentId = paramId.slice(0, -2);
    redisClient.DEL(`country:${parentId}`);
    redisClient.DEL(`account:${parentId}:children`);
    redisClient.DEL(`account:${paramId}`);

    res.status(200).json({
      data: unit,
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Mã này đã được cấp trước đó" });
        return;
      }
    }
    res.status(400).json({ error: error.message });
  }
};

deleteCountry = async (req, res) => {
  try {
    const paramId = sanitize(req.params.id);
    const parent = req.user;
    await User.checkIsBanned(parent);
    let parentId = parent.userName;
    if (parent.tier === 0) {
      parentId = "";
    }
    if (parentId.length >= paramId.length || paramId.indexOf(parentId) !== 0) {
      throw new Error(
        "Không đủ thẩm quyền để xóa dữ liệu hoặc mã đơn vị không đúng định dạng",
      );
    }
    if (
      paramId.length > 8 ||
      paramId.length % 2 !== 0 ||
      !/^[0-9]*$/gi.test(paramId)
    ) {
      throw new Error("Id không đúng định dạng");
    }
    let tier = paramId.length / 2;
    switch (tier) {
      case 1:
        data = await Tinh.findOneAndDelete({ id: paramId });
        break;
      case 2:
        data = await Huyen.findOneAndDelete({ id: paramId });
        break;
      case 3:
        data = await Xa.findOneAndDelete({ id: paramId });
        break;
      case 4:
        data = await To.findOneAndDelete({ id: paramId });
        break;
    }
    if (!data) {
      throw new Error("Không tìm thấy đơn vị này");
    }
    await updateAnalyticsAfterDelete(data);
    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCountry,
  getCountryByParameter,
  postCountry,
  putCountry,
  deleteCountry,
};

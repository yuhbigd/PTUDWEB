const User = require("../models/userModel");
const Tinh = require("../models/tinhModel");
const Huyen = require("../models/huyenModel");
const Xa = require("../models/xaModel");
const To = require("../models/toModel");
const TkCaNuoc = require("../models/tkCaNuocModel");
const sanitize = require("mongo-sanitize");
const moment = require("moment");
require("dotenv").config();
const CronJob = require("cron").CronJob;
const { promisify } = require("util");
//post account controller
/* dinh dang data can gui
{user: {
  userName: 01 -> 2 so,
  password,
  name,
  "userTimeOut":"2021-11-26" ||  "userTimeOut":""
}}
*/
account_post = async (req, res) => {
  try {
    // lay du lieu tu node ben tren
    const parent = req.user;
    // kiem tra xem tai khoan co bi cam tu truoc ko
    await User.checkIsBanned(parent);
    const { userName, password, name } = req.body.user;
    if (!userName || !password || !name) {
      throw new Error("Nhập thiếu môt trong các trường bắt buộc");
    }
    const userTimeOut = req.body.user.userTimeOut;
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
    let sanitizedPassword = sanitize(password).trim();
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
        data = await Tinh.findOne({ id: finalName });
        break;
      case 2:
        data = await Huyen.findOne({ id: finalName });
        break;
      case 3:
        data = await Xa.findOne({ id: finalName });
        break;
      case 4:
        data = await To.findOne({ id: finalName });
        break;
    }
    if (!data) {
      throw new Error("Nơi này không tồn tại");
    }

    // xoa cache parent children dam bao tinh consistency

    const parentId = finalName.slice(0, -2);
    redisClient.DEL(`account:${parentId}:children`);

    //tao tai khoan
    if (!userTimeOut) {
      const user = await User.create({
        userName: finalName,
        password: sanitizedPassword,
        name: sanitizedName,
        tier,
        userTimeOut: "",
      });
      res.status(201).json({
        user: _.pick(user, [
          "userName",
          "name",
          "tier",
          "isBanned",
          "userTimeOut",
        ]),
      });
    } else {
      const now = moment();
      const timeout = moment(userTimeOut, "YYYY-MM-DD").set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      const diff = timeout.diff(now);

      if (diff <= 0) {
        throw new Error(
          "Ngày bạn cho phép đã và đang qua, vui lòng chọn ngày khác trong tương lai",
        );
      }
      const user = await User.create({
        userName: finalName,
        password: sanitizedPassword,
        name: sanitizedName,
        tier,
        userTimeOut: timeout,
      });
      res.status(201).json({
        user: _.pick(user, [
          "userName",
          "name",
          "tier",
          "isBanned",
          "userTimeOut",
        ]),
      });
    }
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

// goi db thay doi thuoc tinh cua account
async function updateUser(paramId, data) {
  return await User.findOneAndUpdate(
    {
      userName: paramId,
    },
    {
      $set: data,
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
}

account_put = async (req, res) => {
  try {
    const paramId = sanitize(req.params.id);
    const parent = req.user;
    await User.checkIsBanned(parent);
    if (
      paramId.length > 8 ||
      paramId.length % 2 !== 0 ||
      !/^[0-9]*$/gi.test(paramId)
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

    let user;
    let data = req.body.data;
    let tempUser = {};

    // check lan luot tung property co trong data va them vao update obj
    if (_.isString(data.password)) {
      if (data.password) {
        let sanitizePass = sanitize(data.password).trim();
        tempUser.password = sanitizePass;
      }
    }
    if (_.isString(data.name)) {
      if (data.name) {
        let sanitizeName = sanitize(data.name).trim();
        tempUser.name = sanitizeName;
      }
    }
    if (_.isString(data.userTimeOut)) {
      if (data.userTimeOut) {
        let userTimeOut = moment(data.userTimeOut.trim(), "YYYY-MM-DD").set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
        const now = moment();
        const diff = userTimeOut.diff(now);
        if (diff <= 0) {
          throw new Error(
            "Ngày bạn cho phép đã và đang qua, vui lòng chọn ngày khác trong tương lai",
          );
        }
        tempUser.userTimeOut = userTimeOut;
      }
    }
    if (_.isBoolean(data.isBanned)) {
      if (data.isBanned) {
        tempUser.isBanned = data.isBanned;
        tempUser.userTimeOut = "";
      } else {
        tempUser.isBanned = data.isBanned;
      }
    }
    user = await updateUser(paramId, tempUser);
    if (!user) {
      throw new Error("Không tìm thấy tài khoản này");
    }
    let obj = _.pick(user, [
      "userName",
      "name",
      "tier",
      "isBanned",
      "userTimeOut",
    ]);
    if (data.password) {
      obj.password = data.password.trim();
    }
    // xoa cache cua account va parent account de dam bao tinh consistency

    redisClient.DEL(`account:${paramId}`);
    // vi admin co username !== id cua don vi
    let parentId = paramId.slice(0, -2);
    redisClient.DEL(`account:${parentId}:children`);

    res.status(201).json({
      user: obj,
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
// cron job
const checkUserTimeOut = new CronJob(
  "0 0 * * *",
  async function () {
    let now = moment();
    await User.updateMany(
      {
        $and: [
          {
            userTimeOut: { $ne: null },
          },
          {
            isBanned: false,
          },
          {
            userTimeOut: { $lte: now },
          },
        ],
      },
      {
        $set: {
          userTimeOut: "",
          isBanned: true,
        },
      },
    );
  },
  null,
  true,
  "Etc/GMT-7",
);
checkUserTimeOut.start();

async function getChildrenAndUnitOfIt(parentUsername, foreignCollection) {
  return await User.aggregate([
    {
      $match: {
        $and: [
          {
            userName: {
              $regex: `^${parentUsername}[0-9][0-9]$`,
              $options: "g",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: `${foreignCollection}`,
        localField: "userName",
        foreignField: "id",
        as: "unit",
      },
    },
    {
      $project: {
        userName: 1,
        tier: 1,
        name: 1,
        userTimeOut: 1,
        isBanned: 1,
        unit: 1,
      },
    },
  ]);
}
async function getChildAndUnitOfIt(paramId, foreignCollection) {
  return await User.aggregate([
    {
      $match: {
        $and: [
          {
            userName: paramId,
          },
        ],
      },
    },
    {
      $lookup: {
        from: `${foreignCollection}`,
        localField: "userName",
        foreignField: "id",
        as: "unit",
      },
    },
    {
      $project: {
        userName: 1,
        tier: 1,
        name: 1,
        userTimeOut: 1,
        isBanned: 1,
        unit: 1,
      },
    },
  ]);
}

account_get = async (req, res) => {
  try {
    const user = req.user;
    let unit;
    let userCache;
    if (user.tier > 0) {
      let userName = user.userName;
      let tier = user.tier;
      // tim cache cua account
      userCache = JSON.parse(await redisClient.GET(`account:${userName}`));
      if (userCache) {
        unit = userCache;
      } else {
        switch (tier) {
          case 1:
            unit = await Tinh.findOne({ id: userName });
            break;
          case 2:
            unit = await Huyen.findOne({ id: userName });
            break;
          case 3:
            unit = await Xa.findOne({ id: userName });
            break;
          case 4:
            unit = await To.findOne({ id: userName });
            break;
        }
      }
      if (!unit) {
        throw new Error("Không tìm thấy thông tin của đơn vị này");
      }
      if (userCache) {
        // neu co cache thi tra ve
        res.status(200).json(unit);
        return;
      } else {
        // tim trong db neu ko co cache
        let returnUser = {
          user: _.pick(user, [
            "userName",
            "name",
            "tier",
            "isBanned",
            "userTimeOut",
          ]),
        };
        returnUser.user.unit = [unit];
        redisClient.setEx(
          `account:${userName}`,
          3600,
          JSON.stringify(returnUser),
        );
        res.status(200).json(returnUser);
        return;
      }
    } else if (user.tier === 0) {
      userCache = JSON.parse(await redisClient.GET(`account:`));
      if (userCache) {
        unit = userCache;
        res.status(200).json(unit);
      } else {
        unit = await TkCaNuoc.findOne({ id: "0" });
        let returnUser = {
          user: _.pick(user, [
            "userName",
            "name",
            "tier",
            "isBanned",
            "userTimeOut",
          ]),
        };
        returnUser.user.unit = [unit];
        redisClient.setEx(`account:`, 3600, JSON.stringify(returnUser));
        res.status(200).json(returnUser);
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//children
account_getChildren = async (req, res) => {
  try {
    const user = req.user;
    let children;

    let userName = user.userName;
    let tier = user.tier;
    let childrenCache;
    if (tier === 0) {
      childrenCache = JSON.parse(await redisClient.GET(`account::children`));
    } else {
      childrenCache = JSON.parse(
        await redisClient.GET(`account:${userName}:children`),
      );
    }
    if (childrenCache) {
      children = childrenCache;
    } else {
      switch (tier) {
        case 0:
          children = await getChildrenAndUnitOfIt("", "tinhs");
          break;
        case 1:
          children = await getChildrenAndUnitOfIt(userName, "huyens");
          break;
        case 2:
          children = await getChildrenAndUnitOfIt(userName, "xas");
          break;
        case 3:
          children = await getChildrenAndUnitOfIt(userName, "tos");
          break;
        case 4:
          throw new Error("Bạn không có đơn vị hành chính cấp dưới");
      }
    }
    if (!children || _.isEmpty(children)) {
      throw new Error(
        "Không tìm thấy thông tin của đơn vị này hoặc đơn vị này không có đơn vị con",
      );
    }

    if (!childrenCache) {
      // neu khong co cache cua account children
      let data = {
        data: children,
      };
      if (tier > 0) {
        await redisClient.setEx(
          `account:${userName}:children`,
          3600,
          JSON.stringify(data),
        );
      } else {
        // tier 0 la dac biet vi no co username ko phai la id cua don vi hanh chinh
        await redisClient.setEx(
          `account::children`,
          3600,
          JSON.stringify(data),
        );
      }
      res.status(200).json(data);
      return;
    }
    res.status(200).json(childrenCache);
    return;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// children/:id
account_getChild = async (req, res) => {
  try {
    const parent = req.user;
    const paramId = sanitize(req.params.id);
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
    let child;
    let cachedChild = JSON.parse(await redisClient.GET(`account:${paramId}`));
    if (cachedChild) {
      res.status(200).json(cachedChild);
      return;
    }
    switch (tier) {
      case 1:
        child = await getChildAndUnitOfIt(paramId, "tinhs");
        break;
      case 2:
        child = await getChildAndUnitOfIt(paramId, "huyens");
        break;
      case 3:
        child = await getChildAndUnitOfIt(paramId, "xas");
        break;
      case 4:
        child = await getChildAndUnitOfIt(paramId, "tos");
        break;
      default:
        break;
    }
    if (!child || _.isEmpty(child)) {
      throw new Error(
        "Không tìm thấy thông tin của đơn vị này hoặc đơn vị này không có đơn vị con",
      );
    }
    let data = {
      data: child,
    };
    if (!cachedChild) {
      await redisClient.setEx(`account:${paramId}`, 3600, JSON.stringify(data));
    }
    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//children/:id/children
account_getChildrenOfChild = async (req, res) => {
  try {
    const parent = req.user;
    const paramId = sanitize(req.params.id);
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
    let children;
    let cachedChildren = JSON.parse(
      await redisClient.get(`account:${paramId}:children`),
    );
    if (cachedChildren) {
      res.status(200).json(cachedChildren);
      return;
    }
    switch (tier) {
      case 1:
        children = await getChildrenAndUnitOfIt(paramId, "huyens");
        break;
      case 2:
        children = await getChildrenAndUnitOfIt(paramId, "xas");
        break;
      case 3:
        children = await getChildrenAndUnitOfIt(paramId, "tos");
        break;
      default:
        break;
    }
    if (!children || _.isEmpty(children)) {
      throw new Error(
        "Không tìm thấy thông tin của đơn vị này hoặc đơn vị này không có đơn vị con",
      );
    }
    let data = {
      data: children,
    };
    if (!cachedChildren) {
      await redisClient.setEx(
        `account:${paramId}:children`,
        3600,
        JSON.stringify(data),
      );
    }
    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//cai nay de cuoi lam
//
//
account_delete = async (req, res) => {
  let parent = req.user;
  let subUser = await getChildrenAndUnitOfIt("", "tinhs");
  res.json({
    subUser,
  });
};
module.exports = {
  account_post,
  account_put,
  account_delete,
  account_get,
  account_getChildren,
  account_getChild,
  account_getChildrenOfChild,
};

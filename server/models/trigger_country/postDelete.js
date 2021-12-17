const Tinh = require("../tinhModel");
const Huyen = require("../huyenModel");
const Xa = require("../xaModel");
const To = require("../toModel");
const TkCaNuoc = require("../tkCaNuocModel");
const User = require("../userModel");
const Resident = require("../nguoiDanModel");
const pickArray = [
  "soDan",
  "soNam",
  "soNu",
  "nhoHon15",
  "tu15_64",
  "hon64",
  "daKetHon",
  "chuaKetHon",
  "lyHon",
  "danToc",
  "quocTich",
  "tonGiao",
];
function setUpdateData(parent, unit) {
  // khong can deep clone vi sau ham nay thi khong can dung nua
  let result = _.pick(parent, pickArray);
  let changeData = _.pick(unit, pickArray);
  Object.keys(changeData).forEach((key) => {
    if (!_.isObject(changeData[key])) {
      result[key] -= changeData[key];
    } else {
      Object.keys(changeData[key]).forEach((childKey) => {
        result[key][childKey] -= changeData[key][childKey];
      });
    }
  });
  return result;
}
function deleteRedis(id) {
  return [
    redisClient.DEL(`country:${id}`),
    redisClient.DEL(`account:${id}`),
    redisClient.DEL(`resident:analytics:${id}`),
    redisClient.DEL(`account:${id}:children`),
  ];
}

async function deleteChildrenNode(id) {
  let tier = id.length / 2;
  if (tier < 2) {
    // tier < 2-> xoa huyen co id bat dau = id
    await Huyen.deleteMany({
      id: { $regex: id + ".*", $options: "i" },
    });
  }
  if (tier < 3) {
    // tier < 3 -> tier 1 ,2 -> xoa Xa
    await Xa.deleteMany({
      id: { $regex: id + ".*", $options: "i" },
    });
  }
  if (tier < 4) {
    // tier < 3 -> tier 1 ,2,3 -> xoa To
    await To.deleteMany({
      id: { $regex: id + ".*", $options: "i" },
    });
  }
  await User.deleteMany({
    userName: { $regex: id + ".*", $options: "i" },
  });
  // delete redis
  for await (const key of redisClient.scanIterator({
    TYPE: "string", // `SCAN` only
    MATCH: `*:${id}*`,
  })) {
    await redisClient.DEL(key);
  }
}
async function updateAnalyticsAfterDelete(unit) {
  const n = unit.id.length / 2;
  // update cac thong ke cua cac node ben tren dua tren node bi xoa
  for (let i = 1; i <= n; i++) {
    let parentId = unit.id.slice(0, -2 * i);
    let tier = parentId.length / 2;
    switch (tier) {
      case 0:
        let caNuoc = await TkCaNuoc.findOne({ id: "0" }).select({ _id: 0 });
        let updateData = setUpdateData(caNuoc, unit);
        if (i === 1) {
          updateData.count = caNuoc.count - 1;
        }
        await TkCaNuoc.updateOne(
          {
            id: "0",
          },
          {
            $set: updateData,
          },
        );
        await Promise.all(deleteRedis(""));
        break;
      case 1: {
        let tinh = await Tinh.findOne({ id: parentId }).select({ _id: 0 });
        if (i === 1) {
          updateData.count = tinh.count - 1;
        }
        let updateData = setUpdateData(tinh, unit);
        await Tinh.updateOne(
          { id: parentId },
          {
            $set: updateData,
          },
        );
        break;
      }
      case 2: {
        let huyen = await Huyen.findOne({ id: parentId }).select({ _id: 0 });
        let updateData = setUpdateData(huyen, unit);
        if (i === 1) {
          updateData.count = huyen.count - 1;
        }
        await Huyen.updateOne(
          { id: parentId },
          {
            $set: updateData,
          },
        );
        break;
      }
      case 3: {
        let xa = await Xa.findOne({ id: parentId }).select({ _id: 0 });
        let updateData = setUpdateData(xa, unit);
        if (i === 1) {
          updateData.count = xa.count - 1;
        }
        await Xa.updateOne(
          { id: parentId },
          {
            $set: updateData,
          },
        );
        break;
      }
    }
    if (tier > 0) {
      await Promise.all(deleteRedis(parentId));
    }
  }
  // xoa cac node ben duoi va redis cua no
  await deleteChildrenNode(unit.id);
  // xoa cac nguoi dan
  await Resident.deleteMany({
    noiKhai: { $regex: unit.id + ".*", $options: "i" },
  });
}
module.exports = updateAnalyticsAfterDelete;

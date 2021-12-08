const User = require("../models/userModel");
const Tinh = require("../models/tinhModel");
const Huyen = require("../models/huyenModel");
const Xa = require("../models/xaModel");
const To = require("../models/toModel");
const Resident = require("../models/nguoiDanModel");
const sanitize = require("mongo-sanitize");
const moment = require("moment");
const TkCaNuoc = require("../models/tkCaNuocModel");
const postUpdate = require("../models/trigger_resident/postUpdate");
require("dotenv").config();

postResident = async (req, res) => {
  try {
    // lay du lieu tu node ben tren
    const user = req.user;
    // kiem tra xem tai khoan co bi cam tu truoc ko
    await User.checkIsBanned(user);
    const userId = user.userName;
    const userTier = user.tier;
    if (userTier < 4) {
      throw new Error("Hãy để tier 4 làm việc này");
    }
    const data = req.body.data;
    const {
      hoTen,
      ngaySinh,
      gioiTinh,
      nhomMau,
      honNhan,
      noiDangKyKhaiSinh,
      queQuan,
      danToc,
      quocTich,
      tonGiao,
      soCCCD,
      noiThuongTru,
      noiOHienTai,
      tenCha,
      tenMe,
      soCCCDMe,
      soCCCDCha,
      quocTichCha,
      quocTichMe,
      tenVoChong,
      cccdVoChong,
      quocTichVoChong,
      daiDienHopPhap,
      quocTichDaiDienHopPhap,
      cccdDaiDienHopPhap,
      tenChuHo,
      quanHeVoiChuHo,
      soHoKhau,
    } = data;

    let dataInsert = {
      hoTen: sanitize(hoTen),
      ngaySinh: moment(sanitize(ngaySinh), "YYYY-MM-DD"),
      gioiTinh: sanitize(gioiTinh),
      nhomMau: sanitize(nhomMau),
      honNhan: sanitize(honNhan),
      noiDangKyKhaiSinh: sanitize(noiDangKyKhaiSinh),
      queQuan: sanitize(queQuan),
      danToc: sanitize(danToc),
      quocTich: sanitize(quocTich),
      tonGiao: sanitize(tonGiao),
      noiThuongTru: sanitize(noiThuongTru),
      noiOHienTai: sanitize(noiOHienTai),
      tenCha: sanitize(tenCha),
      tenMe: sanitize(tenMe),
      soCCCDMe: sanitize(soCCCDMe),
      soCCCDCha: sanitize(soCCCDCha),
      quocTichCha: sanitize(quocTichCha),
      quocTichMe: sanitize(quocTichMe),
      tenVoChong: sanitize(tenVoChong),
      cccdVoChong: sanitize(cccdVoChong),
      quocTichVoChong: sanitize(quocTichVoChong),
      daiDienHopPhap: sanitize(daiDienHopPhap),
      quocTichDaiDienHopPhap: sanitize(quocTichDaiDienHopPhap),
      cccdDaiDienHopPhap: sanitize(cccdDaiDienHopPhap),
      tenChuHo: sanitize(tenChuHo),
      quanHeVoiChuHo: sanitize(quanHeVoiChuHo),
      soHoKhau: sanitize(soHoKhau),
      noiKhai: userId,
    };
    if (sanitize(soCCCD)) {
      dataInsert.soCCCD = sanitize(soCCCD);
    }
    const resident = await Resident.create(dataInsert);
    if (!resident) {
      throw new Error("Có lỗi xảy ra trên server");
    }
    res.json({
      data: resident,
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Người này đã khai trước đó" });
        return;
      }
    }
    res.status(400).json({ error: error.message });
  }
};

// lay thong ke hoac thong tin cua nguoi dan
getAllResidents = async (req, res) => {
  try {
    const user = req.user;
    let id = user.userName;
    if (user.tier === 0) {
      id = "";
    }
    const query = req.query;
    const searchString = query.searchString || "";
    const isCount = query.isCount;
    const detail = query.detail;

    if (isCount === "1" && detail === "1") {
      const countDocument = await Resident.count({
        $and: [
          { noiKhai: { $regex: id + ".*", $options: "i" } },
          {
            $or: [
              {
                hoTen: { $regex: ".*" + searchString + ".*", $options: "i" },
              },
              {
                soCCCD: { $regex: ".*" + searchString + ".*", $options: "i" },
              },
            ],
          },
        ],
      }).exec();

      res.status(200).json({
        count: countDocument,
      });
      return;
    }

    //lay thong tin thong ke cua don vi nay
    if (detail !== "1") {
      let cache;
      cache = JSON.parse(await redisClient.get(`resident:analytics:${id}`));
      if (cache) {
        return res.status(200).json(cache);
      } else {
        let unit;
        switch (user.tier) {
          case 0: //co the co loi
            unit = await TkCaNuoc.findOne({ id: "0" }).select({
              name: 0,
            });
            break;
          case 1:
            unit = await Tinh.findOne({ id: id }).select({
              name: 0,
            });
            break;
          case 2:
            unit = await Huyen.findOne({ id: id }).select({
              name: 0,
            });
            break;
          case 3:
            unit = await Xa.findOne({ id: id }).select({
              name: 0,
            });
            break;
          case 4:
            unit = await To.findOne({ id: id }).select({
              name: 0,
            });
            break;
        }
        if (!unit) {
          throw new Error("Không tìm thấy đơn vị này");
        }
        let returnData = {
          data: unit,
        };
        await redisClient.setEx(
          `resident:analytics:${id}`,
          3600,
          JSON.stringify(returnData),
        );
        res.status(200).json(returnData);
      }
    }
    // lay thong tin cua cac nguoi dan
    else {
      const pageNum = parseInt(query.pageNum) - 1 || 0;
      const numPerPage = parseInt(query.numPerPage) || 10;
      const skip = pageNum * numPerPage;
      let orderBy = {};
      if (query.order) {
        if (query.direction) {
          if (query.direction === "desc") {
            orderBy[query.order] = -1;
          } else if (query.direction === "asc") {
            orderBy[query.order] = 1;
          } else {
            throw new Error("?");
          }
        }
      }
      if (_.isEmpty(orderBy) || !orderBy._id) {
        // xep theo thoi diem them giam dan
        orderBy._id = -1;
      }
      const residents = await Resident.find({
        $and: [
          { noiKhai: { $regex: id + ".*", $options: "i" } },
          {
            $or: [
              {
                hoTen: { $regex: ".*" + searchString + ".*", $options: "i" },
              },
              {
                soCCCD: { $regex: ".*" + searchString + ".*", $options: "i" },
              },
            ],
          },
        ],
      })
        .sort(orderBy)
        .skip(skip)
        .limit(numPerPage)
        .exec();
      if (!residents || _.isEmpty(residents)) {
        res.status(200).json({
          message: "Không thể tìm thấy người dân nào",
        });
        return;
      }
      res.status(200).json({
        data: residents,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

getResident = async (req, res) => {
  try {
    const user = req.user;
    let id = user.userName;
    if (user.tier === 0) {
      id = "";
    }
    const resident_id = req.params.id;

    const resident = await Resident.findOne({
      $and: [
        { noiKhai: { $regex: id + ".*", $options: "i" } },
        {
          _id: resident_id,
        },
      ],
    }).exec();
    if (!resident) {
      throw new Error("id không chính xác");
    }
    res.status(200).json({
      data: resident,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function preUpdate(resident, data) {
  if (data.ngaySinh || data.hoTen || data._id) {
    throw new Error("Không thể cập nhật những trường này");
  }
  if (data.tenChuHo || data.quanHeVoiChuHo || data.soHoKhau) {
    if (!(resident.tenChuHo && resident.quanHeVoiChuHo && resident.soHoKhau)) {
      if (!data.tenChuHo || !data.quanHeVoiChuHo || !data.soHoKhau) {
        throw new Error("phần hộ khẩu không thể bỏ trống");
      }
    }
  }
  if (data.honNhan) {
    if (
      resident.honNhan.normalize("NFC") === "Chưa kết hôn".normalize("NFC") &&
      data.honNhan !== "Chưa kết hôn"
    ) {
      let yearDiff = moment().diff(resident.ngaySinh, "years", false);
      if (yearDiff < 18) {
        if (data.honNhan.normalize("NFC") !== "Chưa kết hôn".normalize("NFC")) {
          throw new Error("chưa được 18 tuổi kết hôn cái gì vậy trời");
        }
      }
    } else if (data.honNhan === "Đã kết hôn") {
      if (!data.tenVoChong || !data.cccdVoChong || !data.quocTichVoChong) {
        throw new Error("Hãy nhập đủ các trường liên quan đến kết hôn");
      }
    } else if (data.honNhan === "Chưa kết hôn") {
      if (resident.honNhan !== "Chưa kết hôn") {
        throw new Error(
          "Đã ly hôn hoặc đã kết hôn thì không thể là chưa kết hôn",
        );
      }
    }
  }
  if (data.tenVoChong || data.cccdVoChong || data.quocTichVoChong) {
    let yearDiff = moment().diff(resident.ngaySinh, "years", false);
    if (yearDiff < 18) {
      throw new Error("chưa được 18 tuổi kết hôn cái gì vậy trời");
    }
    if (resident.honNhan === "Đã kết hôn") {
      if (!data.tenVoChong || !data.cccdVoChong || !data.quocTichVoChong) {
        throw new Error("Hãy nhập đủ các trường liên quan đến kết hôn");
      }
    } else if (resident.honNhan === "Ly hôn") {
      if (data.tenVoChong || data.cccdVoChong || data.quocTichVoChong) {
        throw new Error("Ly hôn thì cập nhật làm gì vậy?");
      }
    }
  }
}

putResident = async (req, res) => {
  try {
    const user = req.user;
    let id = user.userName;
    if (user.tier === 0) {
      id = "";
    }
    const resident_id = req.params.id;

    let data = _.pick(req.body.data, [
      "hoTen",
      "ngaySinh",
      "gioiTinh",
      "nhomMau",
      "honNhan",
      "noiDangKyKhaiSinh",
      "queQuan",
      "danToc",
      "quocTich",
      "tonGiao",
      "soCCCD",
      "noiThuongTru",
      "noiOHienTai",
      "tenCha",
      "tenMe",
      "soCCCDMe",
      "soCCCDCha",
      "quocTichCha",
      "quocTichMe",
      "tenVoChong",
      "cccdVoChong",
      "quocTichVoChong",
      "daiDienHopPhap",
      "quocTichDaiDienHopPhap",
      "cccdDaiDienHopPhap",
      "tenChuHo",
      "quanHeVoiChuHo",
      "soHoKhau",
    ]);
    Object.filter = (obj, predicate) =>
      Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});
    data = Object.filter(data, (value) => {
      return !!value;
    });
    const resident = await Resident.findOne({
      $and: [
        { noiKhai: { $regex: id + ".*", $options: "i" } },
        {
          _id: resident_id,
        },
      ],
    }).exec();
    if (!resident) {
      throw new Error("id không chính xác");
    }
    preUpdate(resident, data);
    let dataNeedToRemove = getDataNeedToRemove([resident])[resident.noiKhai];
    const newResident = await Resident.findOneAndUpdate(
      {
        $and: [
          { noiKhai: { $regex: id + ".*", $options: "i" } },
          {
            _id: resident_id,
          },
        ],
      },
      {
        $set: data,
      },
      { runValidators: true, new: true },
    ).exec();
    await postUpdate(newResident, dataNeedToRemove);
    res.status(200).json({
      data: newResident,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Trùng số căn cước công dân" });
      return;
    }
    res.status(400).json({ error: error.message });
  }
};

async function getAnalytics(userId, id, tier) {
  if (userId.length >= id.length || id.indexOf(userId) !== 0) {
    throw new Error(
      "Không đủ thẩm quyền để xem dữ liệu hoặc mã đơn vị không đúng định dạng",
    );
  }

  if (id.length > 8 || id.length % 2 !== 0 || !/^[0-9]*$/gi.test(id)) {
    throw new Error("Id không đúng định dạng");
  }

  cache = JSON.parse(await redisClient.get(`resident:analytics:${id}`));
  if (cache) {
    return cache.data;
  } else {
    let unit;
    switch (tier) {
      case 1:
        unit = await Tinh.findOne({ id: id }).select({
          name: 0,
        });
        break;
      case 2:
        unit = await Huyen.findOne({ id: id }).select({
          name: 0,
        });
        break;
      case 3:
        unit = await Xa.findOne({ id: id }).select({
          name: 0,
        });
        break;
      case 4:
        unit = await To.findOne({ id: id }).select({
          name: 0,
        });
        break;
    }
    if (!unit) {
      throw new Error("Không tìm thấy dữ liệu");
    }
    await redisClient.setEx(
      `resident:analytics:${id}`,
      3600,
      JSON.stringify({ data: unit }),
    );
    return unit;
  }
}
function getNoiKhaiArray(userId, arrayId) {
  let arrayIdFiltered = arrayId.filter((id) => {
    if (userId.length >= id.length || id.indexOf(userId) !== 0) {
      throw new Error(
        "Không đủ thẩm quyền để xem dữ liệu hoặc mã đơn vị không đúng định dạng",
      );
    }

    if (id.length > 8 || id.length % 2 !== 0 || !/^[0-9]*$/gi.test(id)) {
      throw new Error("Id không đúng định dạng");
    }
    return true;
  });
  return arrayIdFiltered.map((id) => {
    return { noiKhai: { $regex: id + ".*", $options: "i" } };
  });
}
getChildrenResidents = async (req, res) => {
  try {
    const user = req.user;
    let id = user.userName;
    if (user.tier === 0) {
      id = "";
    }
    const query = req.query;
    const searchString = query.searchString || "";
    const isCount = query.isCount;
    const detail = query.detail;
    let children;
    if (req.body.data) {
      children = req.body.data.children;
    }
    if (children && !_.isEmpty(children)) {
      // xoa phan tu trung
      children = children.filter(function (item, pos) {
        return children.indexOf(item) == pos;
      });
      // lay thong ke
      if (detail !== "1") {
        // xong phan lay analystics tu mang can phai co them khi array null va lay dan so nua
        let array = await Promise.all(
          children.map((item) => {
            return getAnalytics(id, item, item.length / 2);
          }),
        );
        res.status(200).json({ data: array });
      } else {
        let noiKhaiArray = getNoiKhaiArray(id, children);
        if (isCount === "1") {
          // lay tong so dan phu hop voi searchString
          const countDocument = await Resident.count({
            $and: [
              {
                $or: [
                  {
                    hoTen: {
                      $regex: ".*" + searchString + ".*",
                      $options: "i",
                    },
                  },
                  {
                    soCCCD: {
                      $regex: ".*" + searchString + ".*",
                      $options: "i",
                    },
                  },
                ],
              },
              {
                $or: noiKhaiArray,
              },
            ],
          }).exec();

          res.status(200).json({
            count: countDocument,
          });
          return;
        } else {
          const pageNum = parseInt(query.pageNum) - 1 || 0;
          const numPerPage = parseInt(query.numPerPage) || 10;
          const skip = pageNum * numPerPage;
          let orderBy = {};
          if (query.order) {
            if (query.direction) {
              if (query.direction === "desc") {
                orderBy[query.order] = -1;
              } else if (query.direction === "asc") {
                orderBy[query.order] = 1;
              } else {
                throw new Error("?");
              }
            }
          }
          if (_.isEmpty(orderBy) || !orderBy._id) {
            // xep theo thoi diem them giam dan
            orderBy._id = -1;
          }
          const residents = await Resident.find({
            $and: [
              { $or: noiKhaiArray },
              {
                $or: [
                  {
                    hoTen: {
                      $regex: ".*" + searchString + ".*",
                      $options: "i",
                    },
                  },
                  {
                    soCCCD: {
                      $regex: ".*" + searchString + ".*",
                      $options: "i",
                    },
                  },
                ],
              },
            ],
          })
            .sort(orderBy)
            .skip(skip)
            .limit(numPerPage)
            .exec();
          if (!residents || _.isEmpty(residents)) {
            res.status(200).json({
              message: "Không thể tìm thấy người dân nào",
            });
            return;
          }
          res.status(200).json({
            data: residents,
          });
        }
      }
    } else {
      // khi ko co children array
      if (detail === "1") {
        // lay tat ca cac ng dan trong don vi
        return getAllResidents(req, res);
      } else {
        // lay cac con trong don vi
        return getCountry(req, res);
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
function getDataNeedToRemove(residents) {
  let residentsId = {};
  for (let resident of residents) {
    residentsId[resident.noiKhai] = {
      soDan: 0,
      soNam: 0,
      soNu: 0,
      nhoHon15: 0,
      tu15_64: 0,
      hon64: 0,
      daKetHon: 0,
      chuaKetHon: 0,
      lyHon: 0,
      danToc: {},
      quocTich: {},
      tonGiao: {},
      nhomMau: {},
    };
  }
  residents.forEach((resident) => {
    residentsId[resident.noiKhai].soDan -= 1;
    let yearDiff = moment().diff(resident.ngaySinh, "years", false);
    if (yearDiff < 15) {
      residentsId[resident.noiKhai].nhoHon15 -= 1;
    } else if (yearDiff > 64) {
      residentsId[resident.noiKhai].hon64 -= 1;
    } else {
      residentsId[resident.noiKhai].tu15_64 -= 1;
    }
    if (resident.honNhan.normalize("NFC") === "Đã kết hôn".normalize("NFC")) {
      residentsId[resident.noiKhai].daKetHon -= 1;
    } else if (
      resident.honNhan.normalize("NFC") === "Chưa kết hôn".normalize("NFC")
    ) {
      residentsId[resident.noiKhai].chuaKetHon -= 1;
    } else if (
      resident.honNhan.normalize("NFC") === "Ly hôn".normalize("NFC")
    ) {
      residentsId[resident.noiKhai].lyHon -= 1;
    }

    // so Nam
    if (resident.gioiTinh === "nam") {
      residentsId[resident.noiKhai].soNam -= 1;
    } else {
      // so Nu
      residentsId[resident.noiKhai].soNu -= 1;
    }

    if (residentsId[resident.noiKhai].quocTich[resident.quocTich]) {
      residentsId[resident.noiKhai].quocTich[resident.quocTich] -= 1;
    } else {
      residentsId[resident.noiKhai].quocTich[resident.quocTich] = -1;
    }
    if (residentsId[resident.noiKhai].tonGiao[resident.tonGiao]) {
      residentsId[resident.noiKhai].tonGiao[resident.tonGiao] -= 1;
    } else {
      residentsId[resident.noiKhai].tonGiao[resident.tonGiao] = -1;
    }
    if (residentsId[resident.noiKhai].danToc[resident.danToc]) {
      residentsId[resident.noiKhai].danToc[resident.danToc] -= 1;
    } else {
      residentsId[resident.noiKhai].danToc[resident.danToc] = -1;
    }
    if (residentsId[resident.noiKhai].nhomMau[resident.nhomMau]) {
      residentsId[resident.noiKhai].nhomMau[resident.nhomMau] -= 1;
    } else {
      residentsId[resident.noiKhai].nhomMau[resident.nhomMau] = -1;
    }
  });
  return residentsId;
}

async function updateAnalyticsAfterDelete(changeData) {
  // lay tung ma to tu changeData
  for (residentId in changeData) {
    // tim ma cac don vi hanh chinh tuong ung
    const toId = residentId;
    const xaId = residentId.slice(0, -2);
    const huyenId = residentId.slice(0, -4);
    const tinhId = residentId.slice(0, -6);
    // lay data cua tinh huyen xa ..
    const [tinh, huyen, xa, to, caNuoc] = await Promise.all([
      Tinh.findOne({ id: tinhId }).select({ _id: 0 }),
      Huyen.findOne({ id: huyenId }).select({ _id: 0 }),
      Xa.findOne({ id: xaId }).select({ _id: 0 }),
      To.findOne({ id: toId }).select({ _id: 0 }),
      TkCaNuoc.findOne({ id: "0" }).select({ _id: 0 }),
    ]);
    // thay doi data cua tinh huyen xa dua tren change data
    // loop tung key cua changedata(cac thuoc tinh cua change data)
    Object.keys(changeData[residentId]).forEach((key) => {
      // neu khong phai la object
      if (!_.isObject(changeData[residentId][key])) {
        tinh[key] += changeData[residentId][key];
        huyen[key] += changeData[residentId][key];
        xa[key] += changeData[residentId][key];
        to[key] += changeData[residentId][key];
        caNuoc[key] += changeData[residentId][key];
      } else {
        // neu la object
        Object.keys(changeData[residentId][key]).forEach((childKey) => {
          tinh[key][childKey] += changeData[residentId][key][childKey];
          huyen[key][childKey] += changeData[residentId][key][childKey];
          xa[key][childKey] += changeData[residentId][key][childKey];
          to[key][childKey] += changeData[residentId][key][childKey];
          caNuoc[key][childKey] += changeData[residentId][key][childKey];
        });
      }
    });
    //update
    let caNuocUpdate = TkCaNuoc.findOneAndUpdate(
      { id: "0" },
      { $set: caNuoc },
      {
        // For adding new user to be updated
        new: true,
        upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: "query",
      },
    );

    let tinhUpdate = Tinh.findOneAndUpdate(
      { id: tinhId },
      { $set: tinh },
      {
        // For adding new user to be updated
        new: true,
        upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: "query",
      },
    );

    let huyenUpdate = Huyen.findOneAndUpdate(
      { id: huyenId },
      { $set: huyen },
      {
        // For adding new user to be updated
        new: true,
        upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: "query",
      },
    );

    let xaUpdate = Xa.findOneAndUpdate(
      { id: xaId },
      { $set: xa },
      {
        // For adding new user to be updated
        new: true,
        upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: "query",
      },
    );

    let toUpdate = To.findOneAndUpdate(
      { id: toId },
      { $set: to },
      {
        // For adding new user to be updated
        new: true,
        upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: "query",
      },
    );
    await Promise.all([
      toUpdate,
      caNuocUpdate,
      huyenUpdate,
      xaUpdate,
      tinhUpdate,
    ]);
    // xóa redis nữa
    let redisArray = [tinhId, huyenId, xaId, toId, ""].map((item) => {
      return [
        redisClient.DEL(`country:${item}`),
        redisClient.DEL(`account:${item}`),
        redisClient.DEL(`resident:analytics:${item}`),
        redisClient.DEL(`account:${item}:children`),
      ];
    });
    redisArray = _.flatten(redisArray);
    await Promise.all(redisArray);
  }
}

deleteResident = async (req, res) => {
  try {
    let userId = req.user.userName;
    if (req.user.tier === 0) {
      userId = "";
    }
    await User.checkIsBanned(req.user);
    const id = req.params.id;
    const resident = await Resident.findOne({
      _id: id,
    });
    if (!resident) {
      throw new Error("Không tìm thấy người này");
    }
    if (resident.noiKhai.indexOf(userId) !== 0) {
      throw new Error("Không đủ thẩm quyền để làm việc này");
    }
    await Resident.deleteOne({
      _id: id,
    });
    let dataChange = getDataNeedToRemove([resident]);
    await updateAnalyticsAfterDelete(dataChange);
    res.json({ message: "done" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

deleteManyResident = async (req, res) => {
  try {
    let userId = req.user.userName;
    if (req.user.tier === 0) {
      userId = "";
    }
    await User.checkIsBanned(req.user);
    let residentArray;
    if (req.body.data) {
      residentArray = req.body.data.residents;
    }
    if (!residentArray || _.isEmpty(residentArray)) {
      throw new Error("Không có thông tin người dân để xóa");
    }
    // remove duplicate
    residentArray = [...new Set(residentArray)].map((value) => {
      return { _id: value };
    });

    const residents = await Resident.find({
      $or: residentArray,
    });
    if (!residents || _.isEmpty(residents)) {
      throw new Error("Không tìm thấy những người này");
    }
    residents.forEach((resident) => {
      if (resident.noiKhai.indexOf(userId) !== 0) {
        throw new Error("Không đủ thẩm quyền để làm việc này");
      }
    });

    await Resident.deleteMany({
      $or: residentArray,
    });
    let dataChange = getDataNeedToRemove(residents);
    await updateAnalyticsAfterDelete(dataChange);
    res.json({ message: "done" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  postResident,
  getAllResidents,
  getResident,
  putResident,
  getChildrenResidents,
  deleteResident,
  deleteManyResident,
};

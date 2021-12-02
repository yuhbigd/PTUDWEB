const Tinh = require("../tinhModel");
const Huyen = require("../huyenModel");
const Xa = require("../xaModel");
const To = require("../toModel");
const moment = require("moment");
const TkCaNuoc = require("../tkCaNuocModel");
let pickedArray = [
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
  "nhomMau",
];
async function postUpdate(doc, dataNeedToRemove) {
  if (doc.tenChuHo || doc.quanHeVoiChuHo || doc.soHoKhau) {
    if (!doc.tenChuHo || !doc.quanHeVoiChuHo || !doc.soHoKhau) {
      throw new Error("phần hộ khẩu không thể bỏ trống");
    }
  }
  if (doc.tenVoChong || doc.cccdVoChong || doc.quocTichVoChong) {
    if (doc.honNhan.normalize("NFC") === "chưa kết hôn".normalize("NFC")) {
      throw new Error("Không thể chọn chưa kết hôn khi bạn đã có vợ/chồng");
    }
  }
  let yearDiff = moment().diff(doc.ngaySinh, "years", false);
  if (
    yearDiff < 15 &&
    (doc.honNhan.normalize("NFC") === "Đã kết hôn".normalize("NFC") ||
      doc.honNhan.normalize("NFC") === "Ly hôn".normalize("NFC"))
  ) {
    throw new Error("chưa được 15 tuổi kết hôn cái gì vậy trời");
  }

  const noiKhai = doc.noiKhai;
  const xaId = noiKhai.slice(0, -2);
  const huyenId = noiKhai.slice(0, -4);
  const tinhId = noiKhai.slice(0, -6);
  let tinh = Tinh.findOne({ id: tinhId });
  let huyen = Huyen.findOne({ id: huyenId });
  let xa = Xa.findOne({ id: xaId });
  let to = To.findOne({ id: noiKhai });
  let caNuoc = TkCaNuoc.findOne({ id: "0" });
  const [tinh1, huyen1, xa1, to1, caNuoc1] = await Promise.all([
    tinh,
    huyen,
    xa,
    to,
    caNuoc,
  ]);

  //tao ra cac gia tri thong ke
  let updateCaNuocValue = _.pick(caNuoc1, pickedArray);

  let updateTinhValue = _.pick(tinh1, pickedArray);

  // huyen update value

  let updateHuyenValue = _.pick(huyen1, pickedArray);

  // xa update value

  let updateXaValue = _.pick(xa1, pickedArray);

  // to update value

  let updateToValue = _.pick(to1, pickedArray);

  // tuoi

  if (yearDiff < 15) {
    updateCaNuocValue.nhoHon15 += 1;
    updateTinhValue.nhoHon15 += 1;
    updateHuyenValue.nhoHon15 += 1;
    updateXaValue.nhoHon15 += 1;
    updateToValue.nhoHon15 += 1;
  } else if (yearDiff > 64) {
    updateCaNuocValue.hon64 += 1;
    updateTinhValue.hon64 += 1;
    updateHuyenValue.hon64 += 1;
    updateXaValue.hon64 += 1;
    updateToValue.hon64 += 1;
  } else {
    updateCaNuocValue.tu15_64 += 1;
    updateTinhValue.tu15_64 += 1;
    updateHuyenValue.tu15_64 += 1;
    updateXaValue.tu15_64 += 1;
    updateToValue.tu15_64 += 1;
  }

  //ket hon
  if (doc.honNhan.normalize("NFC") === "Đã kết hôn".normalize("NFC")) {
    updateCaNuocValue.daKetHon += 1;
    updateTinhValue.daKetHon += 1;
    updateHuyenValue.daKetHon += 1;
    updateXaValue.daKetHon += 1;
    updateToValue.daKetHon += 1;
  } else if (doc.honNhan.normalize("NFC") === "Chưa kết hôn".normalize("NFC")) {
    updateCaNuocValue.chuaKetHon += 1;
    updateTinhValue.chuaKetHon += 1;
    updateHuyenValue.chuaKetHon += 1;
    updateXaValue.chuaKetHon += 1;
    updateToValue.chuaKetHon += 1;
  } else if (doc.honNhan.normalize("NFC") === "Ly hôn".normalize("NFC")) {
    updateCaNuocValue.lyHon += 1;
    updateTinhValue.lyHon += 1;
    updateHuyenValue.lyHon += 1;
    updateXaValue.lyHon += 1;
    updateToValue.lyHon += 1;
  }

  // dan so
  updateCaNuocValue.soDan += 1;
  updateTinhValue.soDan += 1;
  updateHuyenValue.soDan += 1;
  updateXaValue.soDan += 1;
  updateToValue.soDan += 1;

  // so Nam
  if (doc.gioiTinh === "nam") {
    updateCaNuocValue.soNam += 1;
    updateTinhValue.soNam += 1;
    updateHuyenValue.soNam += 1;
    updateXaValue.soNam += 1;
    updateToValue.soNam += 1;
  } else {
    // so Nu
    updateCaNuocValue.soNu += 1;
    updateTinhValue.soNu += 1;
    updateHuyenValue.soNu += 1;
    updateXaValue.soNu += 1;
    updateToValue.soNu += 1;
  }

  //quoc tich

  if (!updateCaNuocValue.quocTich) {
    updateCaNuocValue.quocTich = {};
  }
  if (!updateTinhValue.quocTich) {
    updateTinhValue.quocTich = {};
  }
  if (!updateHuyenValue.quocTich) {
    updateHuyenValue.quocTich = {};
  }
  if (!updateXaValue.quocTich) {
    updateXaValue.quocTich = {};
  }
  if (!updateToValue.quocTich) {
    updateToValue.quocTich = {};
  }

  if (updateCaNuocValue.quocTich[doc.quocTich]) {
    updateCaNuocValue.quocTich[doc.quocTich] += 1;
  } else {
    updateCaNuocValue.quocTich[doc.quocTich] = 1;
  }

  if (updateTinhValue.quocTich[doc.quocTich]) {
    updateTinhValue.quocTich[doc.quocTich] += 1;
  } else {
    updateTinhValue.quocTich[doc.quocTich] = 1;
  }

  if (updateHuyenValue.quocTich[doc.quocTich]) {
    updateHuyenValue.quocTich[doc.quocTich] += 1;
  } else {
    updateHuyenValue.quocTich[doc.quocTich] = 1;
  }

  if (updateXaValue.quocTich[doc.quocTich]) {
    updateXaValue.quocTich[doc.quocTich] += 1;
  } else {
    updateXaValue.quocTich[doc.quocTich] = 1;
  }

  if (updateToValue.quocTich[doc.quocTich]) {
    updateToValue.quocTich[doc.quocTich] += 1;
  } else {
    updateToValue.quocTich[doc.quocTich] = 1;
  }

  // ton giao
  if (!updateCaNuocValue.tonGiao) {
    updateCaNuocValue.tonGiao = {};
  }
  if (!updateTinhValue.tonGiao) {
    updateTinhValue.tonGiao = {};
  }
  if (!updateHuyenValue.tonGiao) {
    updateHuyenValue.tonGiao = {};
  }
  if (!updateXaValue.tonGiao) {
    updateXaValue.tonGiao = {};
  }
  if (!updateToValue.tonGiao) {
    updateToValue.tonGiao = {};
  }

  if (updateCaNuocValue.tonGiao[doc.tonGiao]) {
    updateCaNuocValue.tonGiao[doc.tonGiao] += 1;
  } else {
    updateCaNuocValue.tonGiao[doc.tonGiao] = 1;
  }

  if (updateTinhValue.tonGiao[doc.tonGiao]) {
    updateTinhValue.tonGiao[doc.tonGiao] += 1;
  } else {
    updateTinhValue.tonGiao[doc.tonGiao] = 1;
  }

  if (updateHuyenValue.tonGiao[doc.tonGiao]) {
    updateHuyenValue.tonGiao[doc.tonGiao] += 1;
  } else {
    updateHuyenValue.tonGiao[doc.tonGiao] = 1;
  }

  if (updateXaValue.tonGiao[doc.tonGiao]) {
    updateXaValue.tonGiao[doc.tonGiao] += 1;
  } else {
    updateXaValue.tonGiao[doc.tonGiao] = 1;
  }

  if (updateToValue.tonGiao[doc.tonGiao]) {
    updateToValue.tonGiao[doc.tonGiao] += 1;
  } else {
    updateToValue.tonGiao[doc.tonGiao] = 1;
  }

  // dan toc

  if (!updateCaNuocValue.danToc) {
    updateCaNuocValue.danToc = {};
  }
  if (!updateTinhValue.danToc) {
    updateTinhValue.danToc = {};
  }
  if (!updateHuyenValue.danToc) {
    updateHuyenValue.danToc = {};
  }
  if (!updateXaValue.danToc) {
    updateXaValue.danToc = {};
  }
  if (!updateToValue.danToc) {
    updateToValue.danToc = {};
  }

  if (updateCaNuocValue.danToc[doc.danToc]) {
    updateCaNuocValue.danToc[doc.danToc] += 1;
  } else {
    updateCaNuocValue.danToc[doc.danToc] = 1;
  }

  if (updateTinhValue.danToc[doc.danToc]) {
    updateTinhValue.danToc[doc.danToc] += 1;
  } else {
    updateTinhValue.danToc[doc.danToc] = 1;
  }

  if (updateHuyenValue.danToc[doc.danToc]) {
    updateHuyenValue.danToc[doc.danToc] += 1;
  } else {
    updateHuyenValue.danToc[doc.danToc] = 1;
  }

  if (updateXaValue.danToc[doc.danToc]) {
    updateXaValue.danToc[doc.danToc] += 1;
  } else {
    updateXaValue.danToc[doc.danToc] = 1;
  }

  if (updateToValue.danToc[doc.danToc]) {
    updateToValue.danToc[doc.danToc] += 1;
  } else {
    updateToValue.danToc[doc.danToc] = 1;
  }

  // nhom mau
  if (!updateCaNuocValue.nhomMau) {
    updateCaNuocValue.nhomMau = {};
  }
  if (!updateTinhValue.nhomMau) {
    updateTinhValue.nhomMau = {};
  }
  if (!updateHuyenValue.nhomMau) {
    updateHuyenValue.nhomMau = {};
  }
  if (!updateXaValue.nhomMau) {
    updateXaValue.nhomMau = {};
  }
  if (!updateToValue.nhomMau) {
    updateToValue.nhomMau = {};
  }

  if (updateCaNuocValue.nhomMau[doc.nhomMau]) {
    updateCaNuocValue.nhomMau[doc.nhomMau] += 1;
  } else {
    updateCaNuocValue.nhomMau[doc.nhomMau] = 1;
  }

  if (updateTinhValue.nhomMau[doc.nhomMau]) {
    updateTinhValue.nhomMau[doc.nhomMau] += 1;
  } else {
    updateTinhValue.nhomMau[doc.nhomMau] = 1;
  }

  if (updateHuyenValue.nhomMau[doc.nhomMau]) {
    updateHuyenValue.nhomMau[doc.nhomMau] += 1;
  } else {
    updateHuyenValue.nhomMau[doc.nhomMau] = 1;
  }

  if (updateXaValue.nhomMau[doc.nhomMau]) {
    updateXaValue.nhomMau[doc.nhomMau] += 1;
  } else {
    updateXaValue.nhomMau[doc.nhomMau] = 1;
  }

  if (updateToValue.nhomMau[doc.nhomMau]) {
    updateToValue.nhomMau[doc.nhomMau] += 1;
  } else {
    updateToValue.nhomMau[doc.nhomMau] = 1;
  }

  // + data sau khi them cac thuoc tinh voi data need to remove để - các cái cũ và thêm các cái mới
  Object.keys(dataNeedToRemove).forEach((key) => {
    if (!_.isObject(dataNeedToRemove[key])) {
      updateCaNuocValue[key] += dataNeedToRemove[key];
      updateTinhValue[key] += dataNeedToRemove[key];
      updateHuyenValue[key] += dataNeedToRemove[key];
      updateXaValue[key] += dataNeedToRemove[key];
      updateToValue[key] += dataNeedToRemove[key];
    } else {
      Object.keys(dataNeedToRemove[key]).forEach((childKey) => {
        updateCaNuocValue[key][childKey] += dataNeedToRemove[key][childKey];
        updateTinhValue[key][childKey] += dataNeedToRemove[key][childKey];
        updateHuyenValue[key][childKey] += dataNeedToRemove[key][childKey];
        updateXaValue[key][childKey] += dataNeedToRemove[key][childKey];
        updateToValue[key][childKey] += dataNeedToRemove[key][childKey];
      });
    }
  });

  let caNuocUpdate = TkCaNuoc.findOneAndUpdate(
    { id: "0" },
    { $set: updateCaNuocValue },
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
    { $set: updateTinhValue },
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
    { $set: updateHuyenValue },
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
    { $set: updateXaValue },
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
    { id: noiKhai },
    { $set: updateToValue },
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
  let redisArray = [tinhId, huyenId, xaId, noiKhai, ""].map((item) => {
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
module.exports = postUpdate;

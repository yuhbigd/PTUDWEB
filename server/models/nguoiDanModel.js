const mongoose = require("mongoose");
const moment = require("moment");
const postInsert = require("./trigger_resident/postInsert");
// cai nao co index true la dung de sap xep, tim kiem thi tim theo ten hoac the so cccd
const residentSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    require: [true, "Không thể bỏ trống họ tên"],
    index: true,
  },
  ngaySinh: {
    type: Date,
    require: [true, "Không thể bỏ trống ngày sinh"],
    index: true,
  },
  gioiTinh: {
    type: String,
    enum: ["nam", "nữ"],
    require: [true, "Không thể bỏ trống giới tính"],
  },
  nhomMau: {
    type: String,
    enum: ["O", "A", "B", "AB"],
    require: [true, "Không thể bỏ trống nhom mau"],
    index: true,
  },
  honNhan: {
    type: String,
    enum: ["Chưa kết hôn", "Đã kết hôn", "Ly hôn"],
    require: [true, "Không thể bỏ trống tình trạng hôn nhân"],
  },
  noiDangKyKhaiSinh: {
    type: String,
    require: [true, "Không thể bỏ trống nơi khai sinh"],
  },
  queQuan: {
    type: String,
    require: [true, "Không thể bỏ trống quê quán"],
  },
  danToc: {
    type: String,
    require: [true, "Không thể bỏ trống tên dân tộc"],
    index: true,
  },
  quocTich: {
    type: String,
    require: [true, "Không thể bỏ trống quốc tịch"],
    index: true,
  },
  tonGiao: {
    type: String,
    require: [true, "Không thể bỏ trống tôn giáo"],
    index: true,
  },
  soCCCD: { type: String, index: true, unique: true, sparse: true },
  noiThuongTru: {
    type: String,
    require: [true, "Không thể bỏ trống nơi thường trú"],
  },
  noiOHienTai: {
    type: String,
  },
  tenCha: {
    type: String,
  },
  tenMe: {
    type: String,
  },
  soCCCDMe: {
    type: String,
  },
  soCCCDCha: {
    type: String,
  },
  quocTichCha: {
    type: String,
  },
  quocTichMe: {
    type: String,
  },
  tenVoChong: {
    type: String,
  },
  cccdVoChong: {
    type: String,
  },
  quocTichVoChong: {
    type: String,
  },
  daiDienHopPhap: {
    type: String,
  },
  quocTichDaiDienHopPhap: {
    type: String,
  },
  cccdDaiDienHopPhap: {
    type: String,
  },
  tenChuHo: {
    type: String,
  },
  quanHeVoiChuHo: {
    type: String,
  },
  soHoKhau: {
    type: String,
  },
  ngayKhai: {
    type: Date,
    default: new Date(),
    index: true,
  },
  noiKhai: {
    type: String,
    require: [true, "Không thể bỏ trống nơi khai"],
    index: true,
  },
});
async function checkPre(next) {
  if (this.tenChuHo || this.quanHeVoiChuHo || this.soHoKhau) {
    if (!this.tenChuHo || !this.quanHeVoiChuHo || !this.soHoKhau) {
      throw new Error("phần hộ khẩu không thể bỏ trống");
    }
  }
  if (this.tenVoChong || this.cccdVoChong || this.quocTichVoChong) {
    if (this.honNhan.normalize("NFC") === "chưa kết hôn".normalize("NFC")) {
      throw new Error("Không thể chọn chưa kết hôn khi bạn đã có vợ/chồng");
    }
  }
  let yearDiff = moment().diff(this.ngaySinh, "years", false);
  if (
    yearDiff < 15 &&
    (this.honNhan.normalize("NFC") === "Đã kết hôn".normalize("NFC") ||
      this.honNhan.normalize("NFC") === "Ly hôn".normalize("NFC"))
  ) {
    throw new Error("chưa được 15 tuổi kết hôn cái gì vậy trời");
  }

  if (!this.hoTen.trim()) {
    throw new Error("không thể bỏ trống ô họ tên");
  }
  if (!this.queQuan.trim()) {
    throw new Error("không thể bỏ trống ô quê quán");
  }
  if (!this.danToc.trim()) {
    throw new Error("không thể bỏ trống ô dân tộc");
  }
  if (!this.quocTich.trim()) {
    throw new Error("không thể bỏ trống ô quốc tịch");
  }
  if (!this.tonGiao.trim()) {
    throw new Error("không thể bỏ trống ô tôn giáo");
  }
  if (!this.noiThuongTru.trim()) {
    throw new Error("không thể bỏ trống ô nơi thường trú");
  }

  this.hoTen = this.hoTen.trim();
  this.queQuan = this.queQuan.trim();
  this.danToc = this.danToc.trim();
  this.quocTich = this.quocTich.trim();
  this.tonGiao = this.tonGiao.trim();
  this.noiThuongTru = this.noiThuongTru.trim();

  next();
}

residentSchema.pre("save", checkPre);
residentSchema.pre("findOneAndUpdate", checkPre);
// post create
residentSchema.post("save", postInsert);
const Resident = mongoose.model("residents", residentSchema);

module.exports = Resident;

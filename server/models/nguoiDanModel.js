const mongoose = require("mongoose");
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
// pre create
residentSchema.post("save", postInsert);
const Resident = mongoose.model("residents", residentSchema);

module.exports = Resident;

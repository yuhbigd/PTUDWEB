const mongoose = require("mongoose");
const residentSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    require: [true, "Không thể bỏ trống họ tên"],
    index: true,
  },
  ngaySinh: {
    type: Date,
    require: [true, "Không thể bỏ trống ngày sinh"],
  },
  gioiTinh: {
    type: String,
    enum: ["nam", "nữ", "khác"],
    require: [true, "Không thể bỏ trống giới tính"],
  },
  nhomMau: {
    type: String,
    enum: ["O", "A", "B", "AB"],
  },
  honNhan: {
    type: String,
    enum: ["Chưa kết hôn", "Đã kết hôn", "Ly hôn"],
    require: [true, "Không thể bỏ trống tình trạng hôn nhân"],
  },
  noiDangKyKhaiSinh: {
    type: String,
  },
  queQuan: {
    type: String,
    require: [true, "Không thể bỏ trống quê quán"],
  },
  danToc: {
    type: String,
    require: [true, "Không thể bỏ trống tên dân tộc"],
  },
  quocTich: {
    type: String,
    require: [true, "Không thể bỏ trống quốc tịch"],
  },
  tonGiao: {
    type: String,
    require: [true, "Không thể bỏ trống tôn giáo"],
  },
  soCCCD: {
    type: String,
  },
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
  },
  noiKhai: {
    type: String,
    require: [true, "Không thể bỏ trống nơi khai"],
  },
});
const Resident = mongoose.model("residents", residentSchema);

module.exports = Resident;

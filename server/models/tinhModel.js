const mongoose = require("mongoose");
const TkCaNuoc = require("./tkCaNuocModel");
const tinhSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Hãy nhập mã tỉnh"],
    unique: [true, "mã tỉnh đã được cấp"],
    validate: {
      validator: function (v) {
        return /^([0-9][0-9])$/.test(v);
      },
      message: "Mã tỉnh không hợp lệ",
    },
    index: true,
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của tỉnh"],
    index: true,
  },
  count: { type: Number, default: 0 },
  // thong ke chung cua don vi
  soDan: { type: Number, default: 0 },
  soNam: { type: Number, default: 0 },
  soNu: { type: Number, default: 0 },
  nhoHon15: { type: Number, default: 0 },
  tu15_64: { type: Number, default: 0 },
  hon64: { type: Number, default: 0 },
  daKetHon: { type: Number, default: 0 },
  chuaKetHon: { type: Number, default: 0 },
  lyHon: { type: Number, default: 0 },
  danToc: { type: Object },
  quocTich: { type: Object },
  tonGiao: { type: Object },
  nhomMau: { type: Object },
});

tinhSchema.post("save", async function (doc) {
  const caNuoc = await TkCaNuoc.findOne({
    id: "00",
  });
  await TkCaNuoc.findOneAndUpdate(
    {
      id: "00",
    },
    {
      $set: {
        count: caNuoc.count + 1,
      },
    },
  );
});

const Tinh = mongoose.model("tinhs", tinhSchema);

module.exports = Tinh;

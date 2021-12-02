const mongoose = require("mongoose");
const Tinh = require("./tinhModel");
const huyenSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Hãy nhập mã huyện"],
    unique: [true, "mã huyện đã được cấp"],
    validate: {
      validator: function (v) {
        return /^([0-9][0-9][0-9][0-9])$/.test(v);
      },
      message: "Mã huyện,quận không hợp lệ",
    },
    index: true,
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của huyện,quận"],
    index: true,
  },
  tinh: {
    type: String,
    required: [true, "Hãy nhập mã của tỉnh"],
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
huyenSchema.post("save", async function (doc) {
  const tinh = await Tinh.findOne({
    id: doc.tinh,
  });
  await Tinh.findOneAndUpdate(
    {
      id: doc.tinh,
    },
    {
      $set: {
        count: tinh.count + 1,
      },
    },
  );
});

const Huyen = mongoose.model("huyens", huyenSchema);

module.exports = Huyen;

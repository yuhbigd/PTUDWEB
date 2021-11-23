const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sanitize = require("mongo-sanitize");
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Hãy nhập tên tài khoản"],
    unique: [true, "Tài khoản đã được cấp trước đó"],
  },
  password: {
    type: String,
    required: [true, "Hãy nhập mật khẩu"],
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của tài khoản"],
  },
  tier: {
    type: Number,
    required: [true],
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
});
// hash mat khau
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//pre update user middleware
userSchema.pre("updateOne", async function (next) {
  try {
    if (this._update.password) {
      const salt = await bcrypt.genSalt();
      this._update.password = await bcrypt.hash(this._update.password, salt);
    }
    next();
  } catch (err) {
    return next(err);
  }
});
// kiem tra dang nhap
userSchema.statics.login = async function (userName, password) {
  const user = await this.findOne({ userName: sanitize(userName) });
  if (user) {
    const isCorrectPass = await bcrypt.compare(
      sanitize(password),
      user.password,
    );
    if (isCorrectPass) {
      return user;
    }
    throw new Error("Sai mật khẩu");
  }
  throw new Error("Tên đăng nhập không chính xác hoặc sai mật khẩu");
};
userSchema.statics.checkUser = async function (userId) {
  let _id = sanitize(userId);
  const user = await this.findOne({ _id: _id });
  if (!user) {
    throw new Error("Tên đăng nhập không chính xác");
  }
  return true;
};
// kiem tra tai khoan co bi ban hay khong
userSchema.statics.checkIsBanned = async function (userName) {
  console.log(userName);
  const sanitizedUserName = sanitize(userName);
  const length = sanitizedUserName.length;
  const n = length / 2;
  if (n > 4) {
    throw new Error("Tài khoản của bạn không hợp lệ");
  }
  let stringArray = [];
  for (let i = 1; i <= n; i++) {
    stringArray.push(sanitizedUserName.slice(0, 2 * i));
  }
  console.log(stringArray);
  for (let i = 0; i < n; i++) {
    const user = await this.findOne({ userName: stringArray[i] });
    console.log(user);
    if (!user) {
      throw new Error("Tài khoản của bạn đã bị cấm");
    } else if (user) {
      if (user.isBanned) {
        throw new Error("Tài khoản của bạn đã bị cấm");
      }
    }
  }
};
const User = mongoose.model("users", userSchema);

module.exports = User;

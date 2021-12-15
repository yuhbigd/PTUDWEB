const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

createToken = async function (user) {
  const token = await jwt.sign(
    {
      user: _.pick(user, ["userName"]),
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 1000 * 60,
    },
  );
  const refreshToken = await jwt.sign(
    {
      user: _.pick(user, ["userName"]),
    },
    process.env.SECRET_REFRESH_KEY + user.password,
    {
      expiresIn: 1000 * 60 * 60 * 24 * 3,
    },
  );
  return { token, refreshToken };
};
signup_get = async (req, res) => {
  res.send("signup");
};

// getting data when first time going to the website
login_get = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Tài khoản không tồn tại");
    }

    res.status(200).json({
      user: _.pick(user, [
        "userName",
        "name",
        "tier",
        "isBanned",
        "userTimeOut",
      ]),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login controller
login_post = async (req, res) => {
  try {
    let { userName, password } = req.body.user;
    const user = await User.login(userName, password);

    const { token, refreshToken } = await createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      user: _.pick(user, [
        "userName",
        "name",
        "tier",
        "isBanned",
        "userTimeOut",
      ]),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//logout
function logout_get(req, res) {
  //http
  res.clearCookie("refreshToken", { secure: true, sameSite: "none" });
  res.clearCookie("token", { secure: true, sameSite: "none" });
  res.status(200).json({
    message: "Logged out",
  });
}

module.exports = {
  createToken,
  login_post,
  login_get,
  logout_get,
};

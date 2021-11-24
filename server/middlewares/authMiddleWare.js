const jwt = require("jsonwebtoken");
const { createToken } = require("../controllers/authController");
const User = require("../models/userModel");
require("dotenv").config();

//checking Token, if it's true then next else checking refresh Token
const checkUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const { user } = await jwt.verify(token, process.env.SECRET_KEY);
      if (user) {
        req.user = await User.findOne({ userName: user.userName });
        next();
      } else {
        res.clearCookie("token", { secure: true, sameSite: "none" });
        res.status(401).json({
          error: "invalid token",
        });
      }
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  } else {
    const refreshToken = req.cookies.refreshToken;
    //neu co refresh token ma ko co token
    if (refreshToken) {
      // tao ra token moi
      const newToken = await getNewToken(refreshToken);
      if (newToken.token && newToken.refreshToken) {
        res.cookie("token", newToken.token, {
          httpOnly: true,
          maxAge: 1000 * 60,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refreshToken", newToken.refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 3,
          secure: true,
          sameSite: "none",
        });
        req.user = newToken.user;
        next();
      } else {
        res.clearCookie("refreshToken", { secure: true, sameSite: "none" });
        res.status(401).json({
          error: "invalid refreshToken",
        });
      }
    } else {
      res.status(401).json({
        error: "You don't have authorization to view this content",
      });
    }
  }
};

// checking refreshToken, if it is true, creating new Token and refresh Token
async function getNewToken(refreshToken) {
  let name = "";
  try {
    //lay username tu trong refressh token
    const {
      user: { userName },
    } = jwt.decode(refreshToken);
    name = userName;
  } catch (error) {
    return {};
  }

  if (!name) {
    return {};
  }
  // tim username
  const user = await User.findOne({ userName: name });

  if (!user) {
    return {};
  }
  //tao ra refreshKey
  const refreshKey = process.env.SECRET_REFRESH_KEY + user.password;

  try {
    //so sanh refresh key
    jwt.verify(refreshToken, refreshKey);
  } catch (error) {
    return {};
  }
  // tao ra token moi
  const newToken = await createToken(user);
  // tra ve token va thong tin tai khoan
  return {
    token: newToken.token,
    refreshToken: newToken.refreshToken,
    user: user,
  };
}

module.exports = { checkUser };

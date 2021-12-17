const { Router } = require("express");
const authController = require("../controllers/authController");
const { checkUser } = require("../middlewares/authMiddleWare");
const { checkBotMiddleware } = require("../middlewares/checkBotMiddleware");
const router = Router();
router.post("/login",[checkBotMiddleware], authController.login_post);
router.get("/login", [checkUser], authController.login_get);
router.get("/logout", authController.logout_get);
module.exports = { router };

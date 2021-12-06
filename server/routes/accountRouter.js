// mai phai lam : sua account(set ban, set ngay het han) xoa account cron job

const { Router } = require("express");
const accountController = require("../controllers/accountController");
const router = Router();
router.post("/", accountController.account_post);
router.put("/:id", accountController.account_put);
router.get("/", accountController.account_get);
router.get("/children", accountController.account_getChildren);
router.get("/children/:id", accountController.account_getChild);
router.get(
  "/children/:id/children",
  accountController.account_getChildrenOfChild,
);
router.delete("/:id", accountController.account_delete);
router.get("/progression", accountController.getProgression);
router.get("/progression/:id", accountController.getChildProgression);
module.exports = { router };

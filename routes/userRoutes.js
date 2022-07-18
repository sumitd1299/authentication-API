const express = require("express");
const router = express.Router();
const {userRegister, userLogin, changeUserPassword, loggedUser, forgotPassword, resetPassword} = require("../controllers/userController.js");
const auth = require("../middlewares/auth.js");

//public routes
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:id/:token", resetPassword)

//protected routes
router.post("/changepassword", auth, changeUserPassword);
router.get("/loggeduser", auth, loggedUser);

module.exports = router;
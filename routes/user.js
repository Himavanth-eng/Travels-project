const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User=require("../projmodels/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

router.get("/signup",userController.signupform);

router.post("/signup",wrapAsync(userController.aftersignup));

router.get("/login",userController.loginform );

router.post("/login",saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.afterlogin
);

router.get("/logout", userController.logout);
module.exports = router;




const express=require("express");
const router=express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/users.js");

/*SignUp Route*/
router
.route("/signup")
.get(userController.signuprenderForm)
.post( wrapAsync(userController.signUpUser));

//* -----------------------------------------------------------------------------*//

/*LogIn Route*/
router
.route("/login")
.get(userController.loginrenderForm)
.post( 
saveRedirectUrl,
passport.authenticate("local" ,{failureRedirect:'/login',failureFlash:true}) , wrapAsync(userController.loginUser));

router.get("/logout",userController.logoutUser);

router.get("/",(req,res)=>{
  res.redirect("/listings");
});


module.exports=router;

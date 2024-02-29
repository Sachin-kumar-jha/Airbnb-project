const User=require("../models/user.js");

module.exports.signuprenderForm=(req,res)=>{
    res.render("users/signup.ejs");
    };

 module.exports.loginrenderForm=(req,res)=>{
    res.render("users/login.ejs");
};   

module.exports.signUpUser=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username });
        const registeredUser= await User.register(newUser,password);

    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust")
        return res.redirect("/listings");
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    } 
};


module.exports.loginUser=async(req,res)=>{
    req.flash("success","Welcome back to wanderlust You are logged in");
    let redirectUrl=res.locals.redirectUrl  || "/listings" ;
    res.redirect(redirectUrl);
    };

module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    });
};


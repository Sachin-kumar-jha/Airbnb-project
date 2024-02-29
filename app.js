if(process.env.NODE_ENV != "productrion"){
    require('dotenv').config();
}

const express=require("express");
const app =express();
const mongoose= require("mongoose");
const path = require("path");


const ejsMate=require("ejs-mate");
const methodOverride =require("method-override");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const ExpressError  =require("./utils/ExpressError");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const MongoStore=require("connect-mongo");
//mongoose connection//
const dbUrl=process.env.ATLAS_URL;
main().then((res)=>{
    console.log("mongo connected")
}).catch((err)=>{
    console.log("something is wrong");
})
async function main() {
    await mongoose.connect(dbUrl);
  }

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,

    cookie:{
expires:Date.now() + 7*24*60*60*1000,
maxAge:7*24*60*60*1000,
httpOnly:true
},
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);
//Create a starting route//




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});
app.use((err,req,res,next)=>{
    let{statusCode=400,message ="Something went wrong !"} = err;
    res.status(statusCode).render("error.ejs",{err});
 //res.status(statusCode).send(message);

});

app.listen(8080 , () =>{
    console.log("server is Listening to port 8080");
})

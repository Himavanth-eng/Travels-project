if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const port=8080;
const path=require("path"); 
const mongoose=require("mongoose");
const { title } = require("process");       
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const passport=require("passport");

const LocalStrategy = require("passport-local").Strategy;
const User=require("./projmodels/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const ejsMate=require("ejs-mate");
const review = require("./projmodels/review.js");
app.engine('ejs', ejsMate);

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");


// const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main().then(()=>{console.log("connection successfull");})
.catch(err => console.log(err));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in Mongo session",err);
});
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,  
    cookie: {
        httpOnly: true, 
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};
app.listen(port,()=>{
   console.log("Sever started"); 
});
// app.get("/",(req,res)=>{
//     // res.send("Hi,I am root");
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",listings);

app.use((req, res, next) => {
    res.locals.currUser = req.user;   // make user available to all EJS templates
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});




app.use((err, req, res, next) => {
    const status = err.status || 500; 
    res.status(status).send(err.message || "Something went wrong!");
});







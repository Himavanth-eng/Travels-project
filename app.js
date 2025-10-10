// =============================================
// APP.JS - Render + MongoDB Atlas Ready
// =============================================

// 🔹 ENV VARIABLES (only load locally)
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// 🔹 IMPORT DEPENDENCIES
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");

// 🔹 MODELS
const User = require("./projmodels/user");

// 🔹 ROUTES
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const userRoutes = require("./routes/user");

// =============================================
// DATABASE CONNECTION (MongoDB Atlas)
// =============================================
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/majorProjectDB";

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// =============================================
// APP CONFIGURATION
// =============================================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// =============================================
// SESSION CONFIGURATION
// =============================================
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET || "thisshouldbeabettersecret" },
    touchAfter: 24 * 3600, // lazy update once per day
});

store.on("error", err => console.error("Session store error:", err));

const sessionOptions = {
    store,
    secret: process.env.SECRET || "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: false, // safer
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// =============================================
// PASSPORT CONFIGURATION
// =============================================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =============================================
// GLOBAL MIDDLEWARE (flash + current user)
// =============================================
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// =============================================
// ROUTES
// =============================================
app.get("/", (req, res) => {
    req.flash("success", "Welcome to Listings!");
    res.redirect("/listings");
});

app.use("/listings", listings);                      // listing routes
// Correct nested route
app.use("/listings/:listingId/reviews", reviews);
app.use("/", userRoutes);                             // signup/login/logout

// =============================================
// ERROR HANDLING
// =============================================
app.all("*", (req, res, next) => {
    res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message || "Something went wrong!");
});

// =============================================
// SERVER START
// =============================================
const port = process.env.PORT || 8080;
app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});

app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});










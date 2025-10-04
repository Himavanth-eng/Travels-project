const express = require("express"); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const Listing = require("../projmodels/listing.js");
const {isLoggedin, isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

// Middleware placeholder (if you add Joi validation later)
const validateListing = (req, res, next) => {
    // Example with Joi:
    // let { error } = listingSchema.validate(req.body);
    // if (error) {
    //     let errMsg = error.details.map((el) => el.message).join(",");
    //     throw new ExpressError(400, errMsg);
    // }
    next();
};

router.get("/", wrapAsync(listingController.index));

router.get("/new",isLoggedin,listingController.newform);

router.get("/:id",wrapAsync(listingController.showListings));

router.post("/",isLoggedin,upload.single("listing[image]"), wrapAsync(listingController.createListing));

router.get("/:id/edit",isLoggedin, isOwner,wrapAsync(listingController.editform));

router.put("/:id",isLoggedin,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing));

router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.delete));

module.exports = router;


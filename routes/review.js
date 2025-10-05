const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../projmodels/listing.js");
const Review = require("../projmodels/review.js");
const { isLoggedin, isAuthor } = require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


const validateReview = (req, res, next) => {
    
    next();
};

// Create a review
router.post("/",isLoggedin, wrapAsync(reviewController.createReview));

// Delete a review
router.delete("/:reviewId", isLoggedin, isAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;

const Review=require("../projmodels/review");
const Listing = require("../projmodels/listing");


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","New review added");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};
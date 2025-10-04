const Listing=require("./projmodels/listing");
module.exports.isLoggedin=(req,res,next)=>{
        if(! req.isAuthenticated()){
            req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create new listing");
        return res.redirect("/login");
        }
        next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

const Review = require("./projmodels/review");

module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


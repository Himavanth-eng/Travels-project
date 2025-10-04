const Listing=require("../projmodels/listing");

module.exports.index=async (req, res) => {
    let allListings = await Listing.find({});
    res.render("index", { allListings });
};

module.exports.newform= async (req, res) => {
    res.render("new");
};

module.exports.showListings= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner"); //access reviews and owner on screen
    if (!listing) {
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    res.render("show", { listing })};

module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();  
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.editform=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }

    res.redirect(`/listings/${id}`);
};


module.exports.delete=async (req,res)=>{ 
    let {id}=req.params; let deletedListing=await Listing.findByIdAndDelete(id); 
    req.flash("success"," Listing deleted!");
    res.redirect("/listings"); 
};
const Listing = require("../models/listing");
const axios = require('axios');
const apiKey = process.env.HERE_CREDS;


module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
};

module.exports.render = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    //display owner details
    //console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
    
    try {
        // Call the HERE Geocoding API to get coordinates
        const response = await axios.get(`https://geocode.search.hereapi.com/v1/geocode`, {
            params: {
                q: req.body.listing.location,
                apiKey: apiKey
            }
        });

        const geocodeData = response.data;
        const location = geocodeData.items[0];

        // Prepare the new listing data
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing({
            ...req.body.listing,
            owner: req.user._id,
            image: { url, filename },
            geometry: {
                type: "Point",
                coordinates: [location.position.lng, location.position.lat] // [longitude, latitude]
            }
        });
        // newListing.owner = req.user._id;
        // newListing.image = { url, filename };
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success","New listing created!!");
        res.redirect("/listings");
    }catch (error) {
        console.error(error);
        req.flash("error", "An error occurred while creating the listing. Please try again.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ listing });
};

module.exports.updateListing = async(req,res)=>{
    
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing} );
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id,{...req.body.listing});
    //console.log(deleted);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
    
};
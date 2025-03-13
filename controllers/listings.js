const Listing=require("../models/list.js");
const axios = require('axios');
// Initialize Radar with your publishable ke
//const { all } = require("../routes/listing.js");
// const mapToken=process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken:mapToken});

module.exports.index= async (req,res)=>{
    const allListings= await  Listing.find({});
    res.render("listings/index.ejs",{allListings});
   }

/*------------------------------------------------------------------------------------------*/

   module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
  };

/*------------------------------------------------------------------------------------------*/

  module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
       const listing = await Listing.findById(id).populate({path:"reviews",
       populate:{ path:"author"
       },
    }).populate("owner");
       if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
       }
       res.render("listings/show.ejs",{listing});
};

/*------------------------------------------------------------------------------------------*/

module.exports.createNewListing = async (req, res, next) => {
   try {
       const location = req.body.listing.location;
       const RADAR_API_KEY = process.env.MAP_TOKEN;

       // Geocode the address using Radar's HTTP API
       const response = await axios.get('https://api.radar.io/v1/geocode/forward', {
           params: { query: location },
           headers: { Authorization: RADAR_API_KEY }
       });

       const results = response.data.addresses;
       if (!results.length) {
           req.flash('error', 'Invalid location. Please try again.');
           return res.redirect('/listings/new');
       }

       const { latitude, longitude } = results[0].latitude ? results[0] : { latitude: 0, longitude: 0 };

       // Prepare image data
       let url = req.file?.path;
       let filename = req.file?.filename;

       // Create new listing
       const newListing = new Listing(req.body.listing);
       newListing.owner = req.user._id;
       newListing.image = { url, filename };
       newListing.geometry = {
           type: 'Point',
           coordinates: [longitude, latitude] // GeoJSON format [lng, lat]
       };

       // Save the listing
       const savedListing = await newListing.save();
       console.log('Listing saved:', savedListing);

       req.flash('success', 'New listing created!');
       res.redirect('/listings');
   } catch (error) {
       console.error('Error creating listing:', error);
       req.flash('error', 'Something went wrong.');
       res.redirect('/listings/new');
   }
};

/*------------------------------------------------------------------------------------------*/

module.exports.editListing=async(req,res)=>{
    let {id } = req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
       }
       let originalImageUrl=listing.image.url;
       originalImageUrl=originalImageUrl.replace("/upload","/upload/c_fill,w_300");
    res.render("listings/edit.ejs" , {listing ,originalImageUrl});
};

/*------------------------------------------------------------------------------------------*/

module.exports.updateListing=async(req,res,next)=>{
    let {id } = req.params; 
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if( typeof req.file !=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    req.flash("success","listing Updated!");
    res.redirect(`/listings/${id}`);
};

/*------------------------------------------------------------------------------------------*/

module.exports.deleteListing=async(req,res)=>{
let{id}=req.params;
let deletedListing=await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success","Listing deleted");
res.redirect("/listings");
};











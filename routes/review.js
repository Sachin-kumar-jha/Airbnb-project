const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isreviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

//Add New Review//

router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.addnewReview));
 
//Delete Review//

router.delete("/:reviewId", isLoggedIn,isreviewAuthor,reviewController.destroyReview);

module.exports=router;
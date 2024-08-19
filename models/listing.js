const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listingSchema = new Schema({
    title:{
       type:String,
       required:true,
    },
    description:{
        type:String
    },
    image:{
      url:String,
      filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    geometry: {
      type: {
          type: String,
          enum: ['Point'], // 'geometry.type' must be 'Point'
          required: true
      },
      coordinates: {
          type: [Number],
          required: true
      }
    },
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref : "Review",
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
});


listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await review.deleteMany({_id: {$in: listing.reviews}});
  }
});

//create a model
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

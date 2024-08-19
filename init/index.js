const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connect to db");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        geometry: {
            type: "Point",  // or other GeoJSON type if different
            coordinates:obj.geometry && obj.geometry.coordinates ? obj.geometry.coordinates : [0, 0] // Use existing coordinates
        },
        owner: "66b33598bc275dcf23ab3464",
    }));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
};

initDB();
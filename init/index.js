const mongoose=require("mongoose");
const initData=require("./data.js");

const Listing=require("../models/list.js");
const MONGO_URL= 'mongodb://127.0.0.1:27017/wanderLust' ;
main().then((res)=>{
  console.log("DB connected");
}).catch((err)=>{
  console.log("error");
})
async function main() {
  await mongoose.connect(dbUrl);
}
//data initialized//
  const initDB =async() =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"65a0417c2335c962e0ba68c6"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  }
  initDB();
const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require("../projmodels/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {      
        console.error(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "68d544416d76757b5f407444" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();





//to reinitialize database add & type node index.js//

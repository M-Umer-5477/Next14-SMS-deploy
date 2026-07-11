const mongoose = require('mongoose');
const url = "mongodb+srv://buttumer5477:XIHDhisSmIKyx49t@cluster0.cop9ird.mongodb.net/?appName=Cluster0";


async function testConnection() {
    try {
        console.log("Connecting to:", url);
        await mongoose.connect(url);
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error.message);
        console.error(error);
        process.exit(1);
    }
}
testConnection();

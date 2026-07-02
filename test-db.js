const { MongoClient } = require('mongodb');

// Exact string with the new user and password
const uri = "//mongodb+srv://izadmin:izoriginals2026@iz-originals.qpn2qzd.mongodb.net/izoriginals?retryWrites=true&w=majority&authSource=admin";


const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await client.connect();
    console.log("✅ SUCCESS! Connected successfully to server.");
  } catch (err) {
    console.error("❌ FAILED TO CONNECT:");
    console.error(err.message);
  } finally {
    await client.close();
  }
}

run();
const mongoose = require('mongoose');
const { config } = require('../config/secret');
require("dotenv").config();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@toy.tifqmd5.mongodb.net/toys`);
  console.log("mongo connect toys")
}
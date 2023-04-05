//First we require mongoose in our beat.js file
const mongoose = require("mongoose");

// Then we define Schema as the mongoose.Schema method
// mongoose Schemas define the structure of the data records (also known as documents // in MongoDB)
const Schema = mongoose.Schema;

// We use the new operator to create a new Schema and we define the fields,
// For this one I am just going to use beat request and timestamp.
// Also for valid data types you can check the mongoose docs (string, number etc)
const schema = new Schema({
  request: String,
  timestamp: String
});

// Now we create a new mongoose model with the name and the schema
const Beat = mongoose.model("Beat", schema);

// Finally we export the Model and the Schema so we can use it in our other files!
module.exports = { Beat, schema };
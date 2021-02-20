// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema
var definitionSchema = new Schema({
  authorName: String,
  dateCreated: Date,
  defintion: String,
  quality: Number,
  likes: Number,
});

// Make schema available to the application
module.exports = definitionSchema;
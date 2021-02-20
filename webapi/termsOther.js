// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const definitionSchema = require('./definition.js');
// Entity schema
var EnglishTermOtherSchema = new Schema({
  wordEnglish: String,
  wordNonEnglish: String,
  wordExpanded: String,
  languageCode: String,
  image: String,
  imageType: String,
  audio: String,
  audioType: String,
  linkAuthoritative: String,
  linkWikipedia: String,
  linkYoutube: String,
  authorName: String,
  dateCreated: Date,
  dateRevised: Date,
  fieldOfStudy: String,
  helpYes: Number,
  helpNo: Number,
  definitions: [definitionSchema],
  termsEnglishID: {type: Schema.Types.ObjectId, ref:"EnglishTermSchema"}
});

// Make schema available to the application
module.exports = EnglishTermOtherSchema;

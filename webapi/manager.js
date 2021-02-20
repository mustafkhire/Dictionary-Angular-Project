// ################################################################################
// Data service operations setup

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Load the schemas...

// Data entities; the standard format is:
const EnglishTermSchema = require('./termsEnglish');
const EnglishTermOtherSchema = require('./termsOther');
const definitionSchema = require('./definition');



// ################################################################################
// Define the functions that can be called by server.js

module.exports = function () {

  // Collection properties, which get their values upon connecting to the database
  let TermEnglish;
  let TermOther;
  let Definition;

  return {

    // ############################################################
    // Connect to the database

    connect: function () {
      return new Promise(function (resolve, reject) {

        // Create connection to the database
        console.log('Attempting to connect to the database...');

        // The following works for localhost...
        // Replace the database name with your own value
        //mongoose.connect('mongodb://localhost:27017/db-a2', { connectTimeoutMS: 5000, useUnifiedTopology: true });

        // This one works for MongoDB Atlas...
        // (to be provided)
        mongoose.connect('mongodb+srv://mk259:password259@senecaweb-rmfvv.mongodb.net/db-a2?retryWrites=true&w=majority', { connectTimeoutMS: 5000, useUnifiedTopology: true });

        // From https://mongoosejs.com/docs/connections.html
        // Mongoose creates a default connection when you call mongoose.connect(). 
        // You can access the default connection using mongoose.connection.
        var db = mongoose.connection;

        // Handle connection events...
        // https://mongoosejs.com/docs/connections.html#connection-events
        // The data type of a connection event is string
        // And more than one connection event may be emitted during execution

        // FYI the Node.js EventEmitter class docs is here...
        // https://nodejs.org/api/events.html#events_class_eventemitter

        // Handle the unable to connect scenario
        // "on" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
        db.on('error', (error) => {
          console.log('Connection error:', error.message);
          reject(error);
        });

        // Handle the open/connected event scenario
        // "once" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
        db.once('open', () => {
          console.log('Connection to the database was successful');

          TermEnglish = db.model("TermsEnglish", EnglishTermSchema, "englishTerms");
          TermOther = db.model("TermsOther", EnglishTermOtherSchema, "nonEnglishTerms");
          Definition = db.model("definitions", definitionSchema, "otherTerms");
          
          resolve();
        });
      });
    },
    



    // ############################################################
    // termEnglish requests

    termEnglishGetAll: function () {
      return new Promise((resolve, reject) => {
        TermEnglish.find()
          .sort({ name: 'asc' })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    getEnglishTermsByID: function(termID) {
        return new Promise((resolve, reject) => {
            TermEnglish.findById(termID)
            .exec((error, item) => {
              if (error) {
                return reject(error.message);
              }
  
              if (item) {
                return resolve(item);
              } else {
                return reject("English Term could not be found!");
              }
            });
        });
      },

      getEnglishTermsByWordEnglish: async function(name) {
        try {
          const foundTerm = await TermEnglish.find({
            wordEnglish: {$regex: name, $options: "i"}
          });
          return foundTerm;
        } catch (error) {
          return error;
        }
      }
      ,
      EnglishTermsAdd: async function (newItem) {
        // Attempt to create a new item
        let englishTerm = TermEnglish.create(newItem);
        if (englishTerm) {
          return englishTerm;
        }
        else {
          throw "Not found";
        }
      },

    // ############################################################
    // termOther requests
    termOtherGetAll: function () {
        return new Promise((resolve, reject) => {
          TermOther.find()
            .sort({ name: 'asc' })
            .exec((error, items) => {
              if (error) {
                // Query error
                return reject(error.message);
              }
              // Found, a collection will be returned
              return resolve(items);
            });
        });
      },
  
    getTermsOtherByID: function(termID) {
        return new Promise((resolve, reject) => {
            TermOther.findById(termID)
            .exec((error, item) => {
                if (error) {
                return reject(error.message);
                }

                if (item) {
                return resolve(item);
                } else {
                return reject("English Term could not be found!");
                }
            });
        });
    },

    getTermsOtherByWordEnglish: async function(name) {
        try {
            const foundTerm = await TermOther.find({
            wordEnglish: {$regex: name, $options: "i"}
            });
            return foundTerm;
        } catch (error) {
            return error;
        }
    },
    TermsOtherAdd: async function (newItem) {

        // Attempt to create a new item
        let termsOther = TermOther.create(newItem);
        if (termsOther) {
            return termsOther;
        }
        else {
            throw "Not found";
        }
    },

    //edit English term function

    editEnglishAddDefinition: async function (termID, newItem) {

        // Attempt to locate the existing document
        let def = await TermEnglish.findById(termID);
        
        if (def) {
          // Add the new subdocument and save
          def.definitions.push(newItem);
          await def.save();
          return def;
        }
        else {
          // Uh oh, "throw" an error
          throw "Not found";
        }
    },

    editEnglishIncrementHelpYes: async function(word) {
        try {
          const updatedWord = await TermEnglish.findOneAndUpdate(
            { wordEnglish: word },
            { $inc: { helpYes: 1 } },
            { new: true }
          );
          return updatedWord;
        } catch (error) {
          return error;
        }
      },

      editEnglishIncrementHelpNo: async function(word) {
        try {
          const updatedWord = await TermEnglish.findOneAndUpdate(
            { wordEnglish: word },
            { $inc: { helpNo: 1 } },
            { new: true }
          );
          return updatedWord;
        } catch (error) {
          return error;
        }
      },

      editEnglishTermUpdateLikes: async function(itemId) {
        let term = await TermEnglish.findOne({
          "definitions._id": itemId
        });
  
        if (term) {
          let def = term.definitions.id(itemId);
          def.likes++;
          await term.save();
          return term;
        } else {
          throw "Not found";
        }
      },

      //edit Non English term function
    editNonEnglishAddDefinition: async function (termID, newItem) {

        // Attempt to locate the existing document
        let def = await TermOther.findById(termID);
        
        if (def) {
          // Add the new subdocument and save
          def.definitions.push(newItem);
          await def.save();
          return def;
        }
        else {
          // Uh oh, "throw" an error
          throw "Not found";
        }
    },

    editNonEnglishIncrementHelpYes: async function(word) {
        try {
          const updatedWord = await TermOther.findOneAndUpdate(
            { wordEnglish: word },
            { $inc: { helpYes: 1 } },
            { new: true }
          );
          return updatedWord;
        } catch (error) {
          return error;
        }
    },
    
    editNonEnglishIncrementHelpNo: async function(word) {
        try {
          const updatedWord = await TermOther.findOneAndUpdate(
            { wordEnglish: word },
            { $inc: { helpNo: 1 } },
            { new: true }
          );
          return updatedWord;
        } catch (error) {
          return error;
        }
    },
    editNonEnglishTermUpdateLikes: async function(itemId) {
        let term = await TermOther.findOne({
          "definitionID._id": itemId
        });
  
        if (term) {
          let def = term.definitions.id(itemId);
          def.likes++;
          await term.save();
          return term;
        } else {
          throw "Not found";
        }
      }
   
    

   

  } // return statement that encloses all the function members

} // module.exports
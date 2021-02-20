// ################################################################################
// Web service setup
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better
// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());
// ################################################################################
// Data model and persistent store setup
const manager = require("./manager.js");
const m = manager();
// ################################################################################
// Deliver the app's home page to browser clients
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
// ################################################################################
// Resources available in this web API

app.get("/api", (req, res) => {
  // Here are the resources that are available for users of this web API...
  // YOU MUST EDIT THIS COLLECTION
  const links = [];
  // This app's resources...
  links.push({ "rel": "collection", "href": "/api/terms/english", "methods": "GET,POST" });

  links.push({ "rel": "collection", "href": "/api/terms/other", "methods": "GET,POST" });

  
  const linkObject = {
    "apiName": "Assignment 2",
    "apiDescription": "Web API with Angular",
    "apiVersion": "1.0",
    "apiAuthor": "Mustaf Khire",
    "links": links
  };
  res.json(linkObject);
});

// ################################################################################
// Request handlers for data entities (listeners)

// Get all English Term

app.get("/api/terms/english", (req, res) => {
    // Call the manager method
    m.termEnglishGetAll()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).json({ "message": error });
      })
  });
  // Get one
  app.get("/api/terms/english/:id", (req, res) => {
    // Call the manager method
    m.getEnglishTermsByID(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  //get terms by english word
  app.get("/api/terms/english/word/:word", (req, res) => {
    // Call the manager method
    m.getEnglishTermsByWordEnglish(req.params.word)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

//OtherTerm

  app.get("/api/terms/other", (req, res) => {
    // Call the manager method
    m.termOtherGetAll()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).json({ "message": error });
      })
  });

  app.get("/api/terms/other/:id", (req, res) => {
    // Call the manager method
    m.getTermsOtherByID(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  app.get("/api/terms/other/word/:word", (req, res) => {
    // Call the manager method
    m.getTermsOtherByWordEnglish(req.params.word)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });


 //POST ENGLISH
  // Add new
  app.post("/api/terms/english", (req, res) => {
    // Call the manager method
    m.EnglishTermsAdd(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).json({ "message": error });
      })
  });

  //POST NON ENGLISH
  app.post("/api/terms/other", (req, res) => {
    // Call the manager method
    m.TermsOtherAdd(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).json({ "message": error });
      })
  });


  //PUT English
  // Edit existing
  app.put("/api/terms/english/:id/add-definition", (req, res) => {
    // Call the manager method
   
    m.editEnglishAddDefinition(req.params.id,req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  app.put("/api/terms/english/helpyes/:id", (req, res) => {
    // Call the manager method

    m.editEnglishIncrementHelpYes(req.params.id,req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  app.put("/api/terms/english/helpno/:id", (req, res) => {
    // Call the manager method
    m.editEnglishIncrementHelpNo(req.params.id,req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  app.put("/api/terms/english/definition-like/:id", (req, res) => {
    // Call the manager method
    m.editEnglishTermUpdateLikes(req.params.id,req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  //PUT Term Other
  app.put("/api/terms/other/:id/add-definition", (req, res) => {
    // Call the manager method
    m.editNonEnglishAddDefinition(req.params.id,req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });
  app.put("/api/terms/other/helpyes/:id", (req, res) => {
    // Call the manager method
    m.editNonEnglishIncrementHelpYes(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  app.put("/api/terms/other/helpno/:id", (req, res) => {
    // Call the manager method
    m.editNonEnglishIncrementHelpNo(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  app.put("/api/terms/other/definition-like/:id", (req, res) => {
    // Call the manager method
    m.editNonEnglishTermUpdateLikes(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

  /* // Delete item
  app.delete("/api/vehicles/:id", (req, res) => {
    // Call the manager method
    m.vehicleDelete(req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
  
  });*/
// ################################################################################
// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send("Resource not found");
});
// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect().then(() => {
  app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
})
  .catch((err) => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
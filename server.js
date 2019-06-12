const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000; 

// Initialize Express
const app = express();

// Middlest of Wares!

// Morgan for the logs...
app.use(logger("dev"));
// Parse JSON req body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static Public Folder
app.use(express.static("public"));

// Must Connect to Mongo
mongoose.connect("add URL", { useNewUrlParser: true });

// ROUTES

//GET to the website...
app.get("/scrape", function(req, res) {
    // axios to get the html body
    axios.get("https://www.example.com").then(function(response) {
        // Load into CHEERIO and save to $ as a shorthand selector
        const $ = cheerio.load(response.data);
    })
})
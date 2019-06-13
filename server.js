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
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Static Public Folder
app.use(express.static("public"));

// Must Connect to Mongo
mongoose.connect("mongodb://localhost:27017/myapp", {useNewUrlParser: true});

// ROUTES

//GET to the website...
app.get("/scrape", function (req, res) {
    // axios to get the html body
    axios.get("https://lp.reverb.com/c/auctions").then(function (response) {
        // Load into CHEERIO and save to $ as a shorthand selector
        const $ = cheerio.load(response.data);


        $(".tiles h4").each(function (i, element) {
            let result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                })
        })
        res.send("Scrape Complete");
    });
});

// GET for getting all Articles from the db
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// GET to Find an Article

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        })
})

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
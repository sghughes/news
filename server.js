var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require("express-handlebars");

//scraping
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
var db = require('./models');

var PORT = 3000;

// Initialize Express
var app = express();


app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/unit18Populater', { useNewUrlParser: true });

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function(req,res){
    res.render('index');
})

app.get('/scrape', function(req,res){
    //TODO CHANGE THIS LINK
    axios.get('http://www.echojs.com/').then(function(response){
        var $ = cheerio.load(response.data);

        $('article h2').each(function(i, element){
            var result = {};

            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });

        res.send('Scrape is done');
    });
});

app.get('/articles', function(req,res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.get('/articles/:id', function(req,res){
    db.Article.findOne({_id:req.params.id})
    .populate('note')
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post('/articles/:id',function(req,res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function(){
    console.log('App running on port ' + PORT);
});
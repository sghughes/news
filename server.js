var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require("express-handlebars");


//scraping
var axios = require('axios');
var cheerio = require('cheerio');

//Require all models
var db = require('./models');

var PORT = process.env.PORT || 3000;

//Initialize Express
var app = express();


app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Make public a static folder
app.use(express.static('public'));

//Connect to Mongo
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function(req,res){
    db.Article.find({},function(error, data){
        var hbsObject = {
            article: data
        };
        res.render('index', hbsObject);
    })

})

app.get('/scrape', function(req,res){
    
    axios.get('http://www.nytimes.com').then(function(response){
        var $ = cheerio.load(response.data);


        $('.assetWrapper').each(function(i, element){

            var title = $(this).find('h2').text().trim();
            var link = $(this).find('a').attr('href');
            var editedLink = 'http://www.nytimes.com' + link;
            var summary = $(this).find('p').text().trim();

            var newArticle = {
                title: title,
                link: editedLink,
                summary: summary
            };

            db.Article.create(newArticle).then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });

        res.send('Scrape is done');
        window.location('/');
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

//Need help with this
app.delete('/articles/:id', function(req, res){
    db.Note.remove({ _id: req.params.id }).then(function(dbNote){
        res.json(dbNote);
    });
});

app.listen(PORT, function(){
    console.log('App running on port ' + PORT);
});


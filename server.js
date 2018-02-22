const express = require('express');
const {mongoose} = require("./db/mongoose");
const {Query} = require("./models/query");
const axios = require('axios');
const hbs = require('hbs');


hbs.registerPartials(__dirname + '/views/partials');

const port = process.env.PORT || 3000;

const type = "https://quiet-hollows-81269.herokuapp.com/" || "http://localhost:3000/";

var app = express();
app.use(express.static('public'));
app.set('view engine', hbs);

app.get('/', (req, res) => {
    res.render('home.hbs', {
                listObject: [],
    });
});

app.get('/list', (req, res) => {
    Query.find({}, {__v: 0, _id: 0}).then((queries) => {
        if(queries == ""){
          res.status(400).send("No queries have been done before");
        } else {

          res.render('list.hbs', {
                listObject: queries,
    });
        }
        
    }, (e) => {
        res.status(400).send(e);
    });
    
});

app.get('/:search', (req, res) => {
    
  
    
    
    console.log(req.query.offset);
    var url = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(req.params.search) + '&cx=016277566272038559019:uuh7p6hteq8&num='+ req.query.offset + '&&searchType=image&key=AIzaSyBQU1ZNQG9JxU2Ffs1YsMCZwCAfIjbxhKc';

    axios.get(url)
        .then((response) => {
            var dataArray =  response.data.items;
            var dataClean = dataArray.map(el => {
                return {
                        imgTitle: el.title, 
                        imgLink: el.link, 
                        imgSnippet: el.snippet, 
                        imgThumbnail: el.image.thumbnailLink, 
                        imgContext: el.image.contextLink
                  }
            });
            console.log(dataClean);
            res.render('home.hbs', {
                listObject: dataClean,
            });
        
        const query = new Query({search: req.params.search, searchImage: dataClean[0].imgLink});
    
        query.save()
        .then(() => {}, (e) => {
            res.status(400).send(e);
        });
        })
        .catch((e) => {console.log(e.message)});
});

 

app.listen(port,() => {
    console.log("Server is up on port " + port)
});
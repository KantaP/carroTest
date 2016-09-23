var express = require('express');
var exphbs = require('express-handlebars');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/search/:productname', function(req, res) {
    var url = `http://www.priceza.com/search?productdataname=${req.params.productname}`
    request(url, function(error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            var json = { count: '', release: '' }

            $('.head-name').filter(function() {
                var data = $(this);
                title = data.children().first().text();
                json.count = title;
            })

            res.send(json)

        }
    })
})

app.get('/search/:productname/:page', function(req, res) {
    var url = `http://www.priceza.com/search?category=0&page=${req.params.page}&sort=1&productdataname=${req.params.productname}`
    request(url, function(error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            var json = { title: [], price: [], pic: [] }

            $('.item').find('h3').each(function(i, elem) {
                json.title[i] = $(this).text()
            })

            $('.info').find('.price').each(function(i, elem) {
                json.price[i] = $(this).html()
            })

            res.send(json)

        }
    })
})

app.listen(3001, function() {
    console.log('Listen on 3001')
});
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

app.get('/', function(request, response) {
  // response.send('Hey, something went terribly wrong!')
  response.render('index', {title: 'Home'})
});

app.get('/about', function(request, response) {
    response.render('about', {title: 'About'})
});

app.get('/gallery', function(request, response) {
    response.render('gallery', {title: 'Gallery'})
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

var express = require('express');
var bodyParser = require('body-parser');
var counter = require('./counter.js');
var feedback = require('./feedback.js');
var poll = require('./poll.js');
var app = express();

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'jade');

// parse application/json
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use(function(request, response, next) {
//    counter.eraseStats();
    next();
});

app.get('/', function(request, response) {
//    response.send('Hey, something went terribly wrong!')
    response.render('index', {title: 'Home', counter: counter.get(request)})
});

app.get('/about', function(request, response) {
    response.render('about', {title: 'About', counter: counter.get(request)})
});

app.get('/gallery', function(request, response) {
    response.render('gallery', {title: 'Gallery', counter: counter.get(request)})
});

app.get('/feedback', function(request, response) {
//    feedback.eraseComments();
//    feedback.eraseUsers();
    response.render('feedback', {title: 'Feedback', counter: counter.get(request), comments: feedback.get()});
});

app.get('/poll', function(request, response) {
    response.render('poll', {title: 'Poll', counter: counter.get(request)})
});

app.get('/stats', function(request, response) {
   response.send(poll.get()); 
});

app.post('/feedback', function(request, response) {
    feedback.add(request, function (error){
        response.render('feedback', {title: 'Feedback', counter: counter.get(request), 
            comments: feedback.get(), error: error});
    });
});

app.post('/poll', function(request, response) {
    poll.vote(request, function(status){
        response.status(status).end();
    });
//    response.render('poll', {title: 'Poll', counter: counter.get(request)});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

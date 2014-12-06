//var dialog = require('dialog');
var pgQuery = require('./utils').pgQuery;
var users = [];
var comments = [];

// Initialization
pgQuery('SELECT name, date_posted, comment_text FROM users JOIN comments ON comments.user_id = users.id', 
    [], function(result){
    comments = result.rows;
});

pgQuery('SELECT name, password FROM users', [], function(result){
    users = result.rows;
});

exports.add = function(request, callback) {
    var text = request.body.text, date = new Date(), login = request.body.login;
    var minInterval = 60000; // 1 minute
    if (!text) {
//        dialog.info("Comment cannot be empty", "Error");
        callback();
        return;
    }
    if (!login) {
        login = "Anonymous"
    }
    var recentComment = getMostRecent(login);
    if (recentComment) {
        var date2 = recentComment.date_posted;
        if (date - date2 < minInterval) {
//            dialog.info("Wait 1 minute before posting", "Error");
            callback();
            return;
        } 
    }
    if (login != "Anonymous" && !checkPassword(login, request.body.password)) {
//        dialog.info("Wrong password", "Error");
        callback();
        return;
    }
    pgQuery('SELECT id FROM users WHERE name = $1', [login], function(result) {
        if (result.rows[0]) {
            var user_id = result.rows[0].id;
            var comment = {name: login, date_posted: date, comment_text: text};
            comments.unshift(comment);
            callback();
            pgQuery('INSERT INTO comments(user_id, date_posted, comment_text) VALUES ($1, $2, $3)', [user_id, date, text]);
        }
        else {
            callback();
//            dialog.info("This nickname is not registered", "Error");
        }
    });
};

exports.get = function() {
    return comments;
};

exports.eraseComments = function () {
    comments = [];
    pgQuery('TRUNCATE TABLE comments RESTART IDENTITY');  
};

exports.eraseUsers = function () {
    pgQuery('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    pgQuery("INSERT INTO users (name, password) VALUES ('Admin', 'admin')");
    pgQuery("INSERT INTO users (name, password) VALUES ('Anonymous', '')");
    pgQuery('SELECT name, password FROM users', [], function(result){
        users = result.rows;
    });
};

function getMostRecent(name) {
    var min = new Date(0);
    var ret;
    for (var i in comments) {
        if (comments[i].name == name) {
            if (comments[i].date_posted > min) {
                min = comments[i].date_posted;
                ret = comments[i];
            }
        }
    }
    return ret;
}

function checkPassword(name, password) {
    for (var i in users) {
        if (users[i].name == name) {
            return users[i].password == password;
        }
    }
    return true;
}
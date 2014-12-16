var stats = {sum: 0, votes: [0, 0, 0, 0, 0]};
var clients = [];

var utils = require('./utils');

exports.vote = function(request, callback) {
//    console.log('body:', request.body);
    var ip = utils.getIp(request);
    var ua = utils.parseUa(request.headers["user-agent"]);
    var browser = ua.browser.name;
    var version = ua.browser.version;
    var id = ip+browser+version;
//    console.log(id);
    for (var i in clients) {
        if (clients[i] == id) {
            callback(403);
            return;
        }
    }
    clients.push(id);
    var name = parseInt(request.body.group1) - 1;
    if(stats.votes[name] !== undefined) {
        stats.votes[name]++;
        stats.sum++;
    }
    callback(200);
};

exports.eraseStats = function () {
    stats.sum = 0;
    stats.votes = [0, 0, 0, 0, 0];
    clients = [];
};

exports.get = function() {
    return JSON.stringify(stats);
};
var pgQuery = require('./utils').pgQuery;
var parseUa = require('./utils').parseUa;

var data = {};

//eraseStats();

// Initialization
pgQuery('SELECT browser, version, ip FROM visitors', [], function(result){data.visitors = result.rows});
pgQuery('SELECT * FROM counter', [], function(result){data.hits = result.rows[0].hits;});

exports.increment = function (request) {
    var ip = request.ip;
//    var parsedUa = parseUa(request.headers["user-agent"]);
    var parsedUa = parseUa(request.headers["x-forwarded-for"]);
    var browser = parsedUa.browser.name;
    var version = parsedUa.browser.version;
    
    if (uniqueHit(browser, version, ip)) {
        data.hits++;
        data.visitors.push({browser: browser, version: version, ip: ip});

        pgQuery('UPDATE counter SET hits = $1', [data.hits]);
        pgQuery('INSERT INTO visitors(browser, version, ip) VALUES ($1, $2, $3)', [browser, version, ip]);
    }
};

exports.get = function () {
    return data.hits;
};

exports.eraseStats = function() {
    data.counter = 0;
    data.visitors = [];
    pgQuery('TRUNCATE TABLE visitors RESTART IDENTITY');
    pgQuery('UPDATE counter SET hits = 0');
};

exports.uniqueHit = uniqueHit;

var uniqueHit = function(browser, version, ip) {
    if (!ip || browser.toLowerCase() == "curl" || browser.toLowerCase() == "wget")
        return false;
    for (var i in data.visitors) {
        if (browser+version+ip == data.visitors[i].browser+data.visitors[i].version+data.visitors[i].ip)
            return false;
    }
    return true;
};

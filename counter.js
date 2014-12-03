var fs = require('fs');
var pg = require('pg');
var UAParser = require('ua-parser-js');

var data = {};
var conString = process.env.DATABASE_URL;

// Initialization
pgQuery('SELECT browser, version, ip FROM visitors', [], function(result){data.visitors = result.rows});
pgQuery('SELECT * FROM counter', [], function(result){data.hits = result.rows[0].hits;});

exports.increment = function (request) {
    var ip = request.ip;
    var parsedUa = parseUa(request.headers["user-agent"]);
    var browser = parsedUa.browser.name;
    var version = parsedUa.browser.version;
    
    if (uniqueHit(browser, version, ip)) {
        data.hits++;
        data.visitors.push({browser: browser, version: version, ip: ip});

        pgQuery('UPDATE counter SET hits = $1', [data.hits]);
        pgQuery('INSERT INTO visitors(browser, version, ip) values ($1, $2, $3)', [browser, version, ip]);
    }
};

exports.get = function () {
    return data.hits;
};

exports.eraseStats = function() {
    pgQuery('DELETE FROM visitors');
    pgQuery('UPDATE counter SET hits = 0');
};

function parseUa(ua) {
    var ownBrowser = [[/(curl|wget)\/((\d+)?[\w\.]+)/i],
        [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION, UAParser.BROWSER.MAJOR]];
    var parser = new UAParser(ua, {browser: ownBrowser});
    return parser.getResult();
}

function uniqueHit(browser, version, ip) {
    if (browser.toLowerCase() == "curl" || browser.toLowerCase() == "wget")
        return false;
    for (var i in data.visitors) {
        if (browser+version+ip == data.visitors[i].browser+data.visitors[i].version+data.visitors[i].ip)
            return false;
    }
    return true;
}

function pgQuery(query, args, handler) {
    pg.connect(conString, function (err, client, done) {
        client.query(query, args, function (err, result) {
            done();
            if (err) console.error(err);
            else {
                if (handler)
                    handler(result);
            }
        });
    });
}

exports.writeRequest = function (request, filename) {
    var cache = [];
    fs.writeFile("./"+filename+".json", JSON.stringify(request, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }));
    cache = null;
};
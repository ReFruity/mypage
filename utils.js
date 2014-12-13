var UAParser = require('ua-parser-js');
var pg = require('pg');
var conString = process.env.DATABASE_URL;

exports.pgQuery = function(query, args, handler) {
    pg.connect(conString, function (err, client, done) {
        client.query(query, args, function (err, result) {
            done();
            if (err) console.error('Postgres query error:', err);
            else {
                if (handler)
                    handler(result);
            }
        });
    });
};

exports.parseUa = function(ua) {
    var ownBrowser = [[/(curl|wget)\/((\d+)?[\w\.]+)/i],
        [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION, UAParser.BROWSER.MAJOR]];
    var parser = new UAParser(ua, {browser: ownBrowser});
    return parser.getResult();
};

exports.getIp = function(request) {
    var ip = request.headers["x-forwarded-for"];
    if (ip){
        var list = ip.split(",");
        ip = list[list.length-1];
    } else {
        ip = request.ip;
    }
    return ip;
};

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
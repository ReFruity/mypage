var pgQuery = require('./utils').pgQuery;
var parseUa = require('./utils').parseUa;
var getIp = require('./utils').getIp;

var data = {};
const minInterval = 60000; // 1 minute

// Initialization
pgQuery('SELECT browser, version, ip, visits, today, last FROM visitors', 
    [], function(result){data.visitors = result.rows});
pgQuery('SELECT * FROM counter', [], function(result){data.hits = result.rows[0].hits;});

exports.get = function (request) {
    var ip = getIp(request);
    var parsedUa = parseUa(request.headers["user-agent"]);
    var browser = parsedUa.browser.name;
    var version = parsedUa.browser.version;
    
    var visitorIndex = getVisitorIndex(browser, version, ip);
    if (visitorIndex == -2) return {};
    var date = new Date();
    var last = date; // First visit is now
    var visits = 1;
    var today = 1;
    if (visitorIndex == -1) { // It is first visit
        data.hits++;
        data.visitors.push({browser: browser, version: version, ip: ip, visits: visits, today: today, last: last});

        pgQuery('UPDATE counter SET hits = $1', [data.hits]);
        pgQuery('INSERT INTO visitors(browser, version, ip, visits, today, last) VALUES ($1, $2, $3, $4, $5, $6)', 
            [browser, version, ip, visits, today, last]);
    }
    else { 
//        console.log(data.visitors[visitorIndex]);
        last = data.visitors[visitorIndex].last; // Remember last visit timestamp
        if (date - last > minInterval) { // Update values
            visits = data.visitors[visitorIndex].visits + 1;
            today = data.visitors[visitorIndex].today + 1;
//            console.log("today", data.visitors[visitorIndex].today);
            if (last.toDateString() != date.toDateString())
                today = 1;
            data.visitors[visitorIndex].visits = visits;
            data.visitors[visitorIndex].today = today;
            data.visitors[visitorIndex].last = date;
            pgQuery('UPDATE visitors SET visits = $1, today = $2, last = $3 WHERE id = $4', 
                [visits, today, date, visitorIndex + 1]);
        }
        else { // Page was refreshed too fast
            visits = data.visitors[visitorIndex].visits;
            today = data.visitors[visitorIndex].today;
        }
    }
    return { browser: browser, version: version, hits: data.hits, visits: visits, last: last, today: today };
};

exports.eraseStats = function() {
    data.hits = 0;
    data.visitors = [];
    pgQuery('TRUNCATE TABLE visitors RESTART IDENTITY');
    pgQuery('UPDATE counter SET hits = 0');
};

var uniqueHit = function(browser, version, ip) {
    if (!ip || browser.toLowerCase() == "curl" || browser.toLowerCase() == "wget")
        return false;
    for (var i in data.visitors) {
        if (browser+version+ip == data.visitors[i].browser+data.visitors[i].version+data.visitors[i].ip)
            return false;
    }
    return true;
};

var getVisitorIndex = function (browser, version, ip) {
    if (!ip || browser.toLowerCase() == "curl" || browser.toLowerCase() == "wget")
        return -2;
    for (var i in data.visitors) {
        if (browser+version+ip == data.visitors[i].browser+data.visitors[i].version+data.visitors[i].ip)
            return i;
    }
    return -1;
};

exports.getVisitorIndex = getVisitorIndex;
exports.uniqueHit = uniqueHit;
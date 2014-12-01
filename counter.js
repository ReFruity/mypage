var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();

var data = {};

exports.init = function () {
    fs.readFile('./counter.xml', function(err, xmlText) {
        parser.parseString(xmlText, function (err, result) {
//            console.log(result);
            data.counter = parseInt(result.counter || 0); 
        });
    });
};

exports.save = function () {
    var xml = builder.buildObject(data);
    fs.writeFile("./counter.xml", xml);
};

exports.increment = function (request) {
//    this.writeRequest(request, "requestmoz");
//    request.connection["user-id"];
//    data.lastip = request.connection.remoteAddress;
//    request.getCo
//    if (request.message.method != '')
    var uid = request.ip + request.headers["user-agent"];
//    console.log(uid);
    if (!data[uid]) {
        data[uid] = 1;
        data.counter++;
    }
    this.save();
};

exports.get = function () {
    return data.counter;
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
//    console.log(request.headers["user-agent"]);
};
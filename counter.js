var fs = require('fs');
var pg = require('pg');

var data = {};

exports.init = function () {
//    fs.readFile('./counter.xml', function(err, xmlText) {
//        parser.parseString(xmlText, function (err, result) {
//            data.counter = parseInt(result.counter) || 0; 
//        });
//    });
//    if (!data.entries) data.entries = [];
};

exports.save = function () {
//    var xml = builder.buildObject(data);
//    fs.writeFile("./counter.xml", xml);
};

exports.increment = function (request) {
//    var uid = request.ip + request.headers["user-agent"];
//    if (data.entries.indexOf(uid) == -1) {
//        data.entries.push(uid);
//        data.counter++;
//    }
//    this.save();
};

exports.get = function () {
    return 0;
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
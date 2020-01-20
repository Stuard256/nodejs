var http = require('http');
var data = require('./data');
var fs = require('fs');
var url = require('url');

var port = 5000;
var db = new data.DB();

var sd = null;
var sc = null;
var ss = null;

db.on('GET', (req, res) => {
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(JSON.stringify(db.select()));
});

db.on('POST', (req, res) => {
    req.on('data', (chunk) => {
        let data = JSON.parse(chunk);
        if (db.insert(data)) {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(409, { 'Content-type': 'text/plain' });
            res.end('duplicate ID was found');
        }
    });
});

db.on('PUT', (req, res) => {
    req.on('data', (chunk) => {
        let data = JSON.parse(chunk);
        if (db.update(data)) {
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('updated successfully');
        } else {
            res.writeHead(404, { 'Content-type': 'text/plain' });
            res.end('current ID was not found');
        }
    });
});

db.on('COMMIT', () => {
    db.commit();
});

db.on('DELETE', (req, res) => {
    let queryId = url.parse(req.url, true).query.id;
    if (typeof queryId != 'undefined') {
        queryId = parseInt(queryId);
        if (db.delete(queryId)) {
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('deleted ' + queryId);
        }
        else {
            res.writeHead(404, { 'Content-type': 'text/plain' });
            res.end('current ID was not found');
        }
    }
});

process.stdin.on('readable', () => {
    let args = process.stdin.read().toString().split(' ');
    let command = args[0];
    let value = parseInt(args[1]);
    if (command == 'sd') {
        if (!!value) {
            value = parseInt(value);
            if (sd != null) {
                clearTimeout(sd);
                sd = null;
                console.log('Previous sd was interrupted');
            }
            sd = setTimeout(function () { process.exit(); }, value * 1000);
            console.log(`Server will be halted down after ${value} seconds!`);
        } else {
            clearTimeout(sd);
            sd = null;
            console.log('Previous sd was interrupted');
        }
        process.stdin.resume();
    } else if (command == 'sc') {
        if (!!value) {
            let value = parseInt(args[1]);
            if (sc != null) {
                clearInterval(sc);
                sc = null;
            }
            sc = setInterval(() => { db.emit('COMMIT'); }, value * 1000);
            process.stdin.resume();
        } else {
            clearInterval(sc);
            sc = null;
            process.stdin.resume();
        }
    } else if (command == 'ss') {
        if (args[1] == undefined) {
            process.stdin.resume();
            return;
        } else {
            let value = parseInt(args[1]);
            if (ss != null) {
                clearTimeout(ss);
                ss = null;
            }
            ss = setTimeout(() => {
                ss = null;
                console.log(db.getStat());
            }, value * 1000);
            console.log("Data statistics collection started!");
            db.reset();
            process.stdin.resume();
        }
    }
    process.stdin.resume();
});

http.createServer((request, response) => {
    const pathName = url.parse(request.url).pathname;
    if (pathName == '/api/db') {
        db.emit(request.method, request, response);
    } else if (pathName == '/') {
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-type': 'text/html'});
        response.end(html);
    } else if (pathName == '/api/ss') {
        response.writeHead(200, {'Content-type': 'application/json'});
        response.end(JSON.stringify(db.getResult()));
    }
}).listen(5000);

console.log(`server running at http://127.0.0.1:${port}`);
var http = require('http');
var data = require('./data');
var fs = require('fs');
var url = require('url');

var port = 5000;
var db = new data.DB();

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
        }else {
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
            res.writeHead( 404 , { 'Content-type': 'text/plain' });
            res.end('current ID was not found');
        }


    });
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


http.createServer((request, response) => {
    const pathName = url.parse(request.url).pathname;
    if (pathName == '/api/db') {
        db.emit(request.method, request, response);
    } else if (pathName == '/') {
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-type': 'text/html'});
        response.end(html);
    }
}).listen(5000);

console.log(`server running at http://127.0.0.1:${port}`);
let http = require('http');
let fs = require('fs');
let url = require('url');
const { parse } = require('querystring');

let sendmail = require('sendmail')();

let http_handler = (req, resp) => {
    resp.writeHead(200, { 'Content-type': 'text/html; charset=utf-8' });
    if (url.parse(req.url).pathname == '/' && req.method == 'GET') {
        resp.end(fs.readFileSync('./index.html'));
    } else if (url.parse(req.url).pathname == '/' && req.method == 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            let parm = parse(body);

            sendmail({
                from: `${parm.from}`,
                to: `${parm.to}`,
                subject: 'NO SPAM BRO',
                html: `<h1> ${parm.message} </h1>`
            }, function (err, reply) {
                console.log(err && err.stack)
                console.dir(reply)
            });

            resp.end(`<h1>OK BOOMER: ${parm.from}, ${parm.to}, ${parm.message} </h1>`)
        })
    } else resp.end('<h1> Not support </h1>');
}

let server = http.createServer(http_handler);
server.listen(5000);
console.log("http://localhost:5000");
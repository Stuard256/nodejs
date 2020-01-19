const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    let result = '';
    result += `<b>Method:</b> ${req.method}<br>`;
    result += `<b>Url:</b> ${req.url}<br>`;
    result += `<b>User-agent:</b> ${req.headers['user-agent']}<br>`;
    result += `<b>Http version:</b> ${req.httpVersion}<br>`;

    req.on('data', (chunk)=>{
        result += chunk;
    });

    req.on('end', () => {
        res.end(result);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
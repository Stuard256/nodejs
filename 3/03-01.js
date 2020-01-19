var http = require('http');
var process = require('process');

const states = ['norm', 'idle', 'stop']
var currentState = states[0];

process.stdin.setEncoding('UTF-8');

http.createServer((request, response) => {
    response.writeHead(200, {'Content-type': 'text/html'});
    response.end(`<h1>${currentState}</h1>`);
}).listen(3000);

console.log('Server running at http://127.0.0.1:3000');
process.stdin.on('readable', () => {
    let chunk = process.stdin.read();
    if (chunk != null) {
        chunk = chunk.toLowerCase().trim();
        if (chunk == 'exit') process.exit(0);
        else if (states.includes(chunk)) {
            process.stdout.write(`${currentState}\t->\t${chunk}\r\n`);
            currentState = chunk;
        } else { process.stdout.write(`${chunk}\r\n`);}
    }
});
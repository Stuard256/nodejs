var http = require('http');
var url = require('url');
var fs = require('fs');
var process = require('process');


function factorial(k) {
    if (k <= 1) return 1;
    return k * factorial(k - 1);
}

function Fac(n, cb) {
    this.n = n;
    this.callBack = cb;
    this.result = 0;
    this.calculate = ()=> {process.nextTick(()=>{this.result = factorial(this.n); this.callBack();})};
}

/*
 * ÷икл событий (Event Loop) Ч это то, что позвол€ет Node.js выполн€ть неблокирующие операции ввода/вывода
 * (несмотр€ на то, что JavaScript €вл€етс€ однопоточным) путем выгрузки операций в €дро системы, когда это возможно.
 * 
 * process.nextTick() технически не €вл€етс€ частью цикла событий
 * ¬место этого nextTickQueue будет обрабатыватьс€ после завершени€ текущей операции, независимо от текущей фазы цикла событий.
 * 
 * const server = net.createServer(() => {}).listen(8080);
 * server.on('listening', () => {});
 * 
 *  ак только порт передаЄтс€, он немедленно прив€зываетс€. “аким образом, 'listening' коллбэк может быть вызван немедленно. 
 * ѕроблема в том, что .on('listening') к этому времени ещЄ не будет установлен.
 * „тобы обойти это, событие 'listening' поставлено в очередь в nextTick(), чтобы позволить сценарию отработать до конца.
 *  Ёто позвол€ет пользователю устанавливать любые обработчики событий, которые он хочет.
 * 
 * 
 *  process.nextTick() срабатывает сразу на той же фазе
    setImmediate() срабатывает на следующей итерации или Ђтикеї цикла событий

    process.nextTick() срабатывает быстрее, чем setImmediate()

«ачем использовать process.nextTick()?

≈сть две основные причины:

    –азрешить пользовател€м обрабатывать ошибки, очищать любые ненужные ресурсы или,
    возможно, повтор€ть попытку до продолжени€ цикла обработки событий.
    »ногда необходимо разрешить выполнение коллбэка после разбора стека вызовов,
    но до продолжени€ цикла событий.
 */

http.createServer((request, response) => {
    let path = url.parse(request.url).pathname;
    if (path == '/fact') {
        console.log(request.url);
        let query = url.parse(request.url, true).query;
        if (query.k != null) {
            let k = parseInt(query.k);
            if (k == null) {
                return;
            }
            response.writeHead(200, { 'Content-type': 'application/json' });
            let fac = new Fac(k, ()=>{response.end(JSON.stringify({'k': k, 'fact': factorial(k)}))});
            fac.calculate();
        }
    } else if (path == '/') {
        let html = fs.readFileSync('./fact.html');
        response.writeHead(200, {'Content-type': 'text/html'});
        response.end(html);
    }
}).listen(3000);

console.log('Server running on http://localhost:3000');
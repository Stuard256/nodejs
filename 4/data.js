var util = require('util');
var ee = require('events');

var db_data = [{'id': 1, 'fio': 'Andrey Mukha', 'date': '27-04-2000'}];
function DB() {
    this.select = () => {return db_data};
    this.insert = (r) => {
        let found = db_data.find(p => p.id == r.id);
        if (found != undefined) {
            return false;
        } else {
            r['id'] = db_data.length + 1;
            db_data.push(r);
            return true;
        }
    };
    this.update = (r) => {
        let found = db_data.find(p => p.id == r.id);
        if (found != undefined) {
            found.fio = r.fio;
            found.date = r.date;
            return true;
        } else
            return false;
    };
    this.delete = (index) => {
        if (db_data.find(p => p.id == index)) {
            db_data = db_data.filter(p => p.id != index);
            return true;
        } else
            return false;
    };
}
util.inherits(DB, ee.EventEmitter);

exports.DB = DB;

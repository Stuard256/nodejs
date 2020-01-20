exports.send = function (message) {
    const mail = 'herbertstuard@yandex.by';
    let sendmail = require('sendmail')(/*{silent: true}*/);
    sendmail({
        from: mail,
        to: mail,
        subject: 'Good evening!',
        html: message
    });
    return message;
}
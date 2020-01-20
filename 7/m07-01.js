fs = require('fs');
path = require('path');

function createStatic(defaultPath) {
    this.path = defaultPath;
    this.processStatic = function (relativePath, response) {
        try {
            const fullPath = defaultPath + relativePath;
            const extension = path.extname(fullPath).toLowerCase();
            let mimeType = null;
            if (extension == '.html') {
                mimeType = 'text/html';
            } else if (extension == '.css') {
                mimeType = 'text/css';
            } else if (extension == '.js') {
                mimeType = 'text/javascript';
            } else if (extension == '.png') {
                mimeType = 'image/png';
            } else if (extension == '.jpg') {
                    mimeType = 'image/jpg';
            } else if (extension == '.docx') {
                mimeType = 'application/msword';
            } else if (extension == '.json') {
                mimeType = 'application/json';
            } else if (extension == '.xml') {
                mimeType = 'application/xml';
            } else if (extension == '.mp4') {
                mimeType = 'video/mp4';
            } else {
                throw new Error('Unknown type');
            }
            let statFile = fs.statSync(fullPath);
            
            let data = fs.readFileSync(fullPath);
            response.writeHead(200, {'Content-type': mimeType, 'Content-length': statFile.size});
            response.end(data, 'binary');
        } catch (e) {
            response.writeHead(404, 'Content-type: text/plain');
            response.end('404 not found:' + e);
        }
    }
}

module.exports = function (defaultPath) {
    return new createStatic(defaultPath);
}
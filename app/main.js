const http = require('http'),
    fs = require('fs'),
    url = require('url'),
    {
        parse
    } = require('querystring');

MimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
}

/*
    ¿Cuál es la principal función del módulo HTTP?
¿Cuál es la principal función del módulo FileSystem?
¿Qué es un MIME type?


*/

http.createServer((req, res) => {
    //Control code.
}).listen(8081);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] ===
        FORM_URLENCODED) {
        let body = '';
        // Evento de acumulación de data.
        request.on('data', chunk => {
            body += chunk.toString();
        });
        //Data completamente recibida
        request.on('end', () => {
            callback(null, parse(body));
        });
    } else {
        callback({
            msg = `The content-type don't is equals to ${FORM_URLENCODED}`
        });
    }
}

/*
¿Qué contienen las variables "req" y "res" en la creación del servidor?
¿La instrucción .listen(number) puede fallar? Justifique.
¿Por qué es útil la función "collectRequestData(...)"?
*/

var pathname = url.parse(req.url).pathname;

if (pathname == "/") {
    pathname = "../index.html";
}

if (pathname == "../index.html") {
    //Petición de la página principal
}

if (req.method === 'POST' && pathname == '/cv') {
    //Petición del formulario a traves del método
    POST
}

if (pathname.split(".")[1] == "css") {
    //Petición de la hoja CSS
}

/*
¿Para qué, además de conocer la dirección de la petición, es útil la variable "pathname"?
*/


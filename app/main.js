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
    dar soporte al protocolo característico de http para ejecutar las peticiones
¿Cuál es la principal función del módulo FileSystem?
    The Node.js file system module te permite trabajar con el archivo 
    del sistema en tu computadora

¿Qué es un MIME type?
    Los MIME Types (Multipurpose Internet Mail Extensions) son la manera standard de mandar contenido a través de la red. 
    Los tipos MIME especifican tipos de datos, como por ejemplo texto, imagen, audio, etc. que los archivos contienen. 
    Recuerde que debe utilizar el sufijo correcto para este tipo de archivo. 


*/

http.createServer((req, res) => {
    //Control code.

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
                msg: `The content-type don't is equals to ${FORM_URLENCODED}`
            });
        }
    }

    /***** */

    var pathname = url.parse(req.url).pathname;

    if (pathname == "/") {
        pathname = "../index.html";
    }

    if (pathname == "../index.html") {
        //Petición de la página principal
        fs.readFile(pathname, (err, data) => {

            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // En caso de no haberse encontrado el archivo
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                }); return res.end("404 Not Found");
            }
            //Página encontrada
            // HTTP Status: 200 : OK

            res.writeHead(200, {
                'Content-Type':
                    MimeTypes[pathname.split('.').pop()] || 'text/html'
            });

            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());

            // Envía la respuesta
            return res.end();
        });
    }

    if (req.method === 'POST' && pathname == '/cv') {
        //Petición del formulario a traves del método POST
        collectRequestData(req, (err, result) => {

            if (err) {
                res.writeHead(400, {
                    'content-type': 'text/html'
                });
                return res.end('Bad Request');
            }

            fs.readFile("../templates/plantilla.html", function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {
                        'Content-Type': 'text/html'
                    });
                    return res.end("404 Not Found");
                }
                res.writeHead(200, {
                    'Content-Type': MimeTypes[pathname.split('.').pop()] || 'text/html'
                });

                //Variables de control. 

                let parsedData = data.toString().replace('${dui}', result.dui)
                    .replace("${lastname}", result.lastname)
                    .replace("${firstname}", result.firstname)
                    .replace("${gender}", result.gender)
                    .replace("${civilStatus}", result.civilStatus)
                    .replace("${birth}", result.birth)
                    .replace("${exp}", result.exp)
                    .replace("${tel}", result.tel)
                    .replace("${std}", result.std);

                res.write(parsedData);
                return res.end();
            });
        });
    }

    if (pathname.split(".")[1] == "css") {
        console.log(pathname);
        //Petición de la hoja CSS
        fs.readFile(".." + pathname, (err, data) => {

            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                }); return res.end("404 Not Found");
            }

            res.writeHead(200, {
                'Content-Type': MimeTypes[pathname.split('.').pop()] || 'text/css'
            });

            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());

            // Envía la respuesta
            return res.end();

        });
    }

}).listen(8081);



/*
¿Qué contienen las variables "req" y "res" en la creación del servidor?
    req almacena la petición a enviar
    res tiene guardada y devuelve la respuesta de la petición

¿La instrucción .listen(number) puede fallar? Justifique.
    sí, el ese "number" (el puerto) ya está siendo escuchado por alguien más.

¿Por qué es útil la función "collectRequestData(...)"?
    almacena los datos que se van guardando en la variable req

¿Para qué, además de conocer la dirección de la petición, es útil la variable "pathname"?
    se usa de validación de las rutas en el servidor para cargar los documentos en el mismo

¿Qué contine el parametro "data"?
    toda la información de los documentos a cargar en pantalla, lo que es leído por un FileSystem

¿Cuál es la diferencia entre brindar una respuesta HTML y brindar una CSS?
    el primero ncesita de Mimetype textHTML y el archivo CSS se lee como un texto plano-.

¿Qué contiene la variable "result"?
    Para el caso, son todos los datos que se enviaron en el formulario

¿Por qué con la variable "data" se debe aplicarse el metodo toString()? Justifique.
    Facilitará el manejo de la información con la que se trabaja, al castearla a string.

¿Hay diferencia al quitar el control de peticiones para hojas CSS? Si sucedió algo distinto justifique por qué.
    Sí, solo no se carga la página de estilos y se ve el html puro

¿Se puede inciar el servidor (node main.js) en cualquier sitio del proyecto? Cualquier respuesta justifique.
    No, da error.

Con sus palabras, ¿Por qué es importante aprender Node.js sin el uso de frameworks a pesar que estos facilitan el manejo de API's?
    Para entender cómo funciona y qué hacen cada una de las variables que utilizamos, facilita el entendimiento de errores y una mejor
    manera de entender los algoritmos de los mismos.
*/


"use strict";
(function () {
    var path = require('path'), fs = require('fs');
    var logger = require('log4js').getLogger();
    var watchDir = "";
    var clientReloaderFilename = "/client_reloader.js";

    function init(dirToWatch) {
        watchDir = dirToWatch;
    }

    function handler(request, response) {
        var filePath = "";
        if (request.url === clientReloaderFilename) {
            filePath = "./utils" + clientReloaderFilename;
        } else {
            filePath = watchDir + request.url;
        }
        //Remove get params
        filePath = filePath.replace(/(.+?)\?.+/, "$1");

        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }

        if (extname.match(/\.jpg|\.png|\.gif|\.jpeg/)) contentType = "image";


        path.exists(filePath, function(exists) {

            logger.debug("Delivering: " + filePath);
            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': contentType });
                        if (contentType.match(/text/)) {
                            content = content.toString().
                                replace(/<\/body>/gi, '<script src="/socket.io/socket.io.js"></script><script type=\"text/javascript\" src=\"' + clientReloaderFilename + '\"></script></body>');
                        }
                        response.end(content, 'utf-8');
                    }
                });
            }
            else {
                logger.error("File not found at: " + filePath);
                response.writeHead(404);
                response.end();
            }
        });

    }

    module.exports = {
        init: init,
        getHandler: handler
    };
}());

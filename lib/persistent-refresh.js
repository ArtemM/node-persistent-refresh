"use strict";
(function () {
    var requestHandler = require("../modules/request-handler.js");
    var app = require('http').createServer(requestHandler.getHandler)
        , io = require('socket.io').listen(app);
    var FsHandler = require("../modules/fs-handler.js");

    function run(port, dirToWatch) {
        requestHandler.init(dirToWatch);
        app.listen(port);


        FsHandler.init(dirToWatch);

        io.set('log level', 2);
        io.sockets.on('connection', function (socket) {
            FsHandler.addSocket(socket);
            socket.on("disconnect", function() {
                FsHandler.removeSocket(socket);
            });
        });

        console.log('Server running at http://127.0.0.1:' + port + '/');
    }

    module.exports = {
        run: run
    };
}());

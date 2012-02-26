var argv = require('optimist').argv;

if (argv.help | argv.h) {
    console.log("Usage: node ./persistent-refresh.js [OPTION] \n Runs node server (default 8125) and watch directory (default ./html)\n -p, --port        port to run server on \n -w, --watch-dir   directory to watch ");
    process.exit(0);
}

var dirToWatch = argv['watch-dir'] || argv.w || "./html";

var requestHandler = require("./modules/request-handler.js");
requestHandler.init(dirToWatch);

var app = require('http').createServer(requestHandler.getHandler)
    , io = require('socket.io').listen(app);

var port = argv.p || argv.port || 8125
app.listen(port);

var FsHandler = require("./modules/fs-handler.js");
FsHandler.init(dirToWatch);

io.set('log level', 2);
io.sockets.on('connection', function (socket) {
    FsHandler.addSocket(socket);
    socket.on("disconnect", function() {
        FsHandler.removeSocket(socket);
    });
});

console.log('Server running at http://127.0.0.1:' + port + '/');
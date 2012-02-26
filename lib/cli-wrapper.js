#!/usr/bin/env node
var argv = require('optimist').argv;

if (argv.help | argv.h) {
    console.log("Usage: persistent-refresh [OPTION] \n Runs node server (default 8125) and watch directory (default ./html)\n -p, --port        port to run server on \n -w, --watch-dir   directory to watch ");
    process.exit(0);
}
var dirToWatch = argv['watch-dir'] || argv.w || "./html";
var port = argv.p || argv.port || 8125;

require("./persistent-refresh.js").run(port, dirToWatch);

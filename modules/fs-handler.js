"use strict";
(function () {
    var callbackSockets = [];
    var reloadScheduled = false;
    var logger = require('log4js').getLogger();


    function init(pathToWatch) {
        var walk = require('walk'), options;
        var Inotify = require('inotify').Inotify;
        var inotify = new Inotify();
        var callback = function(event) {
            logger.info("Directory contents changed");
            if (reloadScheduled) return;
            reloadScheduled = true;
            setTimeout(function() {
                reloadScheduled = false;
                callbackSockets.forEach(function(socket) {
                    socket.emit("news", "reloading");
                });
            }, 500);
        };

        function addDirToWatch(relativePath) {
            var fullPath = pathToWatch + "/" + relativePath;
            logger.info("Adding modification watch to path: " + fullPath);
            var dirToWatch = { path: fullPath,
                watch_for: Inotify.IN_MODIFY,
                callback:  callback
            };
            inotify.addWatch(dirToWatch);
        }

        addDirToWatch("");
        var walker = walk.walk(pathToWatch, options);

        walker.on("directories", function (root, dirStatsArray, next) {

            dirStatsArray.forEach(function(arrayElement) {
                var dirName = arrayElement.name;
                logger.info("Found pathes to watch: " + dirName);
                addDirToWatch(dirName);
            });
          next();
        });
    }

    function addSocket(callbackSocket) {
        callbackSockets.push(callbackSocket);
    }

    function removeSocket(socket) {
        callbackSockets.splice(callbackSockets.indexOf(socket), 1);
    }

    module.exports = {
        init: init,
        addSocket: addSocket,
        removeSocket: removeSocket
    };
}());

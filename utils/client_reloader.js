function clientReloadListener() {

    var socket = io.connect('http://localhost:8125');
    socket.on('news', function (data) {

        if (parent && parent.window.clientReloadListener) parent.window.location.reload(true);

        setTimeout(function() {
            window.location.reload(true);
        }, 300);
    });
}
clientReloadListener();

(function(context) {

    var notify = true,
        lastServerResult = null,
        lastBother = 0,
        botherSpan = 0,
        notification = null;

    function checkForGames() {
        if (!localStorage["server"])
            return;

        if (!notify)
            return;

        if (!(new Date().getTime() - lastBother >= botherSpan))
            return;

        var request = new XMLHttpRequest();

        request.open("GET", "http://tagpro.koalabeast.com/servers", true);
        request.onload = function() {
            var servers = JSON.parse(request.response),
                server = null;

            servers.forEach(function(someServer) {
                if (someServer.name.toLowerCase() == localStorage["server"])
                    server = someServer;
            });

            if (!server)
                return;

            if (server.players > 0) {
                lastServerResult = server;

                notification = webkitNotifications.createHTMLNotification(
                    'notification.html'
                );

                var thisNotification = notification;

                thisNotification.onshow = function() {
                    notify = false;
                };

                thisNotification.onclose = function() {
                    notify = true;
                    clearTimeout(thisAutoClose);
                };

                thisNotification.show();

                var thisAutoClose = setTimeout(function() {
                    thisNotification.close();
                }, 120000);
            }
        };

        request.send(null);
    }

    setInterval(checkForGames, 30000);
    checkForGames();

    context.snooze = function(howLong) {
        botherSpan = howLong;
        lastBother = new Date().getTime();
        notification.close();
    };

    context.getLastResult = function() {
        return lastServerResult;
    };

    context.gameJoined = function() {
        botherSpan = 3600000;
        lastBother = new Date().getTime();

        setTimeout(function() {
            notification.close();
        }, 500);
    };

})(this);

if (!localStorage["server"] || localStorage["server"] == "" || localStorage["server"].indexOf("tagpro") > -1) {
    localStorage["server"] == "";

    var notification = webkitNotifications.createNotification(
        "icon.png",
        "TagPro",
        "Click Here to select your server"
    );

    notification.show();

    notification.onclick = function() {
        var options = chrome.extension.getURL("options.html");
        chrome.tabs.create({
            url: options
        });
        notification.close();
    };
}
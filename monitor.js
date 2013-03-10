(function(context) {

    var notify = true,
        lastResult = null,
        lastBother = 0,
        botherSpan = 0,
        notification = null;

    function addS(word, count)
    {
        if (count > 1)
            return word + "s";

        return word;
    }

    function checkForGames() {
        if (!localStorage["server"])
            return;

        if (!notify)
            return;

        if (!(new Date().getTime() - lastBother >= botherSpan))
            return;

        var request = new XMLHttpRequest();

        request.open("GET", "http://" + localStorage["server"] + ".koalabeast.com/stats", true);
        request.onload = function() {
            var data = JSON.parse(request.response);

            lastResult = data;

            if (data.players > 0) {
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
        return lastResult;
    };

    context.gameJoined = function() {
        botherSpan = 3600000;
        lastBother = new Date().getTime();

        setTimeout(function() {
            notification.close();
        }, 500);
    };

})(this);

if (!localStorage["server"] || localStorage["server"] == "") {

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
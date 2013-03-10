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
        if (!notify)
            return;

        if (!(new Date().getTime() - lastBother >= botherSpan))
            return;

        var request = new XMLHttpRequest();

        request.open("GET", "http://tagpro.koalabeast.com/stats", true);
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
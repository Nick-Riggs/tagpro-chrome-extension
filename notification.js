document.addEventListener("DOMContentLoaded", function() {
    var background = chrome.extension.getBackgroundPage(),
        server = background.getLastResult(),
        join = document.getElementById("join"),
        players = document.getElementById("players"),
        games = document.getElementById("games"),
        snooze1 = document.getElementById("snooze1"),
        snooze2 = document.getElementById("snooze2"),
        snooze3 = document.getElementById("snooze3");

    players.innerText = server.players;
    games.innerText = server.games;
    join.href = server.url;

    var snoozePressed = function() {
        background.snooze(parseInt(this.value) * 3600000);
    };

    snooze1.onclick = snoozePressed;
    snooze2.onclick = snoozePressed;
    snooze3.onclick = snoozePressed;

    join.onclick = function() {
        background.gameJoined();
    };
});
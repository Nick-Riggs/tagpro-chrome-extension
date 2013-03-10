document.addEventListener("DOMContentLoaded", function() {

    var serverSelect = document.getElementById("serverSelect");

    serverSelect.addEventListener("change", function() {

        var server = serverSelect.children[serverSelect.selectedIndex].value;
        localStorage["server"] = server;

    });

    var server = localStorage["server"];

    for (var i = 0; i != serverSelect.children.length; i++) {
        if (serverSelect.children[i].value == server) {
            serverSelect.children[i].selected = true;
            break;
        }
    }
});
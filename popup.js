document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("form");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.action;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});
addCrossBrowserListener(window, "load", init);

function init() {
    var bg = readCookie("background");
    if (bg) {
        document.body.style.background = "url(\"" + bg + "\")";
    }
}
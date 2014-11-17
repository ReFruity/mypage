document.imgIndex = null;
addCrossBrowserListener(window, "load", init);
var gelements = [];

function init() {
    document.imgIndex = readCookie("imgIndex");
    addCrossBrowserListener(window, "hashchange", hashChange);
    if (document.imgIndex) {
        document.location.hash = document.imgIndex;
        openPreview(document.imgIndex);
    }
}

function hashChange() {
    console.log("hash changed");
}

function openPreview(i) {
    document.location.hash = i;
    
    var info = document.createElement("p");
    info.className = "info";
    info.id = "info1";
    info.appendChild(document.createTextNode("Press F1 for help"));

    var closeBar = document.createElement("div");
    closeBar.className = "closeBar";
    closeBar.id = "closeBar1";
    addCrossBrowserListener(closeBar, 'click', closePreview);

    var spinner = document.createElement("img");
    spinner.className = "spinner";
    spinner.id = "spinner1";
    spinner.src = "/images/spinner.gif";

    var img = document.createElement("img");
    img.className = "img";
    img.id = "img1";
    img.onload = show;
    img.src = crossBrowserGetByClassName("gitem")[i].href;
//    img.src = target.href;
//    img.src = "http://crispme.com/wp-content/uploads/26105"+".jpg?pass"; // testing purposes

    document.imgIndex = parseInt(i);
    createCookie("imgIndex", document.imgIndex);

    var imgWrapper = document.createElement("div");
    imgWrapper.className = "imgWrapper";
    imgWrapper.id = "imgWrapper1";

    var screen = document.createElement("div");
    screen.className = "screen";
    screen.id = "screen1";

    imgWrapper.appendChild(img);
    document.body.appendChild(screen);
    document.body.appendChild(info);
    document.body.appendChild(imgWrapper);
    document.body.appendChild(spinner);
    document.body.appendChild(closeBar);

    gelements.push("screen1", "info1", "imgWrapper1", "spinner1", "closeBar1");

    addCrossBrowserListener(document.body, 'keydown', keyDown);
}

//noinspection JSUnusedGlobalSymbols
function onClick(e) {
    e = e || window.event;
    var target = getCrossBrowserTarget(e);
    if (isIE() && isIE() < 9) { //IE8 thinks target is img
        target = target.parentNode;
    }
    
    openPreview(parseInt(target.id));
    
    return preventDefault(e);
}

function keyDown(e) {
    e = e || window.event; // IE8
    
    if (e.keyCode == 27) {
        closePreview();
        return preventDefault(e);
    }
    if (e.keyCode == 112) {
        if ("onhelp" in window) // F1 in IE
            {window.onhelp = function () {return false;}}
        var imgWrapper = document.getElementById("imgWrapper1");
        if (imgWrapper) {
            var help = document.getElementById("help1");
            if (help) {
                imgWrapper.removeChild(help);
            }
            else {
                help = document.createElement("div");
                help.className = "help";
                help.id = "help1";

                var helpText = document.createElement("p");
                helpText.className = "helpText";
                helpText.id = "helpText1";
               
                helpText.appendChild(
                    document.createTextNode("Help: Use arrows to navigate, press Esc or right side to close")
                );
                
                help.appendChild(helpText);
                imgWrapper.appendChild(help);
            }
        }
        return preventDefault(e);
    }
    var img = document.getElementById("img1");
    var items = crossBrowserGetByClassName("gitem");
    if (e.keyCode == 37) { //arrow left
        if (img && items) {
            if (document.imgIndex <= 0) document.imgIndex = items.length;
            document.imgIndex--;
            createCookie("imgIndex", document.imgIndex);
            img.src = items.item(document.imgIndex).href;
            img.style.visibility = "hidden";
            showSpinner();
        }
        return preventDefault(e);
    }
    if (e.keyCode == 39) { //arrow right
        if (img && items) {
            document.imgIndex++;
            createCookie("imgIndex", document.imgIndex);
            if (document.imgIndex >= items.length) document.imgIndex = 0;
            img.src = items.item(document.imgIndex).href;
            img.style.visibility = "hidden";
            showSpinner();
//            console.log(items.item(document.imgIndex).href);
        }
        return preventDefault(e);
    }
}

function closePreview() {
    document.location.hash = "";
    
    for (var i in gelements) {
        var elem = document.getElementById(gelements[i]);
        if (elem) {
            document.body.removeChild(elem);
        }
    }
    gelements = [];
    removeCrossBrowserListener(document.body, "keydown", keyDown);
    eraseCookie("imgIndex");
}

function show(e) {
    var target = this;
    target.style.visibility = "visible";
    hideSpinner();
}

function hideSpinner() {
    var spinner = document.getElementById("spinner1");
    if (spinner) {
        spinner.style.visibility = "hidden";
    }
}

function showSpinner() {
    var spinner = document.getElementById("spinner1");
    if (spinner) {
        spinner.style.visibility = "visible";
    }
}

// TODO list:
    //hasOwnProperty check
addCrossBrowserListener(window, "load", ginit);
var gelements = []; // preview nodes
var gitems = []; // a's with img inside

function ginit() {
    gitems = crossBrowserGetByClassName("gitem");
    addCrossBrowserListener(window, "hashchange", hashChange);
    var startIndex = readCookie("startIndex");
    if (startIndex && getImgIndex() != startIndex)
        document.location.hash = startIndex;
    else
        hashChange();
}

function hashChange() {
    var imgIndex = getImgIndex();
    if (imgIndex == -1) {
        closePreview();
    }
    else {
        if (gelements.length) { // if preview is open
            switchImage(imgIndex);
        }
        else {
            openPreview(imgIndex);
        }
    }
}

function openPreview(i) {    
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
    img.onload = imgLoad;
    img.src = crossBrowserGetByClassName("gitem")[i].href;
//    img.src = "http://crispme.com/wp-content/uploads/26108.jpg?pass"; // testing purposes

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
    
    window.location.hash = parseInt(target.id);
    
    return preventDefault(e);
}

function keyDown(e) {
    e = e || window.event; // IE8
    
    if (e.keyCode == 27) { // escape
        window.location.hash = "";
        return preventDefault(e);
    }
    if (e.keyCode == 112) { // F1
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
                    document.createTextNode("Help:"));
                helpText.appendChild(document.createElement("BR"));
                helpText.appendChild(
                    document.createTextNode("-  Use arrows to navigate, press Esc or right side to close"));
                helpText.appendChild(document.createElement("BR"));
                helpText.appendChild(
                    document.createTextNode("- 's' makes current image starting, 'd' unmakes"));
                helpText.appendChild(document.createElement("BR"));
                helpText.appendChild(
                    document.createTextNode("- 'b' makes it background image, 'n' resets background"));
                
                help.appendChild(helpText);
                imgWrapper.appendChild(help);
            }
        }
        return preventDefault(e);
    }
    var imgIndex;
    if (e.keyCode == 37) { // arrow left
        if (gitems) {
            imgIndex = getImgIndex();
            if (imgIndex <= 0) imgIndex = gitems.length;
            window.location.hash = imgIndex - 1;
        }
        
        return preventDefault(e);
    }
    if (e.keyCode == 39) { // arrow right
        if (gitems) {
            imgIndex = getImgIndex() + 1;
            if (imgIndex >= gitems.length) imgIndex = 0;
            window.location.hash = imgIndex;
        }
        return preventDefault(e);
    }
    if (e.keyCode == 83) { // 's'
        createCookie("startIndex", getImgIndex());
        alert("Picture set as starting!");
        return preventDefault(e);
    }
    if (e.keyCode == 68) { // 'd'
        if (readCookie("startIndex")) {
            eraseCookie("startIndex");
            alert("Starting picture unset!");
        }
        return preventDefault(e);
    }
    if (e.keyCode == 66) { // 'b'
        createCookie("background", gitems[getImgIndex()].href);
        alert("Picture set as background!");
        window.location.reload();
        return preventDefault(e);
    }
    if (e.keyCode == 78) { // 'n'
        eraseCookie("background");
        alert("Background reset!");
        window.location.reload();
        return preventDefault(e);
    }
}

function getImgIndex() {
    var str = window.location.hash.substring(1);
    return str ? parseInt(str) : -1;
}

function switchImage(i) {
    var img = document.getElementById("img1");
    if (img) {
        img.src = gitems.item(i).href;
        img.style.visibility = "hidden";
        showSpinner();
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
}

function imgLoad(e) {
    var target = this;
    target.style.visibility = "visible";
    hideSpinner();
    if (gitems) { // preload adjacent images
        var next = getImgIndex() + 1;
        if (next == gitems.length) next = 0;
        var previous = getImgIndex() - 1;
        if (previous == -1) previous = gitems.length - 1;
        preload(gitems[next].href);
        preload(gitems[previous].href);
    }
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
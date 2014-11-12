document.i = 0;

var gelements = [];

//noinspection JSUnusedGlobalSymbols
function onClick(e) {
    e = e || window.event;
    var target = getCrossBrowserTarget(e);
    if (isIE() && isIE() < 9) { //IE8 thinks target is img
        target = target.parentNode;
    }
    
    var info = document.createElement("p");
    info.className = "info";
    info.appendChild(document.createTextNode("Press F1 for help"));
    
    var closeBar = document.createElement("div");
    closeBar.className = "closeBar";
    addCrossBrowserListener(closeBar, 'click', closePreview);

    var spinner = document.createElement("img");
    spinner.className = "spinner";
    spinner.src = "/images/spinner.gif";
    
    var img = document.createElement("img");
    img.className = "img";
    img.onload = showImage;
    img.src = target.href;
//    img.src = "http://crispme.com/wp-content/uploads/26105"+".jpg?pass"; // testing purposes
    
    document.i = parseInt(target.id);
    
    var imgWrapper = document.createElement("div");
    imgWrapper.className = "imgWrapper";
    
    var screen = document.createElement("div");
    screen.className = "screen";

    imgWrapper.appendChild(img);
    document.body.appendChild(screen);
    document.body.appendChild(info);
    document.body.appendChild(imgWrapper);
    document.body.appendChild(spinner);
    document.body.appendChild(closeBar);
    
    gelements.push("screen", "info", "imgWrapper", "spinner", "closeBar");
    
    addCrossBrowserListener(document.body, 'keydown', keyDown);
    
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
        var imgWrapper = crossBrowserGetByClassName("imgWrapper")[0];
        if (imgWrapper) {
            var help = crossBrowserGetByClassName("help")[0];
            if (help) {
                imgWrapper.removeChild(help);
            }
            else {
                help = document.createElement("div");
                help.className = "help";
                
                var helpText = document.createElement("p");
                helpText.className = "helpText";
               
                helpText.appendChild(
                    document.createTextNode("Help: Use arrows to navigate, press Esc or right side to close")
                );
                
                help.appendChild(helpText);
                imgWrapper.appendChild(help);
            }
        }
        return preventDefault(e);
    }
    var img = crossBrowserGetByClassName("img")[0];
    var items = crossBrowserGetByClassName("gitem");
    if (e.keyCode == 37) { //arrow left
        if (img && items) {
            if (document.i <= 0) document.i = items.length;
            document.i--;
            img.src = items.item(document.i).href;
            img.style.visibility = "hidden";
            showSpinner();
        }
        return preventDefault(e);
    }
    if (e.keyCode == 39) { //arrow right
        if (img && items) {
            document.i++;
            if (document.i >= items.length) document.i = 0;
            img.src = items.item(document.i).href;
            img.style.visibility = "hidden";
            showSpinner();
//            console.log(items.item(document.i).href);
        }
        return preventDefault(e);
    }
}

function closePreview() {
    for (var i in gelements) {
        var elem = crossBrowserGetByClassName(gelements[i])[0];
        if (elem) {
            document.body.removeChild(elem);
        }
    }
    removeCrossBrowserListener(document.body, "keydown", keyDown);
}

function showImage(e) {
    e = e || window.event;
//    var target = getCrossBrowserTarget(e);
    var target = this;
    target.style.visibility = "visible";
//        console.log("loaded!");
    hideSpinner();
}

function hideSpinner() {
    var spinner = crossBrowserGetByClassName("spinner")[0];
    if (spinner) {
        spinner.style.visibility = "hidden";
    }
}

function showSpinner() {
    var spinner = crossBrowserGetByClassName("spinner")[0];
    if (spinner) {
        spinner.style.visibility = "visible";
    }
}

// TODO list:
    /* features:
     show, hide
     fadeIn, fadeOut
     slideUp,slideDown
     animate
     */

    //hasOwnProperty check
document.i = 0;

function onClick(e) {
    e = e || window.event;
    
    var pressEsc = document.createElement("p");
    pressEsc.style.color = "#ddd";
    pressEsc.style.margin = "5px auto";
    pressEsc.style.width = "200px";
//    pressEsc.style.background = "#333";
//    pressEsc.style.background = "rgba(51,51,51,0.7)";
    pressEsc.style.background = "rgb(51,51,51)"; //remove
    pressEsc.style.borderRadius = "3px";
    pressEsc.appendChild(document.createTextNode("Press F1 for help"));
    
    var closeBar = document.createElement("div");
    closeBar.style.position = "fixed";
    closeBar.style.right = "0";
    closeBar.style.height = "100%";
    closeBar.style.width = "200px";
//    closeBar.style.zIndex = "10";
    if (document.body.addEventListener) {
        closeBar.addEventListener("click", closePreview);
    }
    else {
        closeBar.attachEvent("onclick", closePreview);
    }

    var img = document.createElement("img");
    img.id = "img";
    img.style.width = "auto";
    img.style.height = "600px";
    img.style.boxShadow = "4px 7px 13px #333";
    var target = e.target || e.srcElement;
    img.src = target.src;
    document.i = parseInt(target.id);
//    img.style.zIndex = "2";
    
    var imgWrapper = document.createElement("div");
    imgWrapper.id = "imgWrapper";
    imgWrapper.style.position = "fixed";
    imgWrapper.style.top = "0";
    imgWrapper.style.left = "0";
    imgWrapper.style.height = "100%"; 
    imgWrapper.style.width = "100%";
    imgWrapper.style.textAlign = "center";
//    imgWrapper.style.zIndex = "1";
    
    var screen = document.createElement("div");
    screen.id = "screen";
    screen.style.position = "fixed";
    screen.style.height = "100%";
    screen.style.width = "100%";
    screen.style.top = "0";
    screen.style.left = "0";
    screen.style.background = "#444";
    screen.style.opacity = "0.7";
//    screen.style.zIndex = "0";

    imgWrapper.appendChild(closeBar);
    imgWrapper.appendChild(pressEsc);
    imgWrapper.appendChild(img);
    document.body.appendChild(screen);
    document.body.appendChild(imgWrapper);
    
//    document.body.onkeydown = keyDown; // overrides previous onkeydown
    if (document.body.addEventListener) {
        document.body.addEventListener('keydown', keyDown);
    }
    else {
        document.body.attachEvent("onkeydown", keyDown);
    }
}

function keyDown(e) {
    e = e || window.event; // IE8
    
    if (e.keyCode == 27) {
        closePreview();
    }
    if (e.keyCode == 112) {
        if ("onhelp" in window) // F1 in IE
            {window.onhelp = function () {return false;}}
        var imgWrapper = document.getElementById("imgWrapper");
        if (imgWrapper) {
            if (document.getElementById("help")) {
                imgWrapper.removeChild(document.getElementById("help"));
            }
            else {
                var help = document.createElement("div");
                help.id = "help";
                help.style.width = "200px";
//                help.style.height = "400px";
//                help.style.background = "rgba(85,85,85,0.7)";
                help.style.background = "rgb(85,85,85)"; //remove
                help.style.borderRadius = "3px";
                help.style.position = "fixed";
                help.style.left = "10px";
                help.style.top = "10px";
                
                var helpText = document.createElement("p");
                helpText.style.margin = "5px";
                helpText.style.color = "#ddd";
                helpText.appendChild(document.createTextNode("Help: "));
                helpText.appendChild(document.createTextNode("Use arrows to navigate, press Esc or right side to close"));
                
                help.appendChild(helpText);
                imgWrapper.appendChild(help);
            }
        }
        return preventDefault(e);
    }
    var img, pictures;
    if (e.keyCode == 37) { //arrow left
        img = document.getElementById("img");
        pictures = document.getElementsByClassName("picture");
        if (img && pictures) {
            if (document.i <= 0) document.i = pictures.length;
            document.i--;
            img.src = pictures.item(document.i).src;
        }
        return preventDefault(e);
    }
    if (e.keyCode == 39) { //arrow right
        img = document.getElementById("img");
        pictures = document.getElementsByClassName("picture");
        if (img && pictures) {
            document.i++;
            if (document.i >= pictures.length) document.i = 0;
            img.src = pictures.item(document.i).src;
//            console.log(pictures.item(document.i).src);
        }
        return preventDefault(e);
    }
}

function preventDefault(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    return false;
}

function closePreview() {
    var screen = document.getElementById("screen");
    var imgWrapper = document.getElementById("imgWrapper");
    if (screen)
        document.body.removeChild(screen);
    if (imgWrapper)
        document.body.removeChild(imgWrapper);    
}

//IE8 rgba substitute

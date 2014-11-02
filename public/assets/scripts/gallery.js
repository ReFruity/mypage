function onClick(e) {
    e = e || window.event;
    
    var pressEsc = document.createElement("p");
    pressEsc.style.color = "#ddd";
    pressEsc.style.margin = "5px auto";
    pressEsc.style.width = "265px";
    pressEsc.style.background = "#333";
    pressEsc.style.borderRadius = "3px";
    var text = document.createTextNode("Press Esc or click right side to close");
    pressEsc.appendChild(text);
    
    var closeBar = document.createElement("div");
    closeBar.style.position = "fixed";
    closeBar.style.right = "0";
    closeBar.style.height = "100%";
    closeBar.style.width = "200px";
    closeBar.addEventListener("click", closePreview);

    var img = document.createElement("img");
    img.id = "img";
    img.style.width = "auto";
    img.style.height = "600px";
    img.style.boxShadow = "4px 7px 13px #333";
    img.src = e.target.src;
    
    var imgWrapper = document.createElement("div");
    imgWrapper.id = "imgWrapper";
    imgWrapper.style.position = "fixed";
    imgWrapper.style.top = "0";
    imgWrapper.style.left = "0";
    imgWrapper.style.height = "100%"; 
    imgWrapper.style.width = "100%";
    imgWrapper.style.textAlign = "center";
    
    var screen = document.createElement("div");
    screen.id = "screen";
    screen.style.position = "fixed";
    screen.style.height = "100%";
    screen.style.width = "100%";
    screen.style.top = "0";
    screen.style.left = "0";
    screen.style.background = "#444";
    screen.style.opacity = "0.7";

    imgWrapper.appendChild(closeBar);
    imgWrapper.appendChild(pressEsc);
    imgWrapper.appendChild(img);
    document.body.appendChild(screen);
    document.body.appendChild(imgWrapper);
    
//    document.body.onkeydown = keyDown; // overrides previous onkeydown
    document.body.addEventListener('keydown', keyDown);
}

function keyDown(e) {
    e = e || window.event; // IE8
    
    if (e.keyCode == 27) {
        closePreview();
    }
    if (e.keyCode == 112) {
        
    }
    if(e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
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

//IE 8 onClick doesn't work
//IE 9 stretches images
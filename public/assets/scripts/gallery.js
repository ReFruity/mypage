function onClick(e) {
    var pressEsc = document.createElement("p");
    pressEsc.style.color = "#ddd";
    pressEsc.style.margin = "5px auto";
    pressEsc.style.width = "200px";
    pressEsc.style.background = "#333";
    pressEsc.style.borderRadius = "3px";
    var text = document.createTextNode("Press Esc to close");
    pressEsc.appendChild(text);
    
    var img = document.createElement("img");
    img.id = "img";
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

    imgWrapper.appendChild(pressEsc);
    imgWrapper.appendChild(img);
    document.body.appendChild(screen);
    document.body.appendChild(imgWrapper);
    
//    document.body.onkeydown = keyDown;
    document.body.addEventListener('keydown', keyDown);

//    console.log(e);
}

function keyDown(e) {
    console.log(e);
    if (e.keyCode == 27) {
        var screen = document.getElementById("screen");
        var imgWrapper = document.getElementById("imgWrapper");
        document.body.removeChild(screen);
        document.body.removeChild(imgWrapper);
    }
}
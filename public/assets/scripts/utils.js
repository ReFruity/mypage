function preventDefault(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    return false;
}

function addCrossBrowserListener (el, event, func) {
    if (el.addEventListener) {
        el.addEventListener(event, func);
    }
    else { // IE8 compatibility
        el.attachEvent("on"+event, func);
    }
}

function removeCrossBrowserListener (el, event, func) {
    if (el.removeEventListener) {
        el.removeEventListener(event, func);
    }
    else { // IE8 compatibility
        el.detachEvent("on"+event, func);
    }
}

function preloadImage(imgSrc, callback){
    var objImagePreloader = new Image();

    objImagePreloader.src = imgSrc;
    if(objImagePreloader.complete){
        callback();
        objImagePreloader.onload=function(){};
    }
    else{
        objImagePreloader.onload = function() {
            callback();
            //    clear onLoad, IE behaves irratically with animated gifs otherwise
            objImagePreloader.onload = function(){};
        }
    }
}

function crossBrowserGetByClassName (className) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(className);
    }
    else { // IE8 compatibility
        return document.querySelectorAll("."+className);
    }
}

function getCrossBrowserTarget(e) {
    return e.currentTarget || e.srcElement;
}

function isIE () {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
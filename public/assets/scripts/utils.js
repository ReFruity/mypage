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

/* COOKIES */
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
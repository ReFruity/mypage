addCrossBrowserListener(window, "load", finit);

var form1;

function finit() {
//    feedback1 = document.getElementById("feedback1");
    form1 = document.getElementById("form1");
    document.getElementById("btn1").onclick = submit;
}

function submit() {
    form1.submit();
}
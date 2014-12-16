function initPoll() {
    getResults();
    setInterval(getResults, 1000);
}

function getResults() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
//                document.getElementById("poll").innerHTML = xmlhttp.responseText;
//                console.log(JSON.parse(xmlhttp.response));
                var response = JSON.parse(xmlhttp.response);
                for (var i in response.votes) {
//                    console.log(response[i]/response.sum);
                    // max width is 430 px
                    document.getElementById(i).style.width = 
                        (response.sum ? response.votes[i] / response.sum * 430 : 0) + "px";
                }
            }
            else if (xmlhttp.status == 400) {
                console.log('There was an error 400 while getting results');
            }
            else {
                console.log('Status:', xmlhttp.status);
            }
        }
    };
    // buster disables caching in IE
    xmlhttp.open("GET", "/stats?buster="+new Date().getTime(), true);
//    xmlhttp.setRequestHeader("Cache-Control", "no-cache,no-store");
    xmlhttp.send();
}

function submitForm(form) {
    var xmlhttp = new XMLHttpRequest();
   
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if(xmlhttp.status == 200){
//                console.log('All ok');
            }
            else if(xmlhttp.status == 400) {
                console.log('There was an error 400 while posting');
            }
            else {
                console.log('Status:', xmlhttp.status);
            }
        }
    };
    xmlhttp.open("POST", "/poll", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//    xmlhttp.setRequestHeader("Cache-Control", "no-cache,no-store");
//    var value = form.elements.group1.value;
    var value = document.querySelector('input[name="group1"]:checked').value;
    xmlhttp.send("group1=" + value);
    return false;
}

addCrossBrowserListener(window, "load", initPoll);
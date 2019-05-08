const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xmlhttp = new XMLHttpRequest();

function likes(img_id) {
  // alert('Got it' + img_id.getAttribute("data-imgid"));

    // var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", "/likes", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      	alert('In here');
    }
  };
  xmlhttp.send("img_id=" + img_id.getAttribute("data-imgid"));
}
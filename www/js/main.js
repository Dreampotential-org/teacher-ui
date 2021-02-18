//var SERVER = 'https://sfapp-api.dreamstate-4-all.org/'
var SERVER = 'http://localhost:8000'
var API_SERVER = SERVER
var HOST = 'sfapp-api.dreamstate-4-all.org'


function init() {}


function setup_click_events() {
    $("body").delegate(".navbar-brand", "click", function(e) {});
}

window.addEventListener("DOMContentLoaded", init, false);

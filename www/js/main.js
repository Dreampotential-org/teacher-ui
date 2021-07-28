var SERVER = '';
var HOST = '';
var WEBSOCKET_HOST = '';

function set_server() {
    if (window.location.origin.includes("compass")) {
        SERVER = 'http://compasssc.com:8040/';
        HOST = 'compasssc.com:8040';
        WEBSOCKET_HOST = 'ws://compasssc.com:8040';
    } else {
        SERVER = 'https://api.dreampotential.org/';
        HOST = 'api.dreampotential.org';
        WEBSOCKET_HOST = 'wss://api.dreampotential.org';
    }
};
set_server()


function init() {}

function setup_click_events() {
  $('body').delegate('.navbar-brand', 'click', function (e) {});
}

window.addEventListener('DOMContentLoaded', init, false);

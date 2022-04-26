var SERVER = '';
var HOST = '';
var WEBSOCKET_HOST = '';

function set_server() {

    if (window.location.origin.includes("compass")) {
        SERVER = 'https://vm2967.tmdcloud.com/';
        HOST = 'https://vm2967.tmdcloud.com';
        WEBSOCKET_HOST = 'wss://vm2967.tmdcloud.com';
    }
    else if (window.location.origin.includes("localhost:8086")) {
        SERVER = 'http://localhost:8000/';
        HOST = 'http://localhost:8000';
        WEBSOCKET_HOST = 'wss://localhost:8000';
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

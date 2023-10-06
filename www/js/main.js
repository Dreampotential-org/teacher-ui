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
        SERVER = 'http://localhost:8040/';
        HOST = 'http://localhost:8040';
        WEBSOCKET_HOST = 'wss://localhost:8040';
    }
    else if (window.location.origin.includes("127.0.0.1:8887")) {
        SERVER = 'http://localhost:8000/';
        HOST = 'http://localhost:8040';
        WEBSOCKET_HOST = 'wss://localhost:8040';
    }
    else {
        SERVER = 'https://py-api.dreampotential.org/';
        HOST = 'py-api.dreampotential.org';
        WEBSOCKET_HOST = 'wss://py-api.dreampotential.org';
    }
};
set_server()


function init() {}

function setup_click_events() {
  $('body').delegate('.navbar-brand', 'click', function (e) {});
}

window.addEventListener('DOMContentLoaded', init, false);

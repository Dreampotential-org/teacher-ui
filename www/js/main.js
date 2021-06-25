// var SERVER = 'https://api.dreampotential.org/';
var SERVER = 'http://localhost:8000/'
var HOST = 'api.dreampotential.org';
var WEBSOCKET_HOST = 'wss://api.dreampotential.org';

function init() {}

function setup_click_events() {
  $('body').delegate('.navbar-brand', 'click', function (e) {});
}

window.addEventListener('DOMContentLoaded', init, false);

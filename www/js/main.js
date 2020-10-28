var SERVER = 'https://sfapp-api.dreamstate-4-all.org/'
// var SERVER = 'http://localhost:8000/'


function init() {
    init_mapbox()
    setup_click_events()
    init_login()
    // $("#my-profile").click()
}

function home() {
    $('.navbar-brand').click()
}

function setup_click_events() {
    $("body").delegate(".navbar-brand", "click", function(e) {
        $('#screen1').show()
        $('#screen2').hide()
        $('#map-check').hide()
        $('#shelters-screen').hide()
    });

    $("body").delegate("#my-profile", "click", function(e) {
        $('#screen2').show()
        $('#screen1').hide()
        $('#map-check').hide()
        $('#shelters-screen').hide()


    })
    $("body").delegate(".shelters", "click", function(e) {
        $('#screen1').hide()
        $('#screen2').hide()
        $('#map-check').hide()
        $('#shelters-screen').show()

        get_shelters();
    });

    $("body").delegate(".shelters-map", "click", function(e) {


        map_shelters()
    });
}

window.addEventListener("DOMContentLoaded", init, false);


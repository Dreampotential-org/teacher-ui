function get_shelters(callback) {
    $.get(SERVER + "sfapp2/api/get_services", function(results) {
        results.forEach((ele, index)=>{
            add_resource(ele, index);
        })
    });
}

function add_resource(resource, index) {

    $("#shelters-list").append(
        `<div class='shelter-close'>
            <a href='#'> ${resource['title']} </a><br><br>
            ${resource['services']}
            <br><br><p>${resource['description'].substring(0, 200)} ...</p>
        <button  type='button' class='slide-toggle info' id="${index}" onclick='toggle("${index}")'>
            <span class="info-txt">Info</span>
            <i class='fa fa-chevron-up pull-right is-active arrow-icon'></i>
            <i class='fa fa-chevron-down pull-right arrow-icon'></i>
        </button>
        <div class='box' style='display:none'>
            Toggle show this div area
        </div'>`)
      
}

function toggle(i) {
    $(`#${i}`).next().slideToggle();
    $(`#${i}`).find('i').toggleClass('is-active')
}

function map_shelters() {

}

function init_mapbox() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25vcm9zZW4iLCJhIjoiY2owdWFoOGgxMDJ2NDMzcWpqb3NocHBtYiJ9.APRb6iQE07MsewU1g2gWWA';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
    });

}



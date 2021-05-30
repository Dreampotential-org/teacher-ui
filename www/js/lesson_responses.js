let session_responses = []
var lesson_id = getParam("lesson_id")
var mapScript = document.createElement('script');
mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCEYIL86ek3icvHx6F-55qSFCfhe2fynfg';
document.head.appendChild(mapScript);
$(document).ready(function () {
    $("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");
    $.ajax({
        type: "GET",
        url: SERVER+'courses_api/lesson/response/get/'+lesson_id+'/',
        dataType: 'json',
        async: true,	
        crossDomain: true,	
        crossOrigin: true,
        headers: {	
            "Authorization": `${localStorage.getItem('user-token')}`	
        },	
        success: function (obj, textstatus) {
        console.log("🚀 ~ file: lesson_responses.js ~ line 83 ~ obj", obj)
        var columnsObj = [
            { data: "user_session.0.session_id", "sWidth": "25%"},
            { data: "flashcard.0.id", "sWidth": "15%"},
            { data: "flashcard.0.lesson_type", "sWidth": "15%"},
            { data: "answer", "sWidth": "25%" , render:(data,type,row)=>{
                console.log('row',row);
                let rowdata = JSON.stringify(row);
                switch (row.flashcard[0].lesson_type) {
                    case 'user_image_upload':
                        return `<img style="max-height:41px;max-width:120px" src="${data}" />
                        <button class="btn btn-primary" data-row='${rowdata}' onclick="viewResponseCard(event)" style="float:right"><i class="fa fa-eye" aria-hidden="true"></i></button>`
                    case 'user_video_upload':
                        return `<video style="max-height:41px;max-width:120px" controls>
                        <source src="${data}" type="video/mp4"></video>
                        <button class="btn btn-primary" data-row='${rowdata}' onclick="viewResponseCard(event)" style="float:right"><i class="fa fa-eye" aria-hidden="true"></i></button>`
                    case 'user_gps':
                        return `<div style="float:left;">lat: ${row.latitude} <br>
                                lng: ${row.longitude} <br>
                                (${data.length>15?data.slice(0,14)+'...':data})</div>
                                <button class="btn btn-primary" data-row='${rowdata}' onclick="viewResponseCard(event)" style="float:right"><i class="fa fa-eye" aria-hidden="true"></i></button>`
                    case 'question_choices':
                        return `<div style="float:left">${data}</div>
                                <button class="btn btn-primary" data-row='${rowdata}' onclick="viewResponseCard(event)" style="float:right"><i class="fa fa-eye" aria-hidden="true"></i></button>`
                    case 'question_checkboxes':
                        return `<div style="float:left">${data}</div>
                                <button class="btn btn-primary" data-row='${rowdata}' onclick="viewResponseCard(event)" style="float:right"><i class="fa fa-eye" aria-hidden="true"></i></button>`
                    case 'signature':
                        return `<img style="max-height:41px;max-width:120px" src="${data}" />
                        <button class="btn btn-primary" data-row='${rowdata}' onclick="viewResponseCard(event)" style="float:right"><i class="fa fa-eye" aria-hidden="true"></i></button>`
                    default:
                        return data;
                }
            }},
            { data: "flashcard.0.usersessionevent.0.duration", "sWidth": "25%" , render:(data,type,row)=>{
                let duration = 0;
                for(let session of row.flashcard[0].usersessionevent){
                    if (session.user_session == row.user_session[0].id){
                        try {
                            return parseFloat(session.duration)
                        } catch (error) {
                            return session.duration
                        }
                    }
                }
                
            }},
        ];
        // console.log("🚀 ~ file: lesson_responses.js ~ line 100 ~ obj", obj)
                $('#FlashCardResponse_Table').DataTable({
                    data: obj,
                    columns: columnsObj,
                    rowsGroup: [
                            1,
                            0,
                            2,
                            3
                        ]
                });
                $('#UserSession_Table').DataTable({
                    data: obj,
                    columns: [
                        { data: 'user_session.0.name', "sWidth": "25%"  },
                        { data: 'user_session.0.email', "sWidth": "25%" },
                        { data: 'user_session.0.phone', "sWidth": "25%" }
                    ]
                });
        },
        // error: function (obj, textstatus) {
        //     alert(obj.msg);
        // }
    });
    $.fn.dataTable.ext.errMode = 'none';
});

function viewResponseCard(e){
    $('#response_preview').empty();
    let row = {}
    if(e.target.dataset.row)
        row = JSON.parse(e.target.dataset.row);
    else
        row = JSON.parse(e.target.parentElement.dataset.row);
    $('#responseModalLongTitle').text('Flashcard Preview ('+row.flashcard[0].id+') - '+row.flashcard[0].lesson_type)
    document.getElementById('response_body_ques').innerHTML = `<p><strong> Question: </strong> ${row.flashcard[0].question}</p>`     
    let responseBody = ''
    switch (row.flashcard[0].lesson_type) {
        case 'user_image_upload':
            responseBody+=`<div><img style="max-width:500px; max-height:350px; display:block; margin:auto" src="${row.answer}"></div>`
            break;
        case 'user_video_upload':
            responseBody+=`<div><video style="max-width:500px; max-height:350; display:block; margin:auto" controls>
            <source src="${row.answer}" type="video/mp4"></video>
            </div>`
            break;
        case 'user_gps':
            $('#response_preview').append(`<div style="height:350px" id="map"></div>`)
            $('#response_body_ques').append('<p><strong>GPS:</strong>{lat:"'+row.latitude + '",lng:"' + row.longitude+'"}<br><strong>User note</strong>:' + row.answer + '</p>')
            setupMapView(row);
            break;
        case 'question_checkboxes':
            $('#response_body_ques').append(`<span style="display: inline-block;margin-right: 18px;"><strong>Question Image</strong></span>
            <img style="border-radius: 3px;box-shadow: 5px 9px 12px, 0 0 10px inset;margin: auto;padding-top: 0px;max-width: 370px;
            max-height: 200px;" src="${row.flashcard[0].image}">`);
            responseBody =  '<ul style="list-style:none">'
            let selected_options = row.answer.split(',')
            row.flashcard[0].options.forEach(op=>{
                console.log(op==row.answer)
                responseBody += `<li><i class="fa fa-${selected_options.includes(op)?'check-square':'square-o'}" aria-hidden="true"></i> ${op} </li>`
            })
            responseBody += '</ul>'
            break;
        case 'signature':
            responseBody+=`<div><img style="max-width:500px; max-height:350px; display:block; margin:auto" src="${row.answer}"></div>`
            break;
        case 'question_choices':
            $('#response_body_ques').append(`<span style="display: inline-block;margin-right: 18px;"><strong>Question Image</strong></span>
            <img style="border-radius: 3px;box-shadow: 5px 9px 12px, 0 0 10px inset;margin: auto;padding-top: 0px;max-width: 370px;
            max-height: 200px;" src="${row.flashcard[0].image}">`);
            responseBody =  '<ul style="list-style:none">'
            row.flashcard[0].options.forEach(op=>{
                console.log(op==row.answer)
                responseBody += `<li><i class="fa fa-${op==row.answer?'check-circle':'circle-o'}" aria-hidden="true"></i> ${op} </li>`
            })
            responseBody += '</ul>'
            break;
        default:
            break;
    }
    $('#response_preview').append(responseBody);
    let user_info = `<div>
                     <p><strong>Name:</strong> ${row.user_session[0].name}</p>
                     <p><strong>Email:</strong> ${row.user_session[0].email} <i style="color:${row.user_session[0].has_verified_email?'green':'red'}" class="fa fa-${row.user_session[0].has_verified_email?'check':'remove'}" aria-hidden="true"></i></p>
                     <p><strong>Phone:</strong> ${row.user_session[0].phone} <i style="color:${row.user_session[0].has_verified_phone?'green':'red'}" class="fa fa-${row.user_session[0].has_verified_phone?'check':'remove'}" aria-hidden="true"></i></p>
                     <p><strong>Session_Id:</strong> ${row.user_session[0].session_id}</p>
                     </div>`
    document.getElementById('response_user_info').innerHTML = user_info;
    $('#responseModal').modal('show');

}

function setupMapView(row) {
    const latlng = { lat: row.latitude, lng: row.longitude };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: latlng,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: latlng,
        map: map,
    });
    infoWindow = new google.maps.InfoWindow({
        position: latlng,
        });
    infoWindow.setContent(
        JSON.stringify({...latlng, 'User Note':row.answer} , null, 2)
        );
    infoWindow.open(map);
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        let content = mapsMouseEvent.latLng.toJSON();
        if (mapsMouseEvent.latLng.toJSON().lat == latlng.lat && mapsMouseEvent.latLng.toJSON().lng == latlng.lng){
            content['User Note'] = row.answer;
        }
    infoWindow.setContent(
            JSON.stringify(content, null, 2)
        );
    infoWindow.open(map);
    });
}

function getParam(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
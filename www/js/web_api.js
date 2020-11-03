function get_users() {
    get_user_list(function(users) {
        for(var user of users) {
            /// XXX @santosh add to users list section
            console.log(user)
        }
    });
}

function list_inbound_calls(callback) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "admin_backend/api_admin/list_calls",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",

    }
    $.ajax(settings).done(function (response) {
        callback(JSON.parse(response))
    }).fail(function (err) {
      alert("ERROR")
    })
}

function list_services(callback) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/get_services",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",

    }
    $.ajax(settings).done(function (response) {
        callback(JSON.parse(response).places)
    }).fail(function (err) {
      alert("ERROR")
    })
}






function get_user_list(callback) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "admin_backend/api_admin/get_members",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",

    }
    $.ajax(settings).done(function (response) {
        callback(JSON.parse(response))
    }).fail(function (err) {
      alert("ERROR")
    })
}


function send_user_sms(to_number, msg, callback) {
    var form = new FormData();
    form.append("to_number", to_number);
    form.append("msg", msg);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "voip/api_voip/send_sms",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form,
        "headers": {
            "Authorization": localStorage.getItem("token"),
        },

    }
    $.ajax(settings).done(function (response) {
        // change screen for code collecton
        console.log(response)
    }).fail(function (err) {
      //alert("ERROR")
    });
}

function get_sms_to_number(to_number, callback) {
    var form = new FormData();
    form.append("to_number", to_number);

    var settings = {
        "async": true,
        "crossDomain": true,
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "url": SERVER + "voip/api_voip/list_sms",
        "method": "POST",
    }
    $.ajax(settings).done(function (response) {
        response = JSON.parse(response)
        // XXX Santosh here is what msg look like to populate
        // SMS chat interface.
        for(var msg of response.messages) {
            console.log(msg);
        }
        callback(response.messages)
    }).fail(function (err) {
        alert("ERROR")
    })
}

function get_users() {
    get_user_list(function(users) {
        for(var user of users) {
            /// XXX @santosh add to users list section
            console.log(user)
        }
    });
}

function list_question_counters(callback) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "admin_backend/api_admin/question_counters",
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
        callback(JSON.parse(response))
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


function send_image_twilio(callback){
    // alert("ready");
    swal({
                title: "0%",
                text: "File uploading please wait.",
                icon: "info",
                buttons: false,
                closeOnEsc: false,
                closeOnClickOutside: false,
            });
    var formData = new FormData()
    formData.append("file",$('input[type=file]')[0].files[0]);
    console.log(formData);
      var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER + 's3_uploader/upload',
            "method": "POST",
            "type": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": formData,
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        };
     console.log(settings);
        $.ajax(settings).done(function (response) {
            swal({
                  title: "Good job!",
                  text: "File uploaded successfully!",
                  icon: "success",
            });
            response = JSON.parse(response);
            console.log(response);
            file_url = response['file_url']
            alert(file_url);
            upload_to_twilio(file_url);

            // $('#output').html("<div> Uploaded to S3 Url: "+ file_url + "</div>");
    
            // var img = $('<img>');
            // img.attr('src', file_url);
            // img.appendTo('#output');
        }).fail(function (response) {
            swal({
                  title: "Error!",
                  text: "File upload failed!",
                  icon: "warning",
            });
        });
    
}

function upload_to_twilio(image){
    // console.log(user_phone);
    var form = new FormData();
    form.append("to_number", user_phone);
    form.append("image", image);
    console.log(form)
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "voip/api_voip/send_file",
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
        console.log(response)
    }).fail(function (err) {
      alert("ERROR")
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

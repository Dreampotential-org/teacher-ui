function get_users() {
    get_user_list(function(users) {
        for(var user of users) {
            /// XXX @santosh add to users list section
            console.log(user)
        }
    });
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


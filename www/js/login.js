function init_login() {

    $("body").delegate("#login_number", "click", function(e) {
        if ($(".phone-code-input").is(":visible")) {
            next_code_login()
        }
        if ($(".name-input").is(":visible")) {

        } else {
            phone_login()
        }
    })
}

function name_set() {
    var form = new FormData();
    form.append("name", $("#name").val());

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/set_info",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings).done(function (response) {
        // change screen for code collecton
        swal({
          title: "Good job!",
          text: "You're logged in",
          icon: "success",
        });
        home()
        $("#login_number").hide()

    }).fail(function (err) {
      alert("ERROR")
    });


}

function phone_login() {
    var form = new FormData();
    form.append("phone_number", $("#phone").val());

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/login-phone-number",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings).done(function (response) {
        // change screen for code collecton
        $(".phone-code-input").show()
        $(".phone-input").hide()

    }).fail(function (err) {
      alert("ERROR")
    });
}

function next_code_login() {
    var form = new FormData();
    form.append("phone_number", $("#phone").val());
    form.append("code_2fa", $("#phone-code").val());

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/login-verify-2fa",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings).done(function (response) {
      var resp = JSON.parse(response)
      if(resp.message.includes("success")) {
        localStorage.setItem('token', resp.token)
        swal({
          title: "Good job!",
          text: "Correct",
          icon: "success",
        });
        $(".phone-code-input").hide()
        $(".name-input").show()
      }
    }).fail(function (err) {
        swal({
          title: "Issue",
          text: "Incorrect code Try again",
          icon: "error",
        });

    });
}

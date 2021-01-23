var SERVER = "https://sfapp-api.dreamstate-4-all.org/";
// var SERVER = 'http://localhost:8000/'

var passwordResetToken = getParam("token");
var userToken = localStorage.getItem("user-token");

console.log("MODE: PASSWORD_RESET, Token - " + passwordResetToken);

if (userToken != null) {
  window.location.replace("student_dashboard.html");
}

function getParam(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split("&");
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

$(document).ready(function () {
  let MODE = "WELCOME_PAGE";

  if (passwordResetToken) {
    MODE = "PASSWORD_RESET";
  } else if (userToken) {
    MODE = "HOME_PAGE";
  }

  $("#signUpForm").on("submit", function (ev) {
    ev.preventDefault();

    $.ajax({
      url: SERVER + "s3_uploader/user/register",
      type: "post",
      data: $(this).serialize(),
      success: function (response) {
        // Whatever you want to do after the form is successfully submitted
        console.log(response);
        localStorage.setItem("user-token", response.token);

        swal({
          title: "Welcome " + response.user.name + "!",
          text: "Your account is created.",
          icon: "success",
          buttons: false,
          timer: 1000,
        });

        displayPage("dashboard");
      },
      error: function (err) {
        swal({
          title: "Error",
          text: "Username is already exists",
          icon: "error",
        });
      },
    });
  });

  $("#loginForm").on("submit", function (ev) {
    ev.preventDefault();
    swal({
      title: "Signing In!",
      icon: "success",
      buttons: false,
    });

    $.ajax({
      url: SERVER + "s3_uploader/user/login",
      type: "post",
      data: $(this).serialize(),
      success: function (response) {
        // Whatever you want to do after the form is successfully submitted
        loginResponse = response;
        localStorage.setItem("user-token", response.token);
        localStorage.setItem("username",response.user.email)

        swal({
          title: "Welcome " + response.user.name + "!",
          text: "You are logged in.",
          icon: "success",
          buttons: false,
          timer: 1000,
        });

        // displayPage("dashboard");

        window.location.replace("student_dashboard.html");
      },
      error: function () {
        swal({
          title: "Error",
          text: "",
          icon: "error",
        });
      },
    });
  });

  $("#passwordResetForm").on("submit", function (ev) {
    ev.preventDefault();

    $.ajax({
      url: SERVER + "s3_uploader/user/password_reset/",
      type: "post",
      data: $(this).serialize(),
      success: function (response) {
        // Whatever you want to do after the form is successfully submitted
        console.log(response);

        swal({
          title: "Success!",
          text: "Please check your email for password reset link.",
          icon: "success",
        });
      },
      error: function (message) {
        console.log("Error message:", message);
        swal({
          title: "Error",
          text: message,
          icon: "error",
        });
      },
    });
  });

  $("#passwordResetConfirmForm").on("submit", function (ev) {
    ev.preventDefault();
    console.log("passwordResetConfirmForm submit");

    $.ajax({
      url: SERVER + "s3_uploader/user/password_reset/confirm/",
      type: "post",
      data: $(this).serialize(),
      success: function (response) {
        // Whatever you want to do after the form is successfully submitted
        console.log(response);

        swal({
          title: "Success!",
          text: "Password changed!",
          icon: "success",
          buttons: false,
          timer: 1000,
        });

        displayPage("dashboard");
      },
      error: function (response) {
        console.log("Error response:", response, response.responseText);
        response = JSON.parse(response.responseText);
        message = "";
        if (response.password) {
          let passwordErrors = response.password;
          message = passwordErrors.join(". ");
        }
        swal({
          title: "Error",
          text: message,
          icon: "error",
        });
      },
    });
  });

  if (MODE == "PASSWORD_RESET") {
    console.log("MODE: PASSWORD_RESET");
    // set res-token
    $("#res-token").val(passwordResetToken);
    displayModal("passwordResetConfirmModal");
  } else if (MODE == "HOME_PAGE") {
    console.log("MODE: HOME_PAGE");
    displayPage("dashboard");
  } else {
    console.log("MODE: " + MODE);
    displayPage("landing-page");
  }

  clickEvents();
});

const modals = [
  "signupModal",
  "signinModal",
  "passwordResetModal",
  "passwordResetConfirmModal",
];
const pages = ["landing-page", "dashboard"];

function hideModals() {
  for (var modal of modals) {
    console.log("hiding:", modal);
    $("#" + modal).removeClass("is-visible");
  }
}

function displayModal(activeModal) {
  console.log("activeModal:", activeModal);
  for (var modal of modals) {
    if (modal != activeModal) {
      console.log("hiding:", modal);
      $("#" + modal).removeClass("is-visible");
    }
  }
  console.log("Displaying modal:", activeModal);
  $("#" + activeModal).addClass("is-visible");
}

function displayPage(activePage) {
  hideModals();
  console.log("activePage:", activePage);
  for (var page of pages) {
    if (page != activePage) {
      console.log("hiding:", page);
      $("#" + page).hide();
    }
  }
  console.log("Displaying Page:", activePage);
  $("#" + activePage).show();
}

function clickEvents() {
  $("#signup").on("click", function (e) {
    e.preventDefault();
    $("#signupModal").addClass("is-visible");
  });

  $("#signupLink").on("click", function (e) {
    e.preventDefault();
    console.log("signupLink");
    displayModal("signupModal");
  });

  $(".signinLink").on("click", function (e) {
    e.preventDefault();
    console.log("signinLink");
    displayModal("signinModal");
  });

  $("#passwordResetLink").on("click", function (e) {
    e.preventDefault();
    console.log("passwordResetLink");
    displayModal("passwordResetModal");
  });

  $(".close").on("click", function (e) {
    e.preventDefault();
    hideModals();
  });

  $("#signin").on("click", function (e) {
    e.preventDefault();
    $("#signinModal").addClass("is-visible");
  });

  $("#passwordreset").on("click", function (e) {
    e.preventDefault();
    $("#passwordResetModal").addClass("is-visible");
  });

  $("#logoutBtn").on("click", function (e) {
    e.preventDefault();
    // localStorage.removeItem("username");
    console.log("Logout");

    swal({
      title: "Success!",
      text: "Your are logged out.",
      icon: "success",
      buttons: false,
      timer: 1000,
    });
    
    // localStorage.removeItem("user-token");
    localStorage.clear()
    displayPage("landing-page");
  });
}

// Not in use!
function signup_api(params) {
  var form = new FormData();
  form.append("name", params.name);
  form.append("email", params.email);
  form.append("password", params.password);

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "s3_uploader/user/register",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      $("#signupModal #nextBtn").removeClass("running");
      var msg = JSON.parse(response).message;
      if (msg && msg == "User already exists") {
        swal({
          title: "Email already exists",
          text: "",
          icon: "error",
        });
        return;
      }
      localStorage.setItem("session_id", JSON.parse(response).token);
      // show toggle bar
      $(".toggleBar").show();
      console.log("user logged in");
      // after successful login or signup show dashboard contents
      showATab("dashboard");
      // close modals
      closeAllModals();
      $(".moto").show();

      swal({
        title: "Good job!",
        text: "You're logged in",
        icon: "success",
      });

      get_profile_info(function (msg) {
        // show_set_monitor();
      });

      // $("#proTip").addClass("is-visible");
    })
    .fail(function (err) {
      console.log(err);
      $("#signupModal #nextBtn").removeClass("running");
      console.log(err);
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}

var SERVER = "https://sfapp-api.dreamstate-4-all.org/";

//var SERVER = 'http://localhost:8001/'

var passwordResetToken = getParam("token");
var userToken = localStorage.getItem("user-token");

console.log("MODE: PASSWORD_RESET, Token - " + passwordResetToken);

if (userToken == null) {
  window.location.replace("student_login.html");
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
  if (passwordResetToken) {
    MODE = "PASSWORD_RESET";
  } else if (userToken) {
    MODE = "HOME_PAGE";
  }

  $("#lesson-card-body").on("click", function (e) {
    window.location.replace("student_lesson.html");
  });

  $(".card-add-student").on("click", function (e) {
    window.location.replace("student_list.html");
  });
  $(".card-add-class").on("click", function (e) {
    window.location.replace("class_list.html");
  });

  // $(".logoutid").on("click", function (e) {
  //   alert("hii");
  //   localStorage.removeItem("user-token");
  //   location.reload();
  // });
});

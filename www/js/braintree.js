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

  $("#left-sidebar").load("sidebar.html");
  $("#page-header").load("header.html");
  $("#braintreeDiv").show();
  // $("#systemUserDetail").hide();
  // $("#buyItem").hide();
  // console.log("ajax call started");
  // var SERVER = 'http://127.0.0.1:8000/';

  $("#braintree").submit((event) => {
    event.preventDefault()
    // craete item
    var braintree_form = new FormData();
    braintree_form.append("braintree_merchant_ID", $("#braintree_merchant_ID").val())
    braintree_form.append("braintree_public_key", $("#braintree_public_key").val())
    braintree_form.append("braintree_private_key", $("#braintree_private_key").val())

    // var SERVER = 'http://localhost:8000/';
    var settings_add_braintree = {
      "async": true,
      "crossDomain": true,
      "url": SERVER + 'store/TeacherUIBraintreeConfig',
      "method": "POST",
      "type": "POST",
      "processData": false,
      "contentType": false,
      // "mimeType": "multipart/form-data",
      "data": braintree_form,
      "headers": {
        "Authorization": localStorage.getItem("user-token")
      }
    };
    $.ajax(settings_add_braintree).done(function (response) {
      // response = JSON.parse(response);
      console.log(response);
      swal({
        title: "success!",
        text: "Add Braintree Config is done!",
        icon: "success",
      });
      location.reload()
    }).fail(function (response) {
      console.log(response, "add Braintree Config Failed!");
      swal({
        title: "Error!",
        text: "Add Braintree Config is failed!",
        icon: "warning",
      });
    });

  })




});

$("#body-row .collapse").collapse("hide");

// Collapse/Expand icon
//$('#collapse-icon').addClass('fa-angle-double-left');
// Collapse click
function left_sidebar() {
  SidebarCollapse();
  $('.logoimg').toggleClass("d-none");
  $('#cross').toggleClass("d-none");
}
function SidebarCollapse() {
  $(".menu-collapsed").toggleClass("d-none");
  $(".sidebar-submenu").toggleClass("d-none");
  $(".submenu-icon").toggleClass("d-none");
  $('#bar').toggleClass("d-block");
  $("#sidebar-container").toggleClass(
    "sidebar-expanded sidebar-collapsed"
  );
  // Treating d-flex/d-none on separators with title
  var SeparatorTitle = $(".sidebar-separator-title");
  if (SeparatorTitle.hasClass("d-flex")) {
    SeparatorTitle.removeClass("d-flex");
  } else {
    SeparatorTitle.addClass("d-flex");
  }
  // Collapse/Expand icon
  //$('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
}
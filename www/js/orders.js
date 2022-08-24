var passwordResetToken = getParam('token');
var userToken = localStorage.getItem('user-token');
console.log('MODE: PASSWORD_RESET, Token - ' + passwordResetToken);

if (userToken == null) {
  window.location.replace('student_login.html');
}

function getParam(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

$(document).ready(function () {
  $('#left-sidebar').load('sidebar.html');
  $('#page-header').load('header.html');
  $('#orderDiv').show();
  // $("#systemUserDetail").hide();
  // console.log("ajax call started");

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + 'store/userOrderList',
    method: 'GET',
    type: 'GET',
    processData: false,
    contentType: false,
    // "mimeType": "multipart/form-data",
    // "data": form,
    headers: {
      Authorization: Bearer localStorage.getItem('user-token'),
    },
  };
  $.ajax(settings)
    .done(function (response) {
      // response = JSON.parse(response);
      console.log(response);
      response.forEach((item, i) => {
        // console.log(item);
        // console.log(i);
        $('#item-data').append(`<tr>
      <td>${item.id}</td>
      <td>${item.user}</td>
      <td>${item.name}</td>
      <td>${item.item_ID}</td>
      <td>${item.date_ordered}</td>
      <td>${item.is_ordered}</td>
      <td>${item.braintreeID}</td>
      </tr>`);
      });
      $('#order_data_table').DataTable({
        paging: true,
        pageLength: 5, // false to disable pagination (or any other option)
      });
    })
    .fail(function (response) {
      console.log('get user item list is Failed!');
      swal({
        title: 'Error!',
        text: 'there is some error!',
        icon: 'warning',
      });
    });
});
$('#body-row .collapse').collapse('hide');

// Collapse/Expand icon
//$('#collapse-icon').addClass('fa-angle-double-left');

// Collapse click
function left_sidebar() {
  SidebarCollapse();
}
function SidebarCollapse() {
  $('.menu-collapsed').toggleClass('d-none');
  $('.sidebar-submenu').toggleClass('d-none');
  $('.submenu-icon').toggleClass('d-none');
  $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');

  // Treating d-flex/d-none on separators with title
  var SeparatorTitle = $('.sidebar-separator-title');
  if (SeparatorTitle.hasClass('d-flex')) {
    SeparatorTitle.removeClass('d-flex');
  } else {
    SeparatorTitle.addClass('d-flex');
  }
}

$(document).ready(function () {
  $("#left-sidebar").load("sidebar.html");
  $("#page-header").load("header.html");
  //                        $("#page-container").load('dashboard.html');
});
$("#body-row .collapse").collapse("hide");

// Collapse/Expand icon
//$('#collapse-icon').addClass('fa-angle-double-left');

// Collapse click
function left_sidebar() {
  SidebarCollapse();
}
function SidebarCollapse() {
  $(".menu-collapsed").toggleClass("d-none");
  $(".sidebar-submenu").toggleClass("d-none");
  $(".submenu-icon").toggleClass("d-none");
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

var group_data = [
  { created_at: "2020-10-08T20:47:22Z", group_name: "group1" },
  { created_at: "2020-11-02T20:55:04Z", group_name: "group1" },
  { created_at: "2020-11-02T20:56:50Z", group_name: "group3" },
  { created_at: "2020-11-13T04:12:40Z", group_name: "group1" },
  { created_at: "2020-11-13T04:12:40Z", group_name: "group2" },
];

var system_users;
$(document).ready(function () {
  
  $("#tabDiv").show();
  $("#systemUserDetail").hide();
  
  var settings = {
      "async": true,
      "crossDomain": true,
      "url":  SERVER + "students_list/get/students",
      "method": "GET",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",

  }
  $.ajax(settings).done((response) => {
    system_users = JSON.parse(response)
    system_users.forEach((item,i) => {
        $("#users-data").append(`<tr>
                          <td>${item.name}</td>
                          <td>${item.email}</td>
                          <td>${item.phone}</td>
                          <td><button onclick="editSystemUser('${i}')" class="btn btn-primary btn-edit"><i class="fa fa-pencil-square-o"></i></button></td>
                          </tr>`);
      })
  }).fail(function (err) {
    alert("ERROR")
  })

  group_data.forEach((item, i) => {
    $("#group-data").append(`<tr>
                  <td>${item.created_at}</td>
                  <td>${item.group_name}</td>
                  <td><button onclick="openModal('${i}')" class="btn btn-primary btn-edit"><i class="fa fa-pencil-square-o"></i></button></td>
                  </tr>`);
  });
});

function addUser() {
  console.log("Add User");
}
function addPhone() {
  console.log("Add Phone");
}
function addGroup() {
  console.log("Add Group ", $("#grouplist").val());
}

$("#addStudent").on('click', () => {
  $.ajax({
    type: 'POST',
    url:  SERVER + 'students_list/get/students',
    data: {
      "name":$("#uname").val(),
      "phone":$("#phone").val(),
      "email":$("#email").val(),
    },
    success: () => {
      location.reload()
    }
  })
})

$("#showDelete").on('click', () => {
    $.ajax({
      type: 'DELETE',
      url: SERVER + 'students_list/get/students' + '?' + $.param({'id': $("#eid").val() }),
      success: () => {
          location.reload();
        
      }
    })
})

$("#updateStudent").on('click',() => {
  $.ajax({
    type: 'PUT',
    url:  SERVER + 'students_list/get/students' + '?' + $.param({'id': $("#eid").val() }),
    data: {
      "id":$("#eid").val(),
      "name":$("#ename").val(),
      "phone":$("#ephone").val(),
      "email":$("#eemail").val(),
    },
    success: () => {
      location.reload()
    }
  })
})

function editSystemUser(i) {
  $("#tabDiv").hide();
  $("#systemUserDetail").show();

  $("#ename").val(system_users[i].name);
  $("#eemail").val(system_users[i].email);
  $("#ephone").val(system_users[i].phone);
  $("#eid").val(system_users[i].id)
}
function goBack() {
  $("#tabDiv").show();
  $("#systemUserDetail").hide();
}

function openModal(i) {
  if (i != -1) {
    $("#groupTitle").text("Update Group");
    $("#grouplist").val(group_data[i].group_name);
  } else {
    $("#groupTitle").text("Add Group");
    $("#grouplist").val("group1");
  }

  $("#groupModal").modal();
}
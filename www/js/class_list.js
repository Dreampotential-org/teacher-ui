
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
      var system_users = [
        {
          class_id: "CLS1",
          class_name: "Class A",
          // student_name: "John",
        },
        {
          class_id: "CLS2",
          class_name: "Class B",
          // student_name: "Moe",
        },
        {
          class_id: "CLS3",
          class_name: "Class C",
          // student_name: "Dooley",
        },
      ];

      var system_students = [
        {
          student_name: "John",
          student_email: "john@gmail.com",
          student_phone: "+123252522",
        },
        {
          student_name: "Moe",
          student_email: "mary@example.com",
          student_phone: "+18741271367",
        },
        {
          student_name: "Dooley",
          student_email: "july@example.com",
          student_phone: "+18741279437",
        },
      ];

      var group_data = [
        { class_id: "CLS1", group_name: "group1" },
        { class_id: "CLS2", group_name: "group2" },
        { class_id: "CLS3", group_name: "group3" },
      ];
      var system_users;
      $(document).ready(function () {
        $("#tabDiv").show();
        $("#systemUserDetail").hide();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://127.0.0.1:8000/students_list/get/class",
            "method": "GET",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
        
        }
        $.ajax(settings).done((response) => {
            system_users = JSON.parse(response)
            system_users.forEach((item,i) => {
                $("#users-data").append(`<tr>
                                <td>${item.class_id}</td>
                                <td>${item.class_name}</td>
                                <td><button onclick="editSystemUser('${i}')" class="btn btn-primary btn-edit"><i class="fa fa-pencil-square-o"></i></button>
                                  &nbsp
                                  <button onclick="editSystemStudent('${i}')" class="btn btn-primary btn-edit"><i class="fa fa-list"></i></button></td>
                                </tr>`);
            })
        }).fail(function (err) {
            alert("ERROR")
        })

        system_students.forEach((item, i) => {
          $("#student-data").append(`<tr>
                        <td>${item.student_name}</td>
                        <td>${item.student_email}</td>
                        <td>${item.student_phone}</td>
                        <td><button onclick="" class="btn btn-primary btn-edit"><i class="fa fa-trash"></i></button>
                        </tr>`);
        });

        // system_users.forEach((item, i) => {
        //   $("#users-data").append(`<tr>
        //                 <td>${item.class_id}</td>
        //                 <td>${item.class_name}</td>
        //                 <td>${item.student_name}</td>
        //                 <td><button onclick="editSystemUser('${i}')" class="btn btn-primary btn-edit"><i class="fa fa-pencil-square-o"></i></button>
        //                   &nbsp
        //                   <button onclick="editSystemStudent('${i}')" class="btn btn-primary btn-edit"><i class="fa fa fa-plus"> Add</i></button></td>
        //                 </tr>`);
        // });

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

      $("#addClass").on('click', () => {
        $.ajax({
          type: 'POST',
          url: 'http://127.0.0.1:8000/students_list/get/class',
          data: {
            "class_name":$("#class_name").val(),
            "class_id":$("#class_id").val(),
          },
          success: () => {
            location.reload()
          }
        })
      })

      $("#showDelete").on('click', () => {
        $.ajax({
          type: 'DELETE',
          url:'http://127.0.0.1:8000/students_list/get/class' + '?' + $.param({'id': $("#cid").val() }),
          success: () => {
              location.reload();
            
          }
        })
        })

        $("#updateClass").on('click',() => {
            $.ajax({
              type: 'PUT',
              url: 'http://127.0.0.1:8000/students_list/get/class' + '?' + $.param({'id': $("#cid").val() }),
              data: {
                "id":$("#cid").val(),
                "class_name":$("#classname").val(),
                "class_id":$("#classid").val(),
              },
              success: () => {
                location.reload()
              }
            })
          })

      function editSystemUser(i) {
        $("#tabDiv").hide();
        $("#systemUserDetail").show();

        $("#classid").val(system_users[i].class_id);
        $("#classname").val(system_users[i].class_name);
        $("#cid").val(system_users[i].id)
        // $("#studentname").val(system_users[i].student_name);
      }

      function editSystemStudent(i) {
        $("#studentModal").modal();
        $("#stud-class-id").val(system_users[i].class_id);
        $("#stud-class-name").val(system_users[i].class_name);
        // $("#stud-student-name").val(system_users[i].student_name);
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

      function openStudentModal() {
        $('#studentModal').modal('toggle');
        $("#add-student-Modal").modal();
      }
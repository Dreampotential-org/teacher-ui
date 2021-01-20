
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
    //   var system_users = [
    //     {
    //       class_id: "CLS1",
    //       class_name: "Class A",
    //       // student_name: "John",
    //     },
    //     {
    //       class_id: "CLS2",
    //       class_name: "Class B",
    //       // student_name: "Moe",
    //     },
    //     {
    //       class_id: "CLS3",
    //       class_name: "Class C",
    //       // student_name: "Dooley",
    //     },
    //   ];

    //   var system_students = [
    //     {
    //       student_name: "John",
    //       student_email: "john@gmail.com",
    //       student_phone: "+123252522",
    //     },
    //     {
    //       student_name: "Moe",
    //       student_email: "mary@example.com",
    //       student_phone: "+18741271367",
    //     },
    //     {
    //       student_name: "Dooley",
    //       student_email: "july@example.com",
    //       student_phone: "+18741279437",
    //     },
    //   ];

      var group_data = [
        { class_id: "CLS1", group_name: "group1" },
        { class_id: "CLS2", group_name: "group2" },
        { class_id: "CLS3", group_name: "group3" },
      ];
      var system_users;
      var system_students;
      var all_students;
        
      $(document).ready(function () {
        $("#tabDiv").show();
        $("#systemUserDetail").hide();
        var class_settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://127.0.0.1:8000/students_list/get/class",
            "method": "GET",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
        
        }
        // var getData = function(url,place) {
        //     $.ajax(url).done((res) => {
    
        //         place = res
        //     }).fail(function (err){
        //         alert(err)
        //     })
        // }
    
        $.get("http://127.0.0.1:8000/students_list/get/class").done((response) => {
            system_users = response
            system_users.forEach((item,i) => {
                $("#users-data").append(`<tr>
                                <td>${item.class_id}</td>
                                <td>${item.class_name}</td>
                                <td><button onclick="editSystemUser('${i}')" class="btn btn-primary btn-edit"><i class="fa fa-pencil-square-o"></i></button>
                                  &nbsp
                                  <button onclick="editSystemStudent('${i}','${item.class_id}')" class="btn btn-primary btn-edit"><i class="fa fa-list"></i></button></td>
                                </tr>`);
            })
            $.get("http://127.0.0.1:8000/students_list/get/classenrolled").done((res) => {
                console.log(res)
                system_students = res 
                
            }).fail(function (err){
                alert(err)
            })
            }).fail(function (err) {
            alert(err)
        })
        // $.get("http://127.0.0.1:8000/students_list/get/students").done((data) => {
        //             console.log(data)
        //                 all_students = data
        //             }).fail(function (err) {
        //                 alert(err)
        //             })


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

      function editSystemStudent(i,id) {
        $("#student-data").empty()
        $("#AddStudent").val(id) 
        $("#studentModal").modal();
            system_students.forEach((item, i) => {
                
                if (id === item.class_enrolled.class_id){
                    $("#student-data").append(`<tr>
                    <td>${item.student.name}</td>
                    <td>${item.student.email}</td>
                    <td>${item.student.phone}</td>
                    <td><button onclick="deleteStudent('${item.student.id}','${item.class_enrolled.id}')" class="btn btn-primary btn-edit"><i class="fa fa-trash"></i></button>
                    </tr>`);
                }
              })
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
      let option_length;
      function openStudentModal() {
        $('#studentModal').modal('toggle');
        $("#add-student-Modal").modal();
        $('#add_classid').val( $("#AddStudent").val())
        // option_length = $("#studentlist option").length
        // console.log(option_length)
      }
   
      $("#AddStudent").click(() => {
          student = $("#studentlist option:selected").val()
          class_ = $("#add_classid").val()
          $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8000/students_list/get/classenrolled',
            data: {
              "student":student,
              "class":class_,
            },
            success: () => {
              location.reload()
            }
          })
      })
       
      $("#studentlist").click(() => {
          option_length = ($("#studentlist option").length)
          
          if ($("#studentlist option:selected").val() != "Select Student") {
            $("#AddStudent").attr("disabled", false)
          } else{
            $("#AddStudent").attr("disabled", true)
          }
        if (option_length === 1) {
                system_students.forEach((item,i) =>{
                    if ($("#AddStudent").val() !== item.class_enrolled.class_id) {
                        
                       $("#studentlist").append($('<option>').val(item.student.name).text(item.student.name))
                    }
                })
                // all_students.foreach((item,i) => {
                //     $("#studentlist").append($('<option>').val(item.name).text(item.name))
                // })

            }
        })
    
        function deleteStudent(sid,cid){
            $.ajax({
                type: 'DELETE',
                url:'http://127.0.0.1:8000/students_list/get/classenrolled' + '?' + $.param({'sid': sid , 'cid': cid }),
                success: () => {
                    location.reload();
                  
                }
              })
        }
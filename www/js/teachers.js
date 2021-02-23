var userToken = localStorage.getItem("user-token");

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


$(document).ready(function() {
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

var system_users;
var teacher_students;
var all_students;
$(document).ready(function() {

    $("#tabDiv").show();
    $("#systemUserDetail").hide();

    $.ajax({
        async: true,
        crossDomain: true,
        url: SERVER + "students_list/get/teachers",
        method: "GET",
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data"
    }).done((response) => {
        $('#teachersloader').remove();
        system_users = JSON.parse(response)
        system_users.forEach((item, i) => {
            $("#teachers-data").append(`<tr>
            <td>${item.username}</td>
            <td><button onclick="editSystemStudent('${item.id}','${i}')" class="btn btn-primary btn-edit"><i class="fa fa-list"></i></button></td>
            </tr>`);
        })
        $.ajax({
            async: true,
            crossDomain: true,
            url: SERVER + "students_list/get/students/" + '?' + $.param({ 'teacher': true }),
            method: "GET",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            headers: { "Authorization": `${localStorage.getItem('user-token')}` }

        }).done((student) => {
            all_students = JSON.parse(student)
            $.ajax({
                async: true,
                crossDomain: true,
                url: SERVER + "students_list/get/teachers" + '?' + $.param({ 'teacher': true }),
                method: "GET",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                headers: { "Authorization": `${localStorage.getItem('user-token')}` }
            }).done((teacherStudents) => {
                teacher_students = JSON.parse(teacherStudents)
            }).fail((err) => {alert('ERROR')})

        }).fail((err) => {alert('ERROR')})

    }).fail(function(err) {
        $('#teachersloader').remove();
        alert("ERROR")
    })
});

$("#AddStudent").click(() => {
    let teacher_student = []
    student = $("#studentlist option:selected").val()
    student_name = $("#studentlist option:selected").text()
    teacher = $("#AddStudent").val()
    var filteredStudent = teacher_students.filter((el) => {
        return String(el.teacher.id) === String($("#AddStudent").val())
    })
    filteredStudent.forEach((item, i) => {
        teacher_student.push(String(item.student.id))
    })

    if (teacher_student.indexOf(String(student)) === -1) {
        $.ajax({
            type: 'POST',
            url: SERVER + 'students_list/get/teachers',
            data: {
                "student": student,
                "teacher": teacher,
            },
            success: () => {
                location.reload()
            },
            error: (err) => {
                alert('ERROR')
            }
        })
    } else {
        swal({
            title: "Warning",
            text: `${student_name} is already in ${$("#teacherName").val()} list`,
            icon: "warning",
            timer: 1500
        });
    }
})

function deleteStudent(sid, tid) {
    $.ajax({
        type: 'DELETE',
        url: SERVER + 'students_list/get/teachers' + '?' + $.param({ 'sid': sid, 'tid': tid }),
        success: () => {
            location.reload();

        },
        error: (err) => {
            alert('ERROR')
        }
    })
}

function editSystemStudent(id,i) {
    $("#student-data").empty()
    $("#AddStudent").val(id)
    $("#teacherName").val(system_users[i].username)
    $("#studentModal").modal();
    teacher_students.forEach((item) => {
        if (String(id) === String(item.teacher.id)) {
            $("#student-data").append(`<tr>
                    <td>${item.student.name}</td>
                    <td>${item.student.email}</td>
                    <td>${item.student.phone}</td>
                    <td><button onclick="deleteStudent('${item.student.id}','${item.teacher.id}')" class="btn btn-primary btn-edit"><i class="fa fa-trash"></i></button>
                    </tr>`);
        }
    })
}

$("#studentlist").click(() => {
    option_length = ($("#studentlist option").length)
    if ($("#studentlist option:selected").val() != "Select Student") {
        $("#AddStudent").attr("disabled", false)
    } else {
        $("#AddStudent").attr("disabled", true)
    }

    if (option_length === 1) {
        all_students.forEach((item, i) => {
            $("#studentlist").append($('<option>').val(item.id).text(item.name))
        })
    }
})
function openStudentModal() {
    $('#studentModal').modal('toggle');
    $("#add-student-Modal").modal();
}
function goBack() {
    $("#tabDiv").show();
    $("#systemUserDetail").hide();
}

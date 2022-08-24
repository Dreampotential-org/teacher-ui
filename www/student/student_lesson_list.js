
$(document).ready(function () {

    getStudentLessonList(91);

    function getStudentLessonList(student_id) {
        console.log("Student_id => ", student_id);
        try{
            $.ajax({
                url: SERVER + 'courses_api/lesson/student/get/' + student_id,
                async: true,
                crossDomain: true,
                crossOrigin: true,
                type: 'GET',
              //   headers: { Authorization: Bearer `${localStorage.getItem('user-token')}` },
              }).done((response2) => {
                console.log("response => ",response2);
               
                  for (var lessonDt of response2) {
                    $("#student-lesson-list").append(
                        `<tr>
                        <td>${lessonDt.lesson?.id}</td>
                        <td>${lessonDt.lesson?.lesson_name}</td>
                        </tr>`
                        );
                }
              });
        }
        catch(e){
            console.log("Error=> : ", e);
        }

      }

});


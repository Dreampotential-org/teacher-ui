
$(document).ready(function () {
    var student_lesson_list = [
    {
        courseId: 1,
        courseTitle: 'course 1'
    },
    {
        courseId: 2,
        courseTitle: 'course 2'
    },
    {
        courseId: 3,
        courseTitle: 'course 3'
    },
    {
        courseId: 4,
        courseTitle: 'course 4'
    },
    ];

    student_lesson_list.forEach((item, i) => {
        $("#student-lesson-list").append(
            `<tr>
            <td>${item.courseId}</td>
            <td>${item.courseTitle}</td>
            </tr>`
        );
    });

});


let session_responses = []
var lesson_id = getParam("lesson_id")

$(document).ready(function () {
    $("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");
    $.ajax({
        type: "GET",
        url: SERVER+'courses_api/lesson/response/get/'+lesson_id+'/',
        dataType: 'json',
        async: true,	
        crossDomain: true,	
        crossOrigin: true,
        headers: {	
            "Authorization": `${localStorage.getItem('user-token')}`	
        },	
        success: function (obj, textstatus) {
        console.log("🚀 ~ file: lesson_responses.js ~ line 83 ~ obj", obj)
        var columnsObj = [
            { data: "user_session.0.session_id", "sWidth": "25%"},
            { data: "flashcard.0.id", "sWidth": "25%"},
            { data: "answer", "sWidth": "25%" },
            { data: "flashcard.0.usersessionevent.0.duration", "sWidth": "25%" },
        ];
        // console.log("🚀 ~ file: lesson_responses.js ~ line 100 ~ obj", obj)
                $('#FlashCardResponse_Table').DataTable({
                    data: obj,
                    columns: columnsObj,
                    rowsGroup: [
                            1,
                            0,
                            2,
                            3
                        ]
                });
                $('#UserSession_Table').DataTable({
                    data: obj,
                    columns: [
                        { data: 'user_session.0.name', "sWidth": "25%"  },
                        { data: 'user_session.0.email', "sWidth": "25%" },
                        { data: 'user_session.0.phone', "sWidth": "25%" }
                    ]
                });
        },
        // error: function (obj, textstatus) {
        //     alert(obj.msg);
        // }
    });
    $.fn.dataTable.ext.errMode = 'none';
});

function getParam(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
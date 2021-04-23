        $(document).ready(function () {
            $("#left-sidebar").load("sidebar.html");
            $("#page-header").load("header.html");
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

let session_responses = []
var lesson_id = getParam("lesson_id")
$.get(SERVER+'courses_api/lesson/response/get/'+lesson_id+'/',function(response){
    response.forEach(function(r){
        var q = r.flashcard[0].question
        var a = r.answer
        var s_id = r.user_session[0].session_id
        var type = r.flashcard[0].lesson_type
        var start_time = r.flashcard[0].usersessionevent[0].start_time
        var end_time = r.flashcard[0].usersessionevent[0].end_time
        if(!session_responses[s_id]){
            session_responses[s_id] = new Array()
        } 
        session_responses[s_id].push([q,a,type,start_time,end_time])
    })

    for (key in session_responses){
        let sess_id = key
        let sess_data = session_responses[key]
        $("#response-data").append("<tr><td>"+sess_id+"</td><td id="+sess_id+"></td><td id="+sess_id +'-time' +"></td></tr>")

        sess_data.forEach(sess_entry => {
            let question_ = sess_entry[0]
            let answer_ = sess_entry[1]
            let type_ = sess_entry[2]
            let start_time_ = sess_entry[3]
            let end_time_ = sess_entry[4]
            // appending question and answer
            $('#'+sess_id).append('<b>'+question_+'</b><hr>'+answer_+'<br><hr><br>')
            // appending time
            $('#'+sess_id+'-time').append('<b>'+start_time_+'</b><hr>'+end_time_+'<br><hr><br>') 

        })


    }

})

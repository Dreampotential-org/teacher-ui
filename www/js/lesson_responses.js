let session_responses = []
var lesson_id = getParam("lesson_id")

$(document).ready(function () {
    $("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");

    $.get(SERVER+'courses_api/lesson/response/get/'+lesson_id+'/',function(response){
        response.forEach(function(r){
            var q = r.flashcard[0].question
            var a = r.answer
            var s_id = r.user_session[0].session_id
            var type = r.flashcard[0].lesson_type
            var start_time = r.flashcard[0].usersessionevent[0].start_time
            var end_time = r.flashcard[0].usersessionevent[0].end_time
            var flash_card_id = r.flashcard[0].usersessionevent[0].flash_card
            var ip_address = r.flashcard[0].usersessionevent[0].ip_address
            var user_device = r.flashcard[0].usersessionevent[0].user_device
            
            if(!session_responses[s_id]){
                session_responses[s_id] = new Array()
            }
            session_responses[s_id].push([q, a, type, start_time, end_time, flash_card_id, ip_address, user_device ])
            $('#FlashCardResponse_Loader').remove();
        })

        console.log(session_responses,"session response...............")
        for (key in session_responses){
            let sess_id = key
            let sess_data = session_responses[key]
            $("#FlashCardRespons_data").append(`<tr>
                                            <td>"${sess_id}"</td>
                                            <td id="${sess_id}-FlashCard"></td>
                                            <td id="${sess_id}-response"></td>
                                            <td id="${sess_id}-time"></td>
                                        </tr>`)

            sess_data.forEach(sess_entry => {
                let question_ = sess_entry[0]
                let answer_ = sess_entry[1]
                let type_ = sess_entry[2]
                let start_time_ = sess_entry[3]
                let end_time_ = sess_entry[4]
                let flash_card_id_ = sess_entry[5]

                // flashcard_id display
                $('#'+sess_id +'-FlashCard').append('<br><b>'+flash_card_id_+'</b><hr>'+type_+'<br><br><hr>')

                // appending question and answer (response column)
                $('#'+sess_id +'-response').append('<br><b>'+question_+'</b><hr>'+answer_+'<br><br><hr>')

                // appending time ( time column )
                $('#'+sess_id+'-time').append('<b>'+start_time_+'</b><hr>'+end_time_+'<br><hr>')                 
            })

            // $("#FlashCardResponse_Table").DataTable();
        

        // user session details getting and diaplaying
        // $.get(SERVER+'courses_api/user/response/get/'+sess_id+'/',function(response){
        //     console.log(response, "second responses......")
        //     console.log("🚀 ~ file: lesson_responses.js ~ line 82 ~ $.get ~ response", typeof(response))
        //     // var table = $('#table').DataTable({
        //     //     data : response,
        //     //     columns:[{data: 'name'},
        //     //         {data: "email"},
        //     //         {data: "phone"}]
        //     // });
        //     })
        }
    })
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

//send the user token
var userToken = localStorage.getItem("user-token");
var lesson_id = getParam("lesson_id")
// $.post(SERVER+'courses_api/user/response/get/'+lesson_id+'/',userToken, function(auth) {
//     console.log("Logged in, auth token: ",auth.token);
// })




    


// var sessionId = localStorage.getItem('session_id');
console.log("🚀 ~ file: lesson_responses.js ~ line 81 ~ sessionId", sessionId)

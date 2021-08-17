function init() {

    var lesson_id = getParam("lesson_id")
    get_lesson_results(lesson_id)

}


function get_lesson_results(lesson_id) {

    $.ajax({
        type: "GET",
        url: SERVER+'courses_api/lesson/response_v2/get/'+lesson_id+'/',
        dataType: 'json',
        async: true,
        crossDomain: true,
        crossOrigin: true,
        headers: {
            "Authorization": `${localStorage.getItem('user-token')}`
        },
        success: function (obj, textstatus) {
            var html = render_table_header(obj.flash_cards)
            html += render_results(obj.user_responses)
            $('table').html(html)
        }
    });
}


function render_table_header(flash_cards) {
    var html = '<tr>'
    for (var flash_card of flash_cards) {
        if (['question_checkboxes', 'title_input', 'email_verify', 'question_choices', 'verify_phone', 'datepicker'].includes(
                flash_card.lesson_type)) {
            html =  html + "<th>" + flash_card.question + "</td>"
        }
        if (flash_card.lesson_type == 'signature') {
            html =  html + "<th>Signature</td>"
        }
    }
    html += "</tr>"
    return html
}


function render_results(user_results) {
    var html = ''
    console.log(user_results)
    for(var user_result of user_results) {
        html += "<tr>"
        for (var flash_card of user_result) {
                console.log(flash_card)
                if (flash_card.length) {
                    console.log(flash_card[0].answer)
                    if (flash_card[0].answer.includes("data:image/png;base64")) {
                        html = html +"<td><img src='" + flash_card[0].answer + "'/></td>"

                    } else {
                        html = html +"<td>" + flash_card[0].answer + "</td>"
                    }
                } else {
                    console.log("enmpy")
            }
        }
        html += "</tr>"
    }
    console.log(html)
    return html
}


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

window.addEventListener('DOMContentLoaded', init, false);

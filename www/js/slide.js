var answer = ""
var signature = ""
var current_slide = 0;
var total_slides = 0;
var loaded_flashcards = null;
var pct = 0
var completed = false
var signature = [];
var phone_verification_status =false;
function updateProgressBar() {
    pct = (current_slide / total_slides) * 100
    $('.progress-bar').css("width", pct + "%")
    $('.progress-bar').attr("aria-valuenow", pct)
    $("#progress").html(current_slide + " out of " + total_slides)
}

function updateSign(data_,event,imgId,signInput){
    console.log("yo")
    $('#' + signInput).val(data_);
    console.log("updating sign :"+imgId)
    console.log("with: "+ data_)
    $('#' + imgId).attr("src", data_);
    console.log("yo"+data_+$('#' + imgId).attr("src"))
    $('#' + imgId).removeAttr('hidden');

    if(event){
        event.target.innerHTML = 'Redraw Signature';
    }
}

function signLesson(event, imgId, signInput) {
    if ($('#signature')) {
        $('#signature').modal('show');
    }
    
    document.addEventListener('signatureSubmitted', function (e) {
        updateSign(window.currentSignature.data,event,imgId,signInput);
    });
}

function nextSlide(){
    if(current_slide <total_slides){
        current_slide++
        completed = false;
    } else {
        completed = true;
        swal({	
            title: "Submitted",	
            text: "You have successfully completed the lesson. Thank you.",	
            icon: "success",
            timer: 2000
        })
    }
    
    updateProgressBar()
    
    if(!completed){
    var type = $("div.active").children().children().attr("alt");
    console.log(type)
    if (type == "question_choices") {
        answer = $("input[name= choices_" + (current_slide - 1) + "]:checked").val()
        console.log(answer)
    }else if (type == "question_checkboxes") {
        answer = $("input[name= checkboxes_" + (current_slide - 1) + "]:checked").val()
        console.log(answer)
    }else if(type == "title_textarea"){
        answer = $("textarea[name= textarea_"+(current_slide-1)+"]").val()
    }else if(type == "title_input"){
        answer = $("input[name= title_input_"+(current_slide-1)+"]").val()
        console.log("title inpt")
    }else if(type=='signature'){
        console.log("This is signature")
        answer = $("input[name= input_signature_"+(current_slide-1)+"]").val()
    }
    

    $('#myCarousel').carousel('next');
    var current_flashcard = loaded_flashcards[current_slide-1]
    current_flashcard = current_flashcard.id?current_flashcard:loaded_flashcards[current_slide-2]
    var flashcard_id = current_flashcard.id;
    var sessionId = localStorage.getItem("session_id");
    var ip_address = "172.0.0.1";
    var user_device = "self device"
    da_ = {
        "session_id": localStorage.getItem("session_id"),
        "ip_address": ip_address,
        "user_device": user_device
    }


    const param = new URL(window.location.href)
    const params = param.searchParams.get('params')

    if (params){

        var data_ = {
            "flashcard":flashcard_id,
            "session_id":localStorage.getItem("session_id"),
            "answer":answer?answer:"",
            "params" : params
        }
    }else{
        var data_ = {
            "flashcard":flashcard_id,
            "session_id":localStorage.getItem("session_id"),
            "answer":answer?answer:"",
        }
    }


    console.log(data_)

    $.ajax({
        "url": SERVER +"courses_api/flashcard/response/",
        'data': JSON.stringify(data_),
        'type': 'POST',
        'contentType': 'application/json',
        'success': function (data){
            $.ajax({
                "url": SERVER + 'courses_api/session/event/' + flashcard_id + '/' + sessionId + '/',
                "data": JSON.stringify(da_),
                "type": 'POST',
                "contentType": 'application/json',
                "success": function (da_) {
                    console.log("Session event duration")
        
                }
            })
            alert("FlashCard Response Sent")
        },
        'error': function(res){
            // alert(JSON.stringify(res))
        }
    })   

}
}

function prevSlide() {
    if (current_slide > 0) {
        current_slide--;
    }
    updateProgressBar()
    console.log(current_slide)
    $('#myCarousel').carousel('prev');
}

function getParam(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var p = 0; p < sURLVariables.length; p++){
        var sParameterName = sURLVariables[p].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function get_session() {
    var session_id = localStorage.getItem("session_id")
    if (session_id) {
        console.log("Already have session_id " + session_id)
        return session_id
    }
    console.log("Generate new session")
    $.get(SERVER + 'courses_api/session/get', function (resp) {
        console.log(resp)
        localStorage.setItem("session_id", resp.session_id)
    })
}

function init() {
    $('#sign-modal').load("signature/index.html");
    $("#verify-phone-modal").load('phone/index.html');

    $("#progress-section").hide();
    var lesson_id = getParam("lesson_id");

    $.get(SERVER + 'courses_api/lesson/read/' + lesson_id,
          function (response) {

        get_session();
        //let sign_flashcard = {lesson_type: 'input_signature'}
        //response.flashcards.push(sign_flashcard)
        total_slides = response.flashcards.length;
        $("#progress-section").show();

        $("#progress").html(current_slide+ " out of "+ total_slides)
        var flashcards = response.flashcards;
        //console.log(flashcards)
        // XXX make api DO THIS
        flashcards.sort(function(a, b){
            keyA = a.position;
            keyB = b.position;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })
        loaded_flashcards = flashcards;
        var i = 0;
        var className = "item";
        // XXX refactor code below into smaller processing chunk
        flashcards.forEach((flashcard) => {
            if (i == 0) {
                className = "item active"
            } else {
                className = "item"
            }
            document.getElementById("lesson_title").innerHTML = (flashcard.lesson_type)
            $("#carousel-indicators").append(
                '<li data-target="#myCarousel" data-slide-to="'+i+'" class="active"></li>')
            if(flashcard.lesson_type == "quick_read"){
                $("#prevButton").attr("data-type","quick_read");
                $("#nextButton").attr("data-type","quick_read");

                $("#theSlide").append('<div class="'+className+'"><div alt="quick_read" style="height:500px"><h1>'+flashcard.question+'</h1></div></div>')
            }
            if(flashcard.lesson_type == "title_text") {
                $("#prevButton").attr("data-type","title_text");
                $("#nextButton").attr("data-type","title_text");
                $("#theSlide").append('<div class="'+className+'"><div alt="title_text" style="height:500px"><h1> '+flashcard.question+'</h1><h3>'+flashcard.answer+'</h3></div></div>')
            }
            if(flashcard.lesson_type == "question_choices"){
                $("#prevButton").attr("data-type","question_choices");
                $("#nextButton").attr("data-type","question_choices");
                $("#theSlide").append('<div class="'+className+'" id="flashcard_'+i+'"><div class="question_choices"><h1>'+flashcard.question+'</h1><ul alt="question_choices_'+i+'"></ul></div></div>')
                if(flashcard.image){
                    $("#flashcard_"+i).prepend('<center><img src="'+flashcard.image+'" alt="Chania" style="height:300px;border:5px;border-style:solid;border-color:black"></center>')
                }
                if (typeof(flashcard.options)=='string'){
                    flashcard.options = flashcard.options.split(',');
                }
                flashcard.options.forEach(function (valu) {
                $("#theSlide").find("ul").each((a,b,c) => {
                        if($(b).attr("alt") == "question_choices_"+i){
                            $(b).append("<input type='radio' value='"+valu+"' name='choices_"+i+"'> "+valu+"<br>")

                        }
                        
                });
                    if($("#theSlide").find('ul').attr("alt") === "question_choices_"+i){

                    }
                })
            }

            if(flashcard.lesson_type == "question_checkboxes"){
                $("#prevButton").attr("data-type","question_checkboxes");
                $("#nextButton").attr("data-type","question_checkboxes");
                $("#theSlide").append('<div class="'+className+'" id="flashcard_'+i+'"><div class="question_checkboxes"><h1>'+flashcard.question+'</h1><ul alt="question_checkboxes_'+i+'"></ul></div></div>')
                if(flashcard.image){
                    $("#flashcard_"+i).prepend('<center><img src="'+flashcard.image+'" alt="Chania" style="height:300px;border:5px;border-style:solid;border-color:black"></center>')
                }

                flashcard.options.forEach(function (valu) {
                $("#theSlide").find("ul").each((a,b,c) => {
                        if($(b).attr("alt") == "question_checkboxes_"+i){
                            $(b).append("<input type='checkbox' value='"+valu+"' name='checkboxes_"+i+"'> "+valu+"<br>")

                        }
                        
                });
                    if($("#theSlide").find('ul').attr("alt") === "question_checkboxes_"+i){

                    }
                })
            }

            if(flashcard.lesson_type == "iframe_link"){
                $("#theSlide").append('<div class="'+className+'"><div alt="iframe_link" class="iframe_div"><h1> '+flashcard.question+'</h1><iframe  class="iframe_screen" src= "'+flashcard.image+'"></iframe></div></div>')
            }
            if(flashcard.lesson_type == "video_file"){
                $("#theSlide").append('<div class="'+className+'"><div alt="title_text" style="height:500px"><h1> '+flashcard.question+'</h1><video style="height:500px;width:1000px"; controls> <source src= "'+flashcard.image+'"></video></div></div>')
            }

            if(flashcard.lesson_type == "image_file"){
                $("#theSlide").append('<div class="'+className+'"><div alt="title_text" style="height:500px"><h1> '+flashcard.question+'</h1><img src= "'+flashcard.image+'"></div></div>')
            }

            if(flashcard.lesson_type == "title_textarea"){
                $("#theSlide").append('<div class="'+className+'"><div class="title_textarea"><div alt="title_text" style="height:500px"><h1> '+flashcard.question+'</h1><textarea name ="textarea_'+i+'" class="form-control" placeholder="Enter you answer here"></textarea></div></div></div>')
            }
            if(flashcard.lesson_type == "title_input"){
                $("#theSlide").append('<div class="'+className+'"><div class="title_input"><div alt="title_input" style="height:500px"><h1> '+flashcard.question+'</h1><input name ="title_input_'+i+'" class="form-control" placeholder="Enter you answer here"></div></div></div>')
            }
            if(flashcard.lesson_type == "signature") {
                $("#theSlide").append(`
                <div class="${className}" id="flashcard_${i}">
                <div alt="signature">
                <input type="text" hidden name="input_signature_${i}" id="signInput">
                <button class="btn btn-primary" type="button" onclick="signLesson(event,'slide_signature', 'signInput')"> Click To Sign</button>
                <img id="slide_signature" hidden >
                </div>
                </div>`)
            }
            if(flashcard.lesson_type =="verify_phone"){
                console.log("adding verify phone")

                $("#theSlide").append(`
                    <duv class="${className}" id="flascard_${i}" id="verify_phone">
                        <div alt="verify_phone">
                            <input type="text" hidden name="verify_phone_${i}" id="verifyPhone">
                            <button class="btn btn-primary" type="button" onclick="verifyPhone(event)"> Click To Verify Phone Number</button>
                            <p id="phone_verification_status">${phone_verification_status? "verified" : "not verified"}</p>
                            </div>
                    </div>
                `);
            }

            i++;
        })


        $("#theSlide").append('<div class="item"><div alt="quick_read" style="height:500px"><h1>Completed <img height="30px" src="https://www.clipartmax.com/png/full/301-3011315_icon-check-green-tick-transparent-background.png"></h1></div></div>')
        $.get(SERVER+'courses_api/lesson/response/get/'+lesson_id+'/'+localStorage.getItem("session_id"),function(response) {
            response.forEach(function(rf){
                loaded_flashcards.forEach(function(f,i){
                    if(rf.flashcard[0].id == f.id){
                        console.log(rf.answer)
                        if(f.lesson_type == 'title_textarea'){
                            $("textarea[name=textarea_"+i).val(rf.answer)
                        }
                        if(f.lesson_type == 'title_input'){
                            $("input[name=title_input_"+i).val(rf.answer)
                        }
                        if (f.lesson_type == 'question_choices') {
                            $("input[name=choices_" + i + "][value=" + rf.answer + "]").attr("checked", true)
                        }

                        if (f.lesson_type == 'question_checkboxes') {
                            $("input[name=checkboxes_" + i + "][value=" + rf.answer + "]").attr("checked", true)
                        }

                    }
                    $("input[name=input_signature_"+i+"]").val(rf.answer)
                    $("#slide_signature").attr("src",rf.answer)
                    if(rf.answer){
                        $("#slide_signature").attr("hidden",false)
                        $('.input_signature').children('button')[0].innerText = 'Redraw Signature'
                    }
                })
            })
        })
    }).done((res) => console.log("Invitaion res",res)).fail((err) => console.log("Invitation err",err))
}


function verifyPhone(event){
    if ($('#verify_phone')) {
        $('#verify_phone').modal('show');
    }
    
    document.addEventListener('phoneVerified', function (e) {
        $('#verify_phone').modal('hide');
        phone_verification_status = true 
    });
}

window.addEventListener('DOMContentLoaded', init, false)

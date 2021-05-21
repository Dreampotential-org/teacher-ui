var passwordResetToken = getParam("token");
var userToken = localStorage.getItem("user-token");
console.log("MODE: PASSWORD_RESET, Token - " + passwordResetToken);

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

$(document).ready(async function () {
$("#left-sidebar").load("sidebar.html");

$("#tabDiv").show();
$("#systemUserDetail").hide();
// message
$("#page-header").load("header.html", function() {

// chat messages
$(document).on("click", "#msg_send_btn", function () {
    console.log("farrukh disbaled elements");
    var msg_form = new FormData();
    msg_form.append("conversation_id",$("#conversation_Id").val())
    msg_form.append("user_id",$("#user_Id").val())
    msg_form.append("recipient_id",$("#receiver_Id").val())
    msg_form.append("messageText",$("#chatMsg").val())
    msg_form.append("messageItemIdStatus",false)
    // var settings = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": SERVER + 'store/sendMessage',
    //     "method": "POST",
    //     "type": "POST",
    //     "processData": false,
    //     "contentType": false,
    //     // "mimeType": "multipart/form-data",
    //     "data": msg_form,
    //     "headers": {
    //         "Authorization": localStorage.getItem("user-token")
    //     }
    // };

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": SERVER + 'store/sendMessage',
        "method": "POST",
        "type": "POST",
        "processData": false,
        "contentType": false,
        // "mimeType": "multipart/form-data",
        "data": msg_form,
        "headers": {
            "Authorization": localStorage.getItem("user-token")
        },
        success: function(response) {
            var temp_chat_msg = $("#chatMsg").val();
            var temp_profileImg = $("#profileImg").val();
            $("#chatMsg").val("");
            if(response.success == true) 
            {
                // getAllMessages($("#conversation_Id").val(),$("#user_Id").val(),$("#receiver_Id").val());
                $("#msg_history").append(`
                    <div class="outgoing_msg">
                    <div class="outgoing_msg_img"> <img src='${temp_profileImg}' alt="img"> </div>
                        <div class="sent_msg">
                        <p>${temp_chat_msg}</p>
                        <span class="time_date"> ${new Date().toLocaleString()}</span> </div>
                    </div>
                `);
                
                var objDiv = document.getElementById("msg_history");
                objDiv.scrollTop = objDiv.scrollHeight;

            }
        },
        error: function (response) {
            console.log("Send Messages is Failed! try again",response);
            swal({
                title: "Error!",
                text: "there is some error!",
                icon: "warning",
            });
        }
    });

    // $.ajax(settings).done(function (response) {
    //     var temp_chat_msg = $("#chatMsg").val();
    //     var temp_profileImg = $("#profileImg").val();
    //     $("#chatMsg").val("");
    //     if(response.success == true) 
    //     {
    //         // getAllMessages($("#conversation_Id").val(),$("#user_Id").val(),$("#receiver_Id").val());
    //         $("#msg_history").append(`
    //             <div class="outgoing_msg">
    //             <div class="outgoing_msg_img"> <img src='${temp_profileImg}' alt="img"> </div>
    //                 <div class="sent_msg">
    //                 <p>${temp_chat_msg}</p>
    //                 <span class="time_date"> ${new Date().toLocaleString()}</span> </div>
    //             </div>
    //         `);
            
    //         var objDiv = document.getElementById("msg_history");
    //         objDiv.scrollTop = objDiv.scrollHeight;

    //     }
        
    // }).fail(function (response) {
    //     console.log("Send Messages is Failed! try again",response);
    //     swal({
    //         title: "Error!",
    //         text: "there is some error!",
    //         icon: "warning",
    //     });
    // });
    
});
messageOnPageStatus = true;
});

});

////////
function setMessages(){
// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": SERVER + 'store/getMessages',
//     "method": "GET",
//     "type": "GET",
//     "processData": false,
//     "contentType": false,
//     // "mimeType": "multipart/form-data",
//     // "data": form,
//     "headers": {
//         "Authorization": localStorage.getItem("user-token")
//     }
//   };
  console.log("messages1111111111111");
  $.ajax({
    "async": true,
    "crossDomain": true,
    "url": SERVER + 'store/getMessages',
    "method": "GET",
    "type": "GET",
    "processData": false,
    "contentType": false,
    // "mimeType": "multipart/form-data",
    // "data": form,
    "headers": {
        "Authorization": localStorage.getItem("user-token")
    },
    success: function(response) {
        $("#inbox_chat").empty();
        // response = JSON.parse(response);
        console.log("messages1111111111111");
        // alert("fcm token store pass11111");
        for(var i = 0; i < response['data'].length; i++){
            $("#inbox_chat").append(`
            <div id='${response['data'][i].conversation_id}' onclick="getAllMessages('${response['data'][i].conversation_id}','${response['data'][i].user_id}','${response['data'][i].participant_id}')" 
            class="chat_list">
                <div class="chat_people">
                <div class="chat_img"> <img src=${response['data'][i].img_url} alt="profileImg"> </div>
                <div class="chat_ib">
                    <h5>${response['data'][i].participant}<span class="chat_date">
                    ${new Date(response['data'][i].sent_at).toLocaleString()}
                    </span></h5>
                    <p>${response['data'][i].message_text}</p>
                </div>
                </div>
            </div>
            `);
            console.log(response['data'][i].conversation_id);
            // if(i == 0){
            //     $( '#'+response['data'][i].conversation_id+'' ).addClass( "active_chat" );
            //     currentMsgconversation = response['data'][i].conversation_id;
            //     console.log("currentMsgconversation",currentMsgconversation);
            //     getAllMessages(response['data'][i].conversation_id,response['data'][i].user_id,response['data'][i].participant_id);
            // }
        }
    },
    error: function (response) {
        console.log("get user messages is Failed!");
        swal({
            title: "Error!",
            text: "there is some error!",
            icon: "warning",
        });
    }
  });
//   $.ajax(settings).done(function (response) {
//     $("#inbox_chat").empty();
//     // response = JSON.parse(response);
//     console.log("messages1111111111111");
//     // alert("fcm token store pass11111");
//     for(var i = 0; i < response['data'].length; i++){
//         $("#inbox_chat").append(`
//         <div id='${response['data'][i].conversation_id}' onclick="getAllMessages('${response['data'][i].conversation_id}','${response['data'][i].user_id}','${response['data'][i].participant_id}')" 
//         class="chat_list">
//             <div class="chat_people">
//             <div class="chat_img"> <img src=${response['data'][i].img_url} alt="profileImg"> </div>
//             <div class="chat_ib">
//                 <h5>${response['data'][i].participant}<span class="chat_date">
//                 ${new Date(response['data'][i].sent_at).toLocaleString()}
//                 </span></h5>
//                 <p>${response['data'][i].message_text}</p>
//             </div>
//             </div>
//         </div>
//         `);
//         console.log(response['data'][i].conversation_id);
//         // if(i == 0){
//         //     $( '#'+response['data'][i].conversation_id+'' ).addClass( "active_chat" );
//         //     currentMsgconversation = response['data'][i].conversation_id;
//         //     console.log("currentMsgconversation",currentMsgconversation);
//         //     getAllMessages(response['data'][i].conversation_id,response['data'][i].user_id,response['data'][i].participant_id);
//         // }
//     }
//   }).fail(function (response) {
//     console.log("get user messages is Failed!");
//     swal({
//         title: "Error!",
//         text: "there is some error!",
//         icon: "warning",
//     });
//   });

}

function getAllMessages(conversation_id,user_id,recipient_id){

    console.log("getAllMessages",conversation_id,user_id,recipient_id);
    currentMsgconversation = conversation_id;
    $("#inbox_chat>div.active_chat").removeClass("active_chat");
    $( '#'+conversation_id+'' ).addClass( "active_chat" );
    console.log("currentMsgconversation",currentMsgconversation);
    var msg_form = new FormData();
    msg_form.append("conversation_id",conversation_id)
    msg_form.append("user_id",user_id)
    msg_form.append("recipient_id",recipient_id)
    // var settings = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": SERVER + 'store/getAllMessages',
    //     "method": "POST",
    //     "type": "POST",
    //     "processData": false,
    //     "contentType": false,
    //     // "mimeType": "multipart/form-data",
    //     "data": msg_form,
    //     "headers": {
    //         "Authorization": localStorage.getItem("user-token")
    //     }
    // };
    console.log("before");
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": SERVER + 'store/getAllMessages',
        "method": "POST",
        "type": "POST",
        "processData": false,
        "contentType": false,
        // "mimeType": "multipart/form-data",
        "data": msg_form,
        "headers": {
            "Authorization": localStorage.getItem("user-token")
        },
        success: function(response) {
            console.log(response);
            console.log(response['data'].length);
            $('#msg_send_btn').attr('disabled', false);
            $("#msg_history").empty();
            $("#receiver_Id").val(recipient_id);
            $("#user_Id").val(user_id);
            $("#conversation_Id").val(conversation_id);
            $("#profileImg").val(response['userProfileImg']);
            // profileImg
            for(var i = 0; i < response['data'].length; i++){
                console.log(response.user_id);
                if(response['data'][i].images){
                    if(response['data'][i].sender_id == response.user_id){
                        $("#msg_history").append(`
                        <div class="outgoing_msg">
                        <div class="outgoing_msg_img"> <img src='${response['userProfileImg']}' alt="img"> </div>
                            <div class="sent_msg">
                            <img class="item_msg_img" src='${response['data'][i].images}' alt="ItemImg">
                            <p>${response['data'][i].message_text}</p>
                            <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
                        </div>
                        `);
                    }
                    else{
                        $("#msg_history").append(`
                        <div class="incoming_msg">
                            <div class="incoming_msg_img"> <img src='${response['particientProfileImg']}' alt="img"> </div>
                            <div class="received_msg">
                            <div class="received_withd_msg">
                                <img class="item_msg_img" src='${response['data'][i].images}' alt="ItemImg">
                                <p>${response['data'][i].message_text}</p>
                                <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
                            </div>
                        </div>
                        `);
                    }
                }
                else{
                    if(response['data'][i].sender_id == response.user_id){
                        $("#msg_history").append(`
                        <div class="outgoing_msg">
                        <div class="outgoing_msg_img"> <img src='${response['userProfileImg']}' alt="img"> </div>
                            <div class="sent_msg">
                            <p>${response['data'][i].message_text}</p>
                            <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
                        </div>
                        `);
                    }
                    else{
                        $("#msg_history").append(`
                        <div class="incoming_msg">
                            <div class="incoming_msg_img"> <img src='${response['particientProfileImg']}' alt="img"> </div>
                            <div class="received_msg">
                            <div class="received_withd_msg">
                                <p>${response['data'][i].message_text}</p>
                                <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
                            </div>
                        </div>
                        `);
                    }
                }
            }

            var objDiv = document.getElementById("msg_history");
            objDiv.scrollTop = objDiv.scrollHeight;
            setMessages()
        },
        error: function (response) {
            console.log("get user messages is Failed! try again");
            swal({
                title: "Error!",
                text: "there is some error!",
                icon: "warning",
            });
        }
    });
    // $.ajax(settings).done(function (response) {
    //     console.log(response);
    //     console.log(response['data'].length);
    //     $('#msg_send_btn').attr('disabled', false);
    //     $("#msg_history").empty();
    //     $("#receiver_Id").val(recipient_id);
    //     $("#user_Id").val(user_id);
    //     $("#conversation_Id").val(conversation_id);
    //     $("#profileImg").val(response['userProfileImg']);
    //     // profileImg
    //     for(var i = 0; i < response['data'].length; i++){
    //         console.log(response.user_id);
    //         if(response['data'][i].images){
    //             if(response['data'][i].sender_id == response.user_id){
    //                 $("#msg_history").append(`
    //                 <div class="outgoing_msg">
    //                 <div class="outgoing_msg_img"> <img src='${response['userProfileImg']}' alt="img"> </div>
    //                     <div class="sent_msg">
    //                     <img class="item_msg_img" src='${response['data'][i].images}' alt="ItemImg">
    //                     <p>${response['data'][i].message_text}</p>
    //                     <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
    //                 </div>
    //                 `);
    //             }
    //             else{
    //                 $("#msg_history").append(`
    //                 <div class="incoming_msg">
    //                     <div class="incoming_msg_img"> <img src='${response['particientProfileImg']}' alt="img"> </div>
    //                     <div class="received_msg">
    //                     <div class="received_withd_msg">
    //                         <img class="item_msg_img" src='${response['data'][i].images}' alt="ItemImg">
    //                         <p>${response['data'][i].message_text}</p>
    //                         <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
    //                     </div>
    //                 </div>
    //                 `);
    //             }
    //         }
    //         else{
    //             if(response['data'][i].sender_id == response.user_id){
    //                 $("#msg_history").append(`
    //                 <div class="outgoing_msg">
    //                 <div class="outgoing_msg_img"> <img src='${response['userProfileImg']}' alt="img"> </div>
    //                     <div class="sent_msg">
    //                     <p>${response['data'][i].message_text}</p>
    //                     <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
    //                 </div>
    //                 `);
    //             }
    //             else{
    //                 $("#msg_history").append(`
    //                 <div class="incoming_msg">
    //                     <div class="incoming_msg_img"> <img src='${response['particientProfileImg']}' alt="img"> </div>
    //                     <div class="received_msg">
    //                     <div class="received_withd_msg">
    //                         <p>${response['data'][i].message_text}</p>
    //                         <span class="time_date"> ${new Date(response['data'][i].sent_at).toLocaleString()}</span> </div>
    //                     </div>
    //                 </div>
    //                 `);
    //             }
    //         }
    //     }

    //     var objDiv = document.getElementById("msg_history");
    //     objDiv.scrollTop = objDiv.scrollHeight;
    //     setMessages()
    // }).fail(function (response) {
    //     console.log("get user messages is Failed! try again");
    //     swal({
    //         title: "Error!",
    //         text: "there is some error!",
    //         icon: "warning",
    //     });

    // });
    

}

$("#body-row .collapse").collapse("hide");

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



}



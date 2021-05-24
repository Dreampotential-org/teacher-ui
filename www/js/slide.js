var answer = '';
var signature = '';
var current_slide = 0;
var total_slides = 0;
var loaded_flashcards = null;
var pct = 0;
var completed = false;
var signature = [];
var phone_verification_status = false;
var session_id = null;

var imported = document.createElement('script');
imported.src = 'js/gps.js';
document.head.appendChild(imported);

var imported = document.createElement('script');
imported.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCEYIL86ek3icvHx6F-55qSFCfhe2fynfg';
document.head.appendChild(imported);

function updateProgressBar() {
  pct = (current_slide / total_slides) * 100;
  $('.progress-bar').css('width', pct + '%');
  $('.progress-bar').attr('aria-valuenow', pct);
  $('#progress').html(current_slide + ' out of ' + total_slides);
}

function updateSign(data_, event, imgId, signInput) {
  console.log('yo');
  $('#' + signInput).val(data_);
  console.log('updating sign :' + imgId);
  console.log('with: ' + data_);
  $('#' + imgId).attr('src', data_);
  console.log('yo' + data_ + $('#' + imgId).attr('src'));
  $('#' + imgId).removeAttr('hidden');

  if (event) {
    event.target.innerHTML = 'Redraw Signature';
  }
}

function signLesson(event, imgId, signInput) {
  if ($('#signature')) {
    $('#signature').modal('show');
  }

  document.addEventListener('signatureSubmitted', function (e) {
    updateSign(window.currentSignature.data, event, imgId, signInput);
  });
}

function sendResponse(flashcard_id, answer) {
  var current_flashcard = loaded_flashcards[current_slide - 1];
  console.log("current_flashcard.lesson_type => ", current_flashcard.lesson_type);
  var sessionId = localStorage.getItem('session_id');
  var ip_address = '172.0.0.1';
  var user_device = 'self device';
  da_ = {
    session_id: localStorage.getItem('session_id'),
    ip_address: ip_address,
    user_device: user_device,
  };

  const param = new URL(window.location.href);
  const params = param.searchParams.get('params');

  if (params) {
    var data_ = {
      flashcard: flashcard_id,
      session_id: localStorage.getItem('session_id'),
      answer: answer ? answer : '',
      params: params,
    };
  } else {
    if (current_flashcard.lesson_type == 'user_gps') {
      var data_ = {
        flashcard: flashcard_id,
        session_id: localStorage.getItem('session_id'),
        answer: answer ? answer : '',
        latitude: CURRENT_POSITION != null ? CURRENT_POSITION.coords.latitude : '',
        longitude: CURRENT_POSITION != null ? CURRENT_POSITION.coords.longitude : '',
      };
    }
    else {
      var data_ = {
        flashcard: flashcard_id,
        session_id: localStorage.getItem('session_id'),
        answer: answer ? answer : '',
      };
    }

  }

  console.log(data_);
  $.ajax({
    url: SERVER + 'courses_api/flashcard/response',
    data: JSON.stringify(data_),
    type: 'POST',
    contentType: 'application/json',
    success: function (data) {
      $.ajax({
        // url: 'http://localhost:8000/courses_api/session/event/'+ flashcard_id + '/' + sessionId,
        url: SERVER + 'courses_api/session/event/' + flashcard_id + '/' + sessionId,
        data: JSON.stringify(da_),
        type: 'POST',
        contentType: 'application/json',
        success: function (da_) {
          console.log('Session event duration');
        },
        fail: function (res) {
          alert(res)
        },
      });
      //alert('FlashCard Response Sent');
    },
    error: function (res) {
      // alert(JSON.stringify(res))
    },
  });
}

function updateMeta(type, answer) {
  if (type == 'name') {
    swal({ title: 'setting up name to ' + answer });
  }
}

function nextSlide() {
  var lesson_id = getParam('lesson_id');
  console.log(current_slide);
  if (current_slide < total_slides) {
    current_slide++;
    completed = false;
    if (current_slide == total_slides) {
      $('#nextButton').html('Submit');
    }
  }
  else {
    completed = true;
    $(document).ready(function () {
      $.ajax({
        url: SERVER + "courses_api/lesson/student/get/mail/" + lesson_id,
        async: true,
        crossDomain: true,
        crossOrigin: true,
        type: 'GET',
        headers: { "Authorization": `${localStorage.getItem('user-token')}` }
      }).done((response) => {
        console.log("🚀 ~ file: settings.html ~ line 202 ~ response", response)
      }).fail((err) => {
        // console.log("errorss...",err)
        console.log("🚀 ~ file: settings.html ~ line 129 ~ errorss", err)
      })
    });
    swal({
      title: 'Submitted',
      text: 'You have successfully completed the lesson. Thank you.',
      icon: 'success',
      timer: 2000,
    });
  }

  var current_flashcard = loaded_flashcards[current_slide - 1];
  current_flashcard = current_flashcard.id ? current_flashcard : loaded_flashcards[current_slide - 2];
  var flashcard_id = current_flashcard.id;

  updateProgressBar();

  if (!completed) {
    var type = current_flashcard.lesson_type;
    console.log("SLIDE JS TYPE ===> ", type);

    if (type == 'question_choices') {
      answer = $('input[name= choices_' + (current_slide - 1) + ']:checked').val();
      console.log(answer);
      sendResponse(flashcard_id, answer);
    } else if (type == 'question_checkboxes') {
      let answer = [];
      $('input[name= checkboxes_' + (current_slide - 1) + ']:checked').each((j, k) => {
        answer.push(k.value);
      });
      console.log(answer.join(','));
      sendResponse(flashcard_id, answer.join(','));
    } else if (type == 'title_textarea') {
      answer = $('textarea[name= textarea_' + (current_slide - 1) + ']').val();
      sendResponse(flashcard_id, answer);
    } else if (type == 'title_input') {
      answer = $('input[name= title_input_' + (current_slide - 1) + ']').val();
      console.log('title inpt');
      sendResponse(flashcard_id, answer);
    } else if (type == 'signature') {
      answer = $('input[name= input_signature_' + (current_slide - 1) + ']').val();
      sendResponse(flashcard_id, answer);
    } else if (type == 'name_type') {
      answer = $('input[name= name_type_' + (current_slide - 1) + ']').val();
      sendResponse(flashcard_id, answer);
    } else if (type == 'user_video_upload') {
      answer = $('#user-video-tag').find('source').attr('src');
      sendResponse(flashcard_id, answer);
    }else if (type == 'user_image_upload') {
        answer = $(`#user-image-display_${flashcard_id}`).attr('src');
        sendResponse(flashcard_id, answer);
    } else if (type == 'user_gps') {
      answer = JSON.stringify({ lat: $('#lat_' + (current_slide - 1)).val(), lng: $('#long_' + (current_slide - 1)).val() });
      sendResponse(flashcard_id, answer);
      // console.log('flashcard_id',flashcard_id)
      document.removeEventListener('gpsPosition', () => { });
    }

    if (current_slide != total_slides && loaded_flashcards[current_slide].lesson_type == 'user_gps') {
      handle_gps_click();
      document.addEventListener('gpsPosition', d => {
        console.log('pos', CURRENT_POSITION, CURRENT_POSITION_LOW)
        let lat = CURRENT_POSITION ? CURRENT_POSITION.coords.latitude : CURRENT_POSITION_LOW.coords.latitude
        let long = CURRENT_POSITION ? CURRENT_POSITION.coords.longitude : CURRENT_POSITION_LOW.coords.longitude
        $('#lat_' + current_slide).val(lat);
        $('#long_' + current_slide).val(long);
      });
    }
    else if (type == "user_gps") {
      console.log("User-GPS slide page");
      answer = $('#note').val();
      sendResponse(flashcard_id, answer);
    }
    else if(current_slide != total_slides && loaded_flashcards[current_slide].lesson_type == 'jitsi_meet'){
      var domain = "vstream.lifeforceenergy.us";
        var options = {
          roomName: `${loaded_flashcards[current_slide].question}`,
          // width: 700,
          configOverwrite: {
            startWithAudioMuted: true, prejoinPageEnabled: false,
            startWithVideoMuted: false
          },
          height: 570,
          parentNode: document.querySelector(`#flashcard_${loaded_flashcards[current_slide].id}`),
          configOverwrite: {},
          interfaceConfigOverwrite: {}
        }
        window.api = new JitsiMeetExternalAPI(domain, options);
        console.log(api)
    }
    else if(type == 'jitsi_meet'){
      window.api.executeCommand('hangup');
      api.dispose();
    }

    $('#myCarousel').carousel('next');
  }
}

function prevSlide() {
  if (current_slide > 0) {
    current_slide--;
    $('#nextButton').html('Next');
  }
  updateProgressBar();
  console.log(current_slide);
  $('#myCarousel').carousel('prev');
}

function getParam(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var p = 0; p < sURLVariables.length; p++) {
    var sParameterName = sURLVariables[p].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}
function phone_verification_check() {
  session_id = localStorage.getItem('session_id');
  console.log('phone verification check running');
  var data_ = {
    session_id: session_id,
  };
  console.log(SERVER + 'courses_api/verify/phone-verify');
  $.ajax({
    url: SERVER + 'courses_api/verify/phone-verify',
    data: JSON.stringify(data_),
    type: 'POST',
    async: false,
    contentType: 'application/json',
    success: function (data) {
      phone_verification_status = true;
    },
    error: function (res) {
      phone_verification_status = false;
    },
  });
}
function get_session() {
  session_id = localStorage.getItem('session_id');
  if (session_id) {
    console.log('Already have session_id ' + session_id);
    return session_id;
  }
  $.ajax({
    url: SERVER + 'courses_api/session/get',
    type: 'GET',
    async: false,
    contentType: 'application/json',
    success: function (data) {
      localStorage.setItem('session_id', data.session_id);
    },
    error: function (res) {
      phone_verification_status = false;
    },
  });

}

function verifyPhone(event) {
  if ($('#verify_phone')) {
    $('#verify_phone').modal('show');
  }

  document.addEventListener('phoneVerified', function (e) {
    $('#verify_phone').modal('hide');
    phone_verification_status = true;
  });
}

function radioOnClick(valu) {
  if (userToken) {
    if (valu == 'Video' || valu == 'video') {
      if ($('#videoModal')) {
        $('#videoModal').modal('show');
      }
    } else if (valu == 'GPS + note' || valu == 'GPS + note') {
      if ($('#gpsModal')) {
        $('#gpsModal').modal('show');
        handle_gps_click();
      }
    }
  }
  // [TO FIX REDIRECT] ignore for now
  // else{
  //     swal({
  //         title: "Error",
  //         text: "You must first login to your profile",
  //         icon: "warning",
  //       });
  //     // window.location.replace("student_login.html");
  // }
}

function init() {
  $('#sign-modal').load('signature/index.html');
  $('#verify-phone-modal').load('phone/index.html');
  $("#video-modal").load('video/index.html');
  $("#gps-modal").load('gps/index.html');
  $('#progress-section').hide();
  var lesson_id = getParam('lesson_id');

  $.get(SERVER + 'courses_api/slide/read/' + lesson_id, function (response, status, xhr) {
    get_session();
    // phone_verification_check();
    // console.log('>>>>>>>>>>>>>> slide', response);

    total_slides = response.flashcards.length;
    $('head').append(`<title>${response.lesson_name ? response.lesson_name : "Lesson - " + lesson_id}</title>`)
    // Updating Meta Attribute states
    $('#progress-section').show();

    $('#progress').html(current_slide + ' out of ' + total_slides);
    var flashcards = response.flashcards;
    console.log("🚀 ~ file: slide.js ~ line 343 ~ flashcards", flashcards)
    //console.log(flashcards)
    // XXX make api DO THIS
    flashcards.sort(function (a, b) {
      keyA = a.position;
      keyB = b.position;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    loaded_flashcards = flashcards;
    var i = 0;
    var className = 'item';
    // XXX refactor code below into smaller processing chunk

    flashcards.forEach((flashcard, index) => {
      if (i == 0) {
        className = 'item active';
      } else {
        className = 'item';
      }
      document.getElementById('lesson_title').innerHTML = flashcard.lesson_type;
      $('#carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="' + i + '" class="active"></li>');

      if (flashcard.lesson_type == 'verify_phone') {
        $('#theSlide').append(`
                    <duv class="${className} ${i == 0 ? 'active' : ''}" id="flahscard_${i}" id="verify_phone">
                        <div alt="verify_phone">
                            <input type="text" hidden name="verify_phone_${i}" id="verifyPhone">
                            <button class="btn btn-primary" type="button" onclick="verifyPhone(event)"> Click To Verify Phone Number</button>
                            <p id="phone_verification_status">${phone_verification_status ? 'verified' : 'not verified'}</p>
                            </div>
                    </div>
                `);
        i++;
      }

      if (flashcard.lesson_type == 'jitsi_meet') {
        //         $('#theSlide').append(`<div class="${className} ${i == 0 ? 'active' : ''}" id="flashcard_${i}" id="verify_email">
        //         <html itemscope itemtype="http://schema.org/Product" prefix="og: http://ogp.me/ns#" xmlns="http://www.w3.org/1999/html">
        //     <head>
        //         <meta charset="utf-8">
        //         <meta http-equiv="content-type" content="text/html;charset=utf-8">
        //     </head>
        //     <body>
        //         <script src="https://meet.jit.si/external_api.js"></script>
        //         <script>
        //             var domain = "meet.jit.si";
        //             var options = {
        //                 roomName: "JitsiMeetAPIExample",
        //                 width: 700,
        //                 height: 180,
        //                 parentNode: undefined,
        //                 configOverwrite: {},
        //                 interfaceConfigOverwrite: {}
        //             }
        //             var  api  =  new  JitsiMeetExternalAPI ( domain ,  options ) ;
        //         </script>
        //     </body>
        // </html> </div>
        //         `);
        $('#theSlide').append(`<div class="${className} ${i == 0 ? 'active' : ''}" id="flashcard_${flashcard.id}" id="verify_email">
        
        </div>`);
      }

      if (flashcard.lesson_type == 'verify_email') {
        $('#theSlide').append(`
                    <duv class="${className} ${i == 0 ? 'active' : ''}" id="flashcard_${i}" id="verify_email">
                        <h1>Email Verification Div Goes here </h1>
                    </div>
                `);
        i++;
      }

      if (flashcard.lesson_type == 'quick_read') {

        $('#prevButton').attr('data-type', 'quick_read');
        $('#nextButton').attr('data-type', 'quick_read');

        $('#theSlide').append(
          '<div class="' + className + '">' +
          '<div class="quick-read-container">' +

          '<div class="speedreader-txt" alt="quick_read"><h1 class="speedrdr-txt">' + flashcard.question + '</h1></div>' +
          '<div class="word-display text-center"><div class="txt"></div></div>' +

          '<div class="box card p-4">' +
          '<div class="form-group arrow-group d-flex justify-content-center">' +
          '<div class="timer-field field-control d-flex align-items-center">' +
          '<div class="field-arrow text-center">' +
          '<div class="monitor d-flex">' +
          '<div class="timer-length txt-num">1</div>' +
          '<div class="word-speed">min</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="wpm-field field-control d-flex align-items-center">' +
          '<div class="field-txt">WPM</div>' +
          '<div class="field-arrow text-center">' +
          '<button class="btn btn-plus btn-arrow" type="button">' +
          '<i class="fa fa-angle-up" aria-hidden="true"></i>' +
          '</button>' +
          '<div class="monitor d-flex">' +
          '<input type="text" class="word-length txt-input-num form-control">' +
          '<div class="word-speed">x1</div>' +
          '</div>' +
          '<button class="btn btn-minus btn-arrow" type="button">' +
          '<i class="fa fa-angle-down" aria-hidden="true"></i>' +
          '</button>' +
          '</div>' +
          '</div>' +
          '<div class="wordcount-field field-control d-flex align-items-center">' +
          '<div class="field-txt">Words at a time</div>' +
          '<div class="field-arrow text-center">' +
          '<button class="btn btn-plus btn-arrow" type="button">' +
          '<i class="fa fa-angle-up" aria-hidden="true"></i>' +
          '</button>' +
          '<div class="monitor text-center">' +
          '<div class="word-num txt-num">1</div>' +
          '</div>' +
          '<button class="btn btn-minus btn-arrow" type="button">' +
          '<i class="fa fa-angle-down" aria-hidden="true"></i>' +
          '</button>' +
          '</div>' +
          '</div>' +
          '</div>' +

          '<div class="form-group mb-0 text-center">' +
          '<button type="button" class="btn btn-primary start-btn disabled">START NOW</button>' +
          '</div>' +

          '<div class="form-group text-center slider-group">' +
          '<div id="slider"></div>' +
          '</div>' +

          '<div class="form-group mb-0 text-center pt-3 btm-options">' +
          '<button type="button" class="btn btn-danger stop-btn">Stop</button>' +
          '<div class="sound-btn-container d-flex align-items-center">' +
          '<button type="button" class="btn btn-secondary speak-btn">' +
          '<span class="speak"><i class="fa fa-volume-up" aria-hidden="true"></i></span>' +
          '<span class="mute"><i class="fa fa-volume-off" aria-hidden="true"></i></span>' +
          '</button>' +
          '<div class="sound-select position-relative">' +
          '<button class="btn light-btn" type="button">' +
          '<span class="icon"><i class="fa fa-microphone" aria-hidden="true"></i></span>' +
          '<span class="txt"></span>' +
          '<span class="icon arrow-icon"><i class="fa fa-caret-down" aria-hidden="true"></i></span>' +
          '</button>' +
          '<div class="drop-list voice-drop-list user-select-none">' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="timer">00:00</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>'
        );

        setTimeout(function () {
          $('head').append('<script src="js/jquery-ui.min.js"></script>');
          $('head').append('<script src="js/speed-reader.js"></script>');
        }, 1);

      }
      if (flashcard.lesson_type == 'title_text') {
        $('#prevButton').attr('data-type', 'title_text');
        $('#nextButton').attr('data-type', 'title_text');
        $('#theSlide').append(
          '<div class="' +
          className +
          '"><div alt="title_text" style="height:500px"><h1> ' +
          flashcard.question +
          '</h1><h3>' +
          flashcard.answer +
          '</h3></div></div>'
        );
      }
      if (flashcard.lesson_type == 'question_choices') {
        $('#prevButton').attr('data-type', 'question_choices');
        $('#nextButton').attr('data-type', 'question_choices');
        $('#theSlide').append(
          '<div class="' +
          className +
          '" id="flashcard_' +
          i +
          '"><div class="question_choices"><h1>' +
          flashcard.question +
          '</h1><ul alt="question_choices_' +
          i +
          '"></ul></div></div>'
        );
        if (flashcard.image) {
          $('#flashcard_' + i).prepend(
            '<center><img src="' + flashcard.image + '" alt="Chania" style="width:400px;border:5px;border-style:solid;border-color:black"></center>'
          );
        }
        if (typeof flashcard.options == 'string') {
          flashcard.options = flashcard.options.split(',');
        }
        flashcard.options.forEach(function (valu) {
          $('#theSlide')
            .find('ul')
            .each((a, b, c) => {
              if ($(b).attr('alt') == 'question_choices_' + i) {
                $(b).append(
                  "<br><input type='radio' id='" +
                  valu +
                  "' value='" +
                  valu +
                  "' onclick='radioOnClick(`" + valu + "`)' name='choices_" +
                  i +
                  "'> <label style='font-weight: normal;' for='" +
                  valu +
                  "'>" +
                  valu +
                  '</lable>'
                );
              }
            });
          if ($('#theSlide').find('ul').attr('alt') === 'question_choices_' + i) {
          }
        });
      }

      if (flashcard.lesson_type == 'question_checkboxes') {
        $('#prevButton').attr('data-type', 'question_checkboxes');
        $('#nextButton').attr('data-type', 'question_checkboxes');
        $('#theSlide').append(
          '<div class="' +
          className +
          '" id="flashcard_' +
          i +
          '"><div class="question_checkboxes"><h1>' +
          flashcard.question +
          '</h1><ul alt="question_checkboxes_' +
          i +
          '"></ul></div></div>'
        );
        if (flashcard.image) {
          $('#flashcard_' + i).prepend(
            '<center><img src="' + flashcard.image + '" alt="Chania" style="width:400px;border:5px;border-style:solid;border-color:black"></center>'
          );
        }

        flashcard.options.forEach(function (valu) {
          $('#theSlide')
            .find('ul')
            .each((a, b, c) => {
              if ($(b).attr('alt') == 'question_checkboxes_' + i) {
                $(b).append(
                  "<br><input type='checkbox' id='" +
                  valu +
                  "' value='" +
                  valu +
                  "' name='checkboxes_" +
                  i +
                  "'> <label style='font-weight: normal;' for='" +
                  valu +
                  "'>" +
                  valu +
                  '</lable>'
                );
              }
            });
          if ($('#theSlide').find('ul').attr('alt') === 'question_checkboxes_' + i) {
          }
        });
      }

      if (flashcard.lesson_type == 'iframe_link') {
        $('#theSlide').append(
          '<div class="' +
          className +
          '"><div alt="iframe_link" class="iframe_div"><h1> ' +
          flashcard.question +
          '</h1><iframe  class="iframe_screen" src= "' +
          flashcard.image +
          '"></iframe></div></div>'
        );
      }
      if (flashcard.lesson_type == 'video_file') {
        $('#theSlide').append(
          '<div class="' +
          className +
          '"><div alt="title_text" style="height:500px"><h1>Video File</h1><h1> ' +
          flashcard.question +
          '</h1>'+(flashcard.image?'<video style="height:500px;width:1000px"; controls preload="metadata"> <source src= "' +
          flashcard.image + '#t=0.5' +
          '"></video>':'<h5>No file uploaded.</h5>')+'</div></div>'
        );
      }

      if (flashcard.lesson_type == 'image_file') {
        $('#theSlide').append(
          '<div class="' +
          className +
          '"><div alt="title_text" style="height:500px"><h1>Image File</h1><h1> ' +
          flashcard.question +
          '</h1><img src= "' +
          flashcard.image +
          '" width=400px></div></div>'
        );
      }

      if (flashcard.lesson_type == 'user_gps') {
        console.log("flashcard.lesson_type == 'user_gps'");
        console.log("flashcard value ===> ", flashcard);

        $('#theSlide').append(
          `<div class="' +
          ${className} +'"><div class="title_input">
          <div alt="title_input" style="height:500px"><h1>GPS Note:</h1>
          <p> ${flashcard.question}</p>
          <div><label>Lattitude: </label>
          <input id="lat_${i}" value="0" disabled></div>
          <div style="margin-top:16px;"><label>Longitude: </label>
          <input id="long_${i}" value="0" disabled></div>
          <div class="form-group">
           <textarea class="form-control" rows="10" name="note" placeholder="note" id="note"></textarea>
           </div>
           <div class="form-group">
           <button class='btn btn-info gps-entry'>View Map</button>
           </div>
           <div id="journalModal">
           <div id='journal-body'></div>
           </div>
          </div>
          </div>
          </div>
          `
        );
        handle_gps_click();
      }

      if (flashcard.lesson_type == 'user_video_upload') {
        console.log("user_video_upload flashcard.lesson_type ===> ", flashcard.lesson_type);
        $('#theSlide').append(
          `<div class="${className}">
            <h1>User Video Upload</h1>
            <h1>${flashcard.question}</h1>
            <div alt="title_text" style="height:500px">
            <p> ${flashcard.question}</p>
            <input type="file" class="form-control" value="Choose File" id="myFile" onchange="handleVideoUpload('user_video_upload')"/> 

            <video style="height:500px;width:1000px;display:none"; controls preload="metadata" id="user-video-tag">
            </video>

            </div>
          </div>
          `
        );
      }

      if (flashcard.lesson_type == 'user_image_upload') {
        console.log("user_image_upload flashcard.lesson_type ===> ", flashcard.lesson_type);
        $('#theSlide').append(
          `<div class="${className}">
            <h1>User Image Upload</h1>
            <div alt="title_text" style="height:500px">
            <p> ${flashcard.question}</p>
            <input type="file" class="form-control" value="Choose File" id="image_upload_${flashcard.id}" onchange="handleImageUpload('user_image_upload',${flashcard.id})"/> 

            <img style="height:500px; width:auto; margin:auto; display:none;" id="user-image-display_${flashcard.id}">

            </div>
          </div>
          `
        );
      }

      if (flashcard.lesson_type == 'title_textarea') {
        $('#theSlide').append(
          '<div class="' +
          className +
          '"><div class="title_textarea"><div alt="title_text" style="height:500px"><h1> ' +
          flashcard.question +
          '</h1><textarea name ="textarea_' +
          i +
          '" class="form-control" placeholder="Enter you answer here"></textarea></div></div></div>'
        );
      }
      if (flashcard.lesson_type == 'title_input') {
        $('#theSlide').append(
          '<div class="' +
          className +
          '"><div class="title_input"><div alt="title_input" style="height:500px"><h1> ' +
          flashcard.question +
          '</h1><input name ="title_input_' +
          i +
          '" class="form-control" placeholder="Enter you answer here"></div></div></div>'
        );
      }

      if (flashcard.lesson_type == 'name_type') {
        $('#theSlide').append(
          '<div class="' +
          className +
          '"><div class="name_type"><div alt="name_type" style="height:500px"><h1> Enter your name: </h1><input name ="name_type_' +
          i +
          '" class="form-control" placeholder="Enter you name here"></div></div></div>'
        );
      }

      if (flashcard.lesson_type == 'signature') {
        $('head').append('<script src="https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js"></script>');
        $('#theSlide').append(`
                <div class="${className}" id="flashcard_${i}">
                <div class="text-center alt="signature">
                <input type="text" hidden name="input_signature_${i}" id="signInput">
                <img id="slide_signature" hidden> </br>
                <button class="btn btn-primary" type="button" onclick="signLesson(event,'slide_signature', 'signInput')"> Click To Sign</button>
                </div>
                </div>`);
      }

      i++;
    });

    $('#theSlide').append(
      '<div class="item"><div alt="quick_read" style="height:500px"><h1>Completed <img height="30px" src="https://www.clipartmax.com/png/full/301-3011315_icon-check-green-tick-transparent-background.png"></h1></div></div>'
    );
    if (session_id) {
      $.get(SERVER + 'courses_api/lesson/response/get/' + lesson_id + '/' + localStorage.getItem('session_id'), function (response) {
        // console.log(response);
        response.forEach(function (rf) {
          // console.log("🚀 ~ file: slide.js ~ line 777 ~ rf", rf)
          // console.log(rf);
          loaded_flashcards.forEach(function (f, i) {
            if (rf.flashcard[0].id == f.id) {
              if (f.lesson_type == 'title_textarea') {
                $('textarea[name=textarea_' + i).val(rf.answer);
              }
              if (f.lesson_type == 'user_video_upload') {
                if (rf.answer){
                  $("#user-video-tag").attr("src",rf.answer);
                  $("#user-video-tag")[0].load()
                }
              }
              if (f.lesson_type == 'user_image_upload') {
                if (rf.answer){
                  $(`#user-image-display_${f.id}`).attr("src",rf.answer);
                  $(`#user-image-display_${f.id}`).css("display",'block');
                }
              }
              if (f.lesson_type == 'title_input') {
                $('input[name=title_input_' + i).val(rf.answer);
              }
              if (f.lesson_type == 'question_choices') {
                  // $('#'+ rf.answer +'[name=choices_' + i + ']').attr('checked', 'checked');
                  $('input[name=choices_' + i + '][value=' + rf.answer ? rf.answer : '' + ']').attr('checked', true);
                }

              if (f.lesson_type == 'question_checkboxes') {
                rf.answer.split(',').forEach((v) => {
                  $('input[name=checkboxes_' + i + '][value=' + v + ']').attr('checked', true);
                });
              }
              if (f.lesson_type == 'signature') {
                $('input[name=input_signature_' + i + ']').val(rf.answer);
                $('#slide_signature').attr('src', rf.answer);
                if (rf.answer) {
                  $('#slide_signature').attr('hidden', false);
                  console.log($('#flashcard_' + i));
                  console.log($('#flashcard_' + i).find('button'));
                  $('#flashcard_' + i).find('button')[0].innerText = 'Update Signature';
                }
              }
              if (f.lesson_type == 'user_gps') {
                let ans = {}
                try {
                  ans = JSON.parse(rf.answer)
                } catch (e) {
                  // return false;
                }
                $('#lat_' + i).val(ans.lat);
                $('#long_' + i).val(ans.lng);
                console.log('set previos gps value');
              }
            }
          });
        });
      })
        .done((res) =>
          console.log("🚀 ~ file: slide.js ~ line 727 ~ res", res)
        )
        .fail((err) => console.log('Invitation err', err));
    }
    if (total_slides && flashcards[0].lesson_type == 'user_gps') {
      handle_gps_click();
      document.addEventListener('gpsPosition', d => {
        console.log('pos', CURRENT_POSITION, CURRENT_POSITION_LOW)
        let lat = CURRENT_POSITION ? CURRENT_POSITION.coords.latitude : CURRENT_POSITION_LOW.coords.latitude
        let long = CURRENT_POSITION ? CURRENT_POSITION.coords.longitude : CURRENT_POSITION_LOW.coords.longitude
        $('#lat_0').val(lat);
        $('#long_0').val(long);
      });
    }
  })
}
function handleVideoUpload(key) {
  var file = $('#myFile').prop('files');
  console.log("🚀 ~ file: index.html ~ line 33 ~ handleVideoUpload ~ file", file[0])
  GLOBAL_FILE = file[0];
  var form = new FormData();
  form.append('file', GLOBAL_FILE);

  var settings = {
    async: true,
    "crossDomain": true,
    url: SERVER + 's3_uploader/upload',
    method: 'POST',
    type: 'POST',
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    data: form,
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }

  console.log(settings);
  $.ajax(settings).done(function (response) {
    console.log("🚀 ~ file: index.html ~ line 57 ~ response", response)
    if (response.message == "No file provided!") {
      swal({
        title: 'File Not Select',
        text: response.message,
        icon: "warning",
        timer: 1000,
      });
    } else {
      console.log("this is else part")
      swal({
        title: 'Good job!',
        text: 'Video uploaded successfully!',
        icon: 'success',
        timer: 1000,
      });
      const file_url = response.file_url;
      displayVideo(file_url);
      function displayVideo(file_url) {
        if (file_url) {
          if (key == 'user_video_upload') {
            var strTYPE = "video/mp4";
            $('#user-video-tag').css("display","block");
            $("#user-video-tag").append('<source src="' + file_url + '#t=0.5" type="' + strTYPE + '"></source>');
            $("#user-video-tag")[0].load();
          }
          else {
            var strTYPE = "video/mp4";
            $('#myCarousel #video').val(file_url);
            $("#theSlide #flashcard_" + current_slide + "").append('<div id="video_url"><p> Video URL : ' + file_url + '</p><video id="videoplayer" style="height:500px;width:100%"; controls preload="metadata"> <source src="' + file_url + '#t=0.5' + '" type="' + strTYPE + '"></source></video></div>')

            $("#videoplayer")[0].load();
          }
        }
      }
      //   $("#video-modal").hide();
      //   setTimeout(() => { location.reload() }, 5000);
    }
  }).fail(function (error) {
    console.log("🚀 ~ file: index.html ~ line 56 ~ error", error)
    swal({
      title: 'Error!',
      text: 'Video upload failed!',
      icon: 'warning',
      timer: 1000,
    });

  });

}

function handleImageUpload(key, id) {
  var file = $(`#image_upload_${id}`).prop('files');
  console.log("🚀 ~ file: slide.js ~ line 929 ~ handleImageUpload ~ file", file[0])
  GLOBAL_FILE = file[0];
  var form = new FormData();
  form.append('file', GLOBAL_FILE);

  var settings = {
    async: true,
    "crossDomain": true,
    url: SERVER + 's3_uploader/upload',
    method: 'POST',
    type: 'POST',
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    data: form,
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }

  console.log(settings);
  $.ajax(settings).done(function (response) {
    console.log("🚀 ~ file: slide.js ~ line 951 ~ response", response)
    if (response.message == "No file provided!") {
      swal({
        title: 'File Not Select',
        text: response.message,
        icon: "warning",
        timer: 1000,
      });
    } else {
      console.log("this is else part")
      swal({
        title: 'Good job!',
        text: 'Video uploaded successfully!',
        icon: 'success',
        timer: 1000,
      });
      const file_url = response.file_url;
      displayImage(file_url);

      function displayImage(file_url) {
        if (file_url) {
          if (key == 'user_image_upload') {
            $(`#user-image-display_${id}`).css("display","block");
            $(`#user-image-display_${id}`).attr("src",file_url);
          }
        }
      }
    }
  }).fail(function (error) {
    console.log("🚀 ~ file: index.html ~ line 56 ~ error", error)
    swal({
      title: 'Error!',
      text: 'Video upload failed!',
      icon: 'warning',
      timer: 1000,
    });

  });

}

window.addEventListener('DOMContentLoaded', init, false);

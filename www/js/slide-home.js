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
    var data_ = {
      flashcard: flashcard_id,
      session_id: localStorage.getItem('session_id'),
      answer: answer ? answer : '',
    };
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
        fail:function(res){
          console.log(res)
        },
      });
      console.log('FlashCard Response Sent');
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
  console.log(current_slide);
  if (current_slide < total_slides) {
    current_slide++;
    completed = false;
  } else {
    completed = true;
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
    console.log("SLIDE JS TYPE ===> ",type);

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
    }

    $('#myCarousel').carousel('next');
  }
}

function prevSlide() {
  if (current_slide > 0) {
    current_slide--;
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
    console.log('>>>>>>>>>>>>>> slide', response);

    //let sign_flashcard = {lesson_type: 'input_signature'}
    //response.flashcards.push(sign_flashcard)
    total_slides = response.flashcards.length;
    // Updating Meta Attribute states
    $('#progress-section').show();

    $('#progress').html(current_slide + ' out of ' + total_slides);
    var flashcards = response.flashcards;
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

    flashcards.forEach((flashcard) => {
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
          '<div class="' + className + '"><div alt="quick_read"><h1>' + flashcard.question + '</h1></div></div>'
        );
      }
      if (flashcard.lesson_type == 'title_text') {
        $('#prevButton').attr('data-type', 'title_text');
        $('#nextButton').attr('data-type', 'title_text');
        $('#theSlide').append(
          '<div class="' +
            className +
            '"><div alt="title_text"><h1> ' +
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
            '<center><img src="' + flashcard.image + '" alt="Chania" style="height:300px;border:5px;border-style:solid;border-color:black"></center>'
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
            '<center><img src="' + flashcard.image + '" alt="Chania" style="height:300px;border:5px;border-style:solid;border-color:black"></center>'
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
            '"><div alt="title_text"><h1> ' +
            flashcard.question +
            '</h1><video style="height:500px;width:1000px"; controls preload="metadata"> <source src= "' +
            flashcard.image + '#t=0.5' +
            '"></video></div></div>'
        );
      }
      if (flashcard.lesson_type == 'audio_file') {
        $('#theSlide').append(
          '<div class="' +
            className +
            '"><div alt="title_text"><h1> ' +
            flashcard.question +
            '</h1><audio style="height:500px;width:1000px"; controls preload="metadata"> <source src= "' +
            flashcard.image + '#t=0.5' +
            '"></audio></div></div>'
        );
      }

      if (flashcard.lesson_type == 'image_file') {
        $('#theSlide').append(
          '<div class="' +
            className +
            '"><div alt="title_text"><h1>Image File</h1><h1> ' +
            flashcard.question +
            '</h1><img src= "' +
            flashcard.image +
            '"></div></div>'
        );
      }

      if(flashcard.lesson_type == 'user_gps'){
        console.log("flashcard.lesson_type == 'user_gps'");
        console.log("flashcard value ===> ", flashcard);
        $('#theSlide').append(
        '<div class="' +
            className +
            '"><div class="title_input"><div alt="title_input"><h1>GPS Note:</h1><h1> ' +
            flashcard.question +
            '</h1></div></div></div>'
        );
      }

      if(flashcard.lesson_type == 'user_video_upload'){
        console.log("user_video_upload flashcard.lesson_type ===> ", flashcard.lesson_type);
        $('#theSlide').append(
          '<div class="' +
            className +
            '"><h1>User Video</h1><div alt="title_text"><video style="height:500px;width:1000px"; controls preload="metadata"> <source src= "' +
            flashcard.image + '#t=0.5' +
            '"></video></div></div>'
        );
      }
      if(flashcard.lesson_type == 'user_audio_upload'){
        console.log("user_audio_upload flashcard.lesson_type ===> ", flashcard.lesson_type);
        $('#theSlide').append(
          '<div class="' +
            className +
            '"><h1>User audio</h1><div alt="title_text"><audio style="height:500px;width:1000px"; controls preload="metadata"> <source src= "' +
            flashcard.image + '#t=0.5' +
            '"></audio></div></div>'
        );
      }

      if (flashcard.lesson_type == 'title_textarea') {
        $('#theSlide').append(
          '<div class="' +
            className +
            '"><div class="title_textarea"><div alt="title_text"><h1> ' +
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
            '"><div class="title_input"><div alt="title_input"><h1> ' +
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
            '"><div class="name_type"><div alt="name_type"><h1> Enter your name: </h1><input name ="name_type_' +
            i +
            '" class="form-control" placeholder="Enter you name here"></div></div></div>'
        );
      }

      if (flashcard.lesson_type == 'signature') {
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
      '<div class="item"><div alt="quick_read"><h1>Completed <img height="30px" src="https://www.clipartmax.com/png/full/301-3011315_icon-check-green-tick-transparent-background.png"></h1></div></div>'
    );
    if (session_id) {
      $.get(SERVER + 'courses_api/lesson/response/get/' + lesson_id + '/' + localStorage.getItem('session_id'), function (response) {
        console.log(response);
        response.forEach(function (rf) {
          console.log(rf);
          loaded_flashcards.forEach(function (f, i) {
            if (rf.flashcard[0].id == f.id) {
              if (f.lesson_type == 'title_textarea') {
                $('textarea[name=textarea_' + i).val(rf.answer);
              }
              if (f.lesson_type == 'title_input') {
                $('input[name=title_input_' + i).val(rf.answer);
              }
              if (f.lesson_type == 'question_choices') {
                if (rf.answer == ""){
                  $('input[name=choices_' + i + '][value=' + rf.answer ? rf.answer : '' + ']').attr('checked', true);
                }else{
                  var strTYPE = "video/mp4";
                  $('#myCarousel #video').val(rf.answer);
                  $("#video_url").html(" ")
                  $("#theSlide #flashcard_"+ current_slide +"").append('<div id="video_url"><p> Video URL : '+ rf.answer +'</p><video id="videoplayer" style="height:500px;width:100%"; controls preload="metadata"> <source src="' + rf.answer + '#t=0.5' + '" type="' + strTYPE + '"></source></video><div>')
                }
                if (rf.answer == ""){
                  $('input[name=choices_' + i + '][value=' + rf.answer ? rf.answer : '' + ']').attr('checked', true);
                }
                else{
                  var strTYPE = "audio/mp4";
                  $('#myCarousel #audio').val(rf.answer);
                  $("#audio_url").html(" ")
                  $("#theSlide #flashcard_"+ current_slide +"").append('<div id="audio_url"><p> Video URL : '+ rf.answer +'</p><audio id="audioplayer" style="height:500px;width:100%"; controls preload="metadata"> <source src="' + rf.answer + '#t=0.5' + '" type="' + strTYPE + '"></source></audio><div>')
                }
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
            }
          });
        });
      })
        .done((res) => console.log('Invitaion res', res))
        .fail((err) => console.log('Invitation err', err));
    }
  })
}
function handleVideoUpload() {
    var file = $('#myFile').prop('files');
    console.log("🚀 ~ file: index.html ~ line 33 ~ handleVideoUpload ~ file", file[0])
    GLOBAL_FILE = file[0];
    var form = new FormData();
    form.append('file', GLOBAL_FILE);

    var settings = {
      async: true,
                 "crossDomain": true,
      url: SERVER + '/s3_uploader/upload',
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
                var strTYPE = "video/mp4";
                $('#myCarousel #video').val(file_url);
                $("#theSlide #flashcard_"+ current_slide +"").append('<div id="video_url"><p> Video URL : '+ file_url +'</p><video id="videoplayer" style="height:500px;width:100%"; controls preload="metadata"> <source src="' + file_url + '#t=0.5' +'" type="' + strTYPE + '"></source></video></div>')
            }
          $("#videoplayer")[0].load();
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


function handleAudioUpload() {
  var file = $('#myFile').prop('files');
  console.log("🚀 ~ file: index.html ~ line 33 ~ handleAudioUpload ~ file", file[0])
  GLOBAL_FILE = file[0];
  var form = new FormData();
  form.append('file', GLOBAL_FILE);

  var settings = {
    async: true,
               "crossDomain": true,
    url: SERVER + '/s3_uploader/upload',
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
        text: 'Audio uploaded successfully!',
        icon: 'success',
        timer: 1000,
      });
      const file_url = response.file_url;
      displayVideo(file_url);
      function displayVideo(file_url) {
        if (file_url) {
              var strTYPE = "video/mp4";
              $('#myCarousel #vaudio').val(file_url);
              $("#theSlide #flashcard_"+ current_slide +"").append('<div id="audio_url"><p> Audio URL : '+ file_url +'</p><audio id="audioplayer" style="height:500px;width:100%"; controls preload="metadata"> <source src="' + file_url + '#t=0.5' +'" type="' + strTYPE + '"></source></audio></div>')
          }
        $("#audioplayer")[0].load();
      }
  //   $("#video-modal").hide();
  //   setTimeout(() => { location.reload() }, 5000);
    }
  }).fail(function (error) {
    console.log("🚀 ~ file: index.html ~ line 56 ~ error", error)
    swal({
      title: 'Error!',
      text: 'Audio upload failed!',
      icon: 'warning',
      timer: 1000,
    });

  });

}
window.addEventListener('DOMContentLoaded', init, false);

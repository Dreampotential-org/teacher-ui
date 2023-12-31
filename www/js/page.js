var answer = "";
var signature = "";
var total_slides = 0;
var loaded_flashcards = "";
var pct = 0;
var completed = false;
var signature = [];
var session_id = null;
var user_tour_array = [];
var tempMap = 0;
var gps_response;
let api;
var signLessondata;

function updateSign(data_, event, imgId, signInput, data_sign) {
  var les_id_sign;
  var classLists_sign = $(data_sign).attr("class").split(/\s+/);
  var bedrooms_sign = classLists_sign.filter(name => name.includes('className_'))
  les_sign = bedrooms_sign[0].split("_")
  les_id_sign = les_sign[1]

  console.log("yo",event, event.target.parentNode);
  if(event && data_){
    console.log($('#flashcard_'+les_id_sign).find('#'+imgId)[0])
    $('#flashcard_'+les_id_sign).find('#'+imgId).attr('src',data_);
    $('#flashcard_'+les_id_sign).find('#'+imgId).removeAttr('hidden');
    $('#flashcard_'+les_id_sign).find('#'+signInput).val(data_);
    $('#flashcard_'+les_id_sign).find('button.btn').text('Redraw Signature');
  }
  document.removeEventListener("signatureSubmitted",(e)=>{});
  window.currentSignature = undefined;
  nextSlide(data_sign)
} 

function signLesson(event, imgId, signInput, data_less) {
  if ($("#signature")) {
    $("#signature").modal("show");
  }
  signLessondata = data_less
  document.addEventListener("signatureSubmitted", function (e) {
    if(window.currentSignature){
      updateSign(JSON.parse(JSON.stringify(window.currentSignature)).data, event, imgId, signInput, signLessondata);
    }
  });
}

function sendResponse(flashcard_id, answer, current_flashcard) {
  console.log("response....", flashcard_id, answer);

  var sessionId = localStorage.getItem("session_id");
  var ip_address = "172.0.0.1";
  var user_device = "self device";
  da_ = {
    session_id: localStorage.getItem("session_id"),
    ip_address: ip_address,
    user_device: user_device,
  };

  const param = new URL(window.location.href);
  const params = param.searchParams.get("params");

  if (params) {
    var data_ = {
      flashcard: flashcard_id,
      session_id: localStorage.getItem("session_id"),
      answer: answer ? answer : "",
      params: params,
    };
  } else {
    if (current_flashcard.lesson_type == "user_gps") {
      navigator.geolocation.watchPosition(geo_success, geo_error,geo_options);
      var data_ = {
        flashcard: flashcard_id,
        session_id: localStorage.getItem("session_id"),
        answer: answer ? answer : "",
        latitude:
          CURRENT_POSITION != null ? CURRENT_POSITION.coords.latitude : "",
        longitude:
          CURRENT_POSITION != null ? CURRENT_POSITION.coords.longitude : "",
      };
    } 
    else {
        var data_ = {
            flashcard: flashcard_id,
            session_id: localStorage.getItem("session_id"),
            answer: answer ? answer : "",
        };
    }
  }

  console.log("data passed to API => ", data_);

  $.ajax({
    url: SERVER + "courses_api/flashcard/response",
    data: JSON.stringify(data_),
    type: "POST",
    contentType: "application/json",
    success: function (data) {
      $.ajax({
        url:SERVER + "courses_api/session/event/" + flashcard_id + "/" + sessionId,
        data: JSON.stringify(da_),
        type: "POST",
        contentType: "application/json",
        success: function (da_) {
          console.log("Session event duration");
        },
        fail: function (res) {
          alert(res);
        },
      });
    },
    error: function (res) {
      console.log("🚀 ~ file: page.js ~ line 117 ~ sendResponse ~ res", res)
    },
  });
}

function updateMeta(type, answer) {
  if (type == "name") {
    swal({ title: "setting up name to " + answer });
  }
}

function nextSlide(data) {
  var les_id;

  function search(les_id, loaded_flashcards){
    for (var i=0; i < loaded_flashcards.length; i++) {
      if (loaded_flashcards[i].id == les_id) {
        current_flashcard = loaded_flashcards[i]
        flashcard_id = loaded_flashcards[i].id
        break;
      }
    }
  }

  var classLists = $(data).attr("class").split(/\s+/);
  var class_Name = classLists.filter(name => name.includes('className_'))
  les_ = class_Name[0].split("_")
  les_id = les_[1]

  console.log("🚀 ~ file: slide.js ~ line 147 ~ nextSlide ~ loaded_flashcards", loaded_flashcards)
  
  search(les_id, loaded_flashcards)

  var type = current_flashcard.lesson_type;
  console.log("SLIDE JS TYPE ===> ", type);

  if (type == "question_choices") {
    answer = $("input:radio.className_"+(les_id)+":checked").val();;
    sendResponse(flashcard_id, answer, current_flashcard);
  } else if (type == "question_checkboxes") {
    let answer = [];
    $("input:checkbox.className_"+(les_id)+":checked").each((j, k) => {answer.push(k.value);});
    sendResponse(flashcard_id, answer.join(","), current_flashcard);
  } else if (type == "title_textarea") {
    answer = document.getElementsByClassName("className_"+ (les_id) + "")[0].value;
    sendResponse(flashcard_id, answer, current_flashcard);
  } else if (type == "title_input") {
    answer = document.getElementsByClassName("className_"+ (les_id) + "")[0].value;
    sendResponse(flashcard_id, answer, current_flashcard);
  } else if (type == "signature") {
    answer = $("input[name= input_signature_" + (les_id) + "]").val();
    sendResponse(flashcard_id, answer, current_flashcard);
  } else if (type == "name_type") {
    answer = document.getElementsByClassName("className_"+ (les_id) + "")[0].value;
    sendResponse(flashcard_id, answer, current_flashcard);
  } else if (type == "user_video_upload") {
    answer = $("#user-video-tag").find("source").attr("src");;
    sendResponse(flashcard_id, answer, current_flashcard);
  } else if (type == "user_image_upload") {
    answer = $(`#user-image-display_${flashcard_id}`).attr("src");
    sendResponse(flashcard_id, answer, current_flashcard);
  } else if (type == "user_gps") {
    answer = $("#note_" + (les_id)).val();
    sendResponse(flashcard_id, answer, current_flashcard);
    document.removeEventListener("gpsPosition", () => {});
  }
  else if (type == "gps_session") {
    answer = gps_response;
    sendResponse(flashcard_id, answer, current_flashcard);
  }else if (type == "email_verify") {
    answer = $("input[id=email_address]").val();
    sendResponse(flashcard_id, answer, current_flashcard);
  }
  else if (type == "verify_phone") {
    answer = $("input[id=phone_number]").val();
    sendResponse(flashcard_id, answer, current_flashcard);
  }
  else if (type == "datepicker") {
    answer = $("#datepicker").val();
    sendResponse(flashcard_id, answer, current_flashcard);
  }
  else if (type == "jitsi_meet"){
    api.dispose();
  }

  if (current_flashcard.lesson_type == "user_gps") {
    handle_gps_click();
    document.addEventListener("gpsPosition", (d) => {
      console.log("pos", CURRENT_POSITION, CURRENT_POSITION_LOW);
      let lat = CURRENT_POSITION
        ? CURRENT_POSITION.coords.latitude
        : CURRENT_POSITION_LOW.coords.latitude;
      let long = CURRENT_POSITION
        ? CURRENT_POSITION.coords.longitude
        : CURRENT_POSITION_LOW.coords.longitude;
      $("#lat_" + les_id).val(lat);
      $("#long_" + les_id).val(long);
    });
  } else if (type == "user_gps") {
    console.log("User-GPS slide page");
    answer = $("#note_" + (les_id)).val();
    sendResponse(flashcard_id, answer, current_flashcard);
  }
  if (current_flashcard.lesson_type == "jitsi_meet"){
    startJitsiMeet(current_flashcard);
  }
}

function Submit(){
  var lesson_id = getParam("lesson_id");
  $(document).ready(function () {
    $.ajax({
      url: SERVER + "courses_api/lesson/student/get/mail/" + lesson_id,
      async: true,
      crossDomain: true,
      crossOrigin: true,
      type: "GET",
      headers: { Authorization: Bearer `${localStorage.getItem("user-token")}` },
    })
    .done((response) => {
        console.log("🚀 ~ file: settings.html ~ line 229 ~ response", response);
    })
    .fail((err) => {
        console.log("🚀 ~ file: settings.html ~ line 232 ~ errorss", err);
    });
  });
  swal({
    title: "Submitted",
    text: "You have successfully completed the lesson. Thank you.",
    icon: "success",
    timer: 2000,
  });
}

function getParam(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split("&");
  for (var p = 0; p < sURLVariables.length; p++) {
    var sParameterName = sURLVariables[p].split("=");
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function phone_verification_check() {
  session_id = localStorage.getItem("session_id");
  console.log("phone verification check running");
  var data_ = {
    session_id: session_id,
  };
  console.log(SERVER + "courses_api/verify/phone-verify");
  $.ajax({
    url: SERVER + "courses_api/verify/phone-verify",
    data: JSON.stringify(data_),
    type: "POST",
    async: true,
    contentType: "application/json",
    success: function (data) {
    },
    error: function (res) {
    },
  });
}

function get_session() {
  $.ajax({
    url: SERVER + "courses_api/session/get",
    type: "GET",
    async: false,
    contentType: "application/json",
    success: function (data) {
      localStorage.setItem("session_id", data.session_id);
    },
    error: function (res) {
    },
  });
}

function viewMapLocations(tempMap, user_tour_array) {
  console.log("mapppp==>", "#journal-body-tour-" + tempMap);

  $("#journal-body-tour-" + tempMap).html(`
    <div id='gps-view-tour-${tempMap}' style='width:100%;height:450px;'></div>
  `);

  console.log("user_tour_array=>", user_tour_array);

  let lat = 0, long = 0;

  for (var i = 0; i < user_tour_array.length; i++) {
    lat = user_tour_array[i]["latitude"];
    long = user_tour_array[i]["longitude"];
  }

  var map = new google.maps.Map(
    document.getElementById("gps-view-tour-" + tempMap),
    {
      zoom: 10,
      center: new google.maps.LatLng(lat, long),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
  );

  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  for (i = 0; i < user_tour_array.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        user_tour_array[i]["latitude"],
        user_tour_array[i]["longitude"]
      ),
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: map,
    });

    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, i) {
        return function () {
          var contentString =
            `<div style="font-weight:600;font-size: 16px;">${user_tour_array[i]["title"]}</div>` +
            "<br />" +
            user_tour_array[i]["description"] +
            `<br /><br />
            <img width="auto" height="auto" 
            src=${user_tour_array[i]["image"]}
            <="" div="">`;
          infowindow.setContent(contentString);
          infowindow.open(map, marker);
        };
      })(marker, i)
    );
  }
}

function verifyPhone(event, data) {
  if ($("#verify_phone")) {
    $("#verify_phone").modal("show");
  }

  document.addEventListener("phoneVerified", function (e) {
    $("#verify_phone").modal("hide");
    nextSlide(data)
  });
}

function verifyEmail(event, data) {
  if ($("#email_verify")) {
    $("#email_verify").modal("show");
  }

  document.addEventListener("emailVerified", function (e) {
    $("#email_verify").modal("hide");
    nextSlide(data)
  });
}

async function startJitsiMeet(flashcard) {
  var domain = "meet.jit.si";
  var options = {
    roomName: flashcard.question,
    configOverwrite: {
      startWithAudioMuted: true,
      prejoinPageEnabled: false,
      startWithVideoMuted: false,
    },
    height: 570,
    parentNode: document.querySelector(`#flashcard_${flashcard.id}`),
    configOverwrite: {},
    interfaceConfigOverwrite: {},
  };
  api = new JitsiMeetExternalAPI(domain, options);
}

function chiroFront(event) {
  event.preventDefault();

  var formData = new FormData($("#chirofront_form")[0]);
  var body_height = [...formData][1][1];
  var fileData = [...formData][0][1];
  formData.append("label", 0);
  formData.append("image_type", 0);
  var chiroFrontReq = {
    url: "https://admin.chiropractortech.com/api/single/execution/",
    method: "post",
    data: formData,
    processData: false,
    contentType: false,
  };

  $.ajax(chiroFrontReq).done((response) => {
    var img = $("<img/>");
    img.attr("src", response.processed_file);
    img.attr("height", "300px");
    img.appendTo($("#chirofront_processed"));
    response.details.forEach((detail) => {
      $("<p>" + detail.text + "</p>").appendTo($("#chirofront_details"));
    });
  });
}

function chiroSide(event) {
  event.preventDefault();
  var formData = new FormData($("#chiroside_form")[0]);
  formData.append("label", 1);
  formData.append("image_type", 0);

  var chiroSideReq = {
    url: "https://admin.chiropractortech.com/api/single/execution/",
    method: "post",
    data: formData,
    processData: false,
    contentType: false,
  };

  $.ajax(chiroSideReq).done((response) => {
    var img = $("<img/>");
    img.attr("src", response.processed_file);
    img.attr("height", "300px");
    img.appendTo($("#chiroside_processed"));
    response.details.forEach((detail) => {
      $("<p>" + detail.text + "</p>").appendTo($("#chiroside_details"));
    });
  });
}

function radioOnClick(valu) {
  if (userToken) {
    if (valu == "Video" || valu == "video") {
      if ($("#videoModal")) {
        $("#videoModal").modal("show");
      }
    } else if (valu == "GPS + note" || valu == "GPS + note") {
      if ($("#gpsModal")) {
        $("#gpsModal").modal("show");
        handle_gps_click();
      }
    }
  }
}

function init() {
  $("body").css("display", "none")
  console.log("INIT dom");
  $("#sign-modal").load("signature/index.html");
  $("#verify-phone-modal").load("phone/index.html");
  $("#verify-email-modal").load("email/index.html");
  $("#video-modal").load("video/index.html");
  $("#gps-modal").load("gps/index.html");

  var lesson_id = getParam("lesson_id");

  get_session();
  $.get(
    SERVER + "courses_api/slide/read/" + lesson_id,
    function (response, status, xhr) {
      console.log('>>>>>>>>> slide', response);
      document.title = response.lesson_name
        ? response.lesson_name
        : "Lesson - " + lesson_id;

      total_slides = response.flashcards.length;

      var flashcards = response.flashcards;
      console.log("🚀 ~ file: slide.js ~ line 482 ~ flashcards", flashcards);
      flashcards.sort(function (a, b) {
        keyA = a.position;
        keyB = b.position;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      loaded_flashcards = flashcards;
      var i = 0;
      var className = "item";

      flashcards.forEach((flashcard, index) => {
        console.log("flashcard=>", flashcard);

        if (flashcard.lesson_type == "verify_phone") {
          $("#myCarousel").append(`
            <div class="${className}" id="flahscard_${i}" id="verify_phone">
              <div alt="verify_phone">
                <input type="text" hidden name="verify_phone_${i}" id="verifyPhone">
                <button class="btn btn-primary className_${flashcard.id}" type="button" onclick="verifyPhone(event, this)"> Click To Verify Phone Number</button>
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "chiro_front") {
          $("#myCarousel").append(`
            <div class="${className}" id="flahscard_${i}" id="chiro_front">
              <div alt="chiro_front">
                <h1>Chiro Front</h1>
                <form id="chirofront_form" onsubmit="chiroFront(event)" enctype="multipart/form-data" method="post">
                  <input name="file" type="file">
                  <label>Height:</label>
                  <input name="body_height">
                  <button class="btn">Submit</button>
                </form>
                <div id="chirofront_processed"></div>
                <div id="chirofront_details"></div>
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "chiro_side") {
          $("#myCarousel").append(`
            <div class="${className}" id="flahscard_${i}" id="chiro_side">
              <div alt="chiro_side">
                <h1>Chiro Side</h1>
                <form id="chiroside_form" onsubmit="chiroSide(event)" enctype="multipart/form-data" method="post">
                  <input name="file" type="file">
                  <label>Height:</label>
                  <input name="body_height">
                  <button class="btn">Submit</button>
                </form>
                <div id="chiroside_processed"></div>
                <div id="chiroside_details"></div>
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "user_qr_data") {
          $("#myCarousel").append(`
            <div class="${className}" id="flashcard_${flashcard.id}">
              <h1>QR Code</h1>
              <div id="main" ></div>
            </div>
          `);
          qrcodeResponse(lesson_id);
        }

        if (flashcard.lesson_type == "user_qr_url") {
          $("#myCarousel").append(`
            <div class="${className}" id="flashcard_${flashcard.id}">
              <h1>QR URL</h1>
              <a href="${flashcard.question}" target="_blank">${flashcard.question}</a>
            </div>
          `);
        }

        if (flashcard.lesson_type == "gps_session") {
          $("#myCarousel").append(`
            <div class="${className}" id="flashcard_${flashcard.id}">
              <h1>GPS Session</h1>
              <div id="livedata" style="overflow:auto"></div>
              <button class="btn btn-default" id='start_session'>Start Session</button>
              <button class="btn btn-primary active className_${flashcard.id}" id='stop_session' style='display:none;'>Stop Session</button> 
              <div id='distance'></div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "datepicker") {
          $("#myCarousel").append(`
            <div class="${className}" id="flahscard_${i}" id="datepicker">
              <p>Date: <input type="text" class="className_${flashcard.id}" id="datepicker" onchange="nextSlide(this)"></p>
            </div>
          `);
          $("#datepicker").datepicker({dateFormat: "yy-mm-dd"})
        }


        if (flashcard.lesson_type == "email_verify") {
          $("#myCarousel").append(`
            <div class="${className}" id="flahscard_${i}" id="email_verify">
              <div alt="email_verify">
                <button class="btn btn-primary className_${flashcard.id}" type="button" onclick="verifyEmail(event, this)"> Click To Verify Email Address </button>
                <p>Verified Email <span id="email_address_info"></span></p>
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "jitsi_meet") {
          $("#myCarousel").append(`
            <div class="${className}" id="flashcard_${flashcard.id}" onclick=nextSlide()>
              <h4>Join Conference</h4>
              <div class="btn-group btn-toggle" id="join_conference"></div>
            </div>
          `);
        }
        if (flashcard.lesson_type == "record_webcam") {
          $("#myCarousel").append(`
            <div class="${className}" id="flashcard_${flashcard.id}">
              <h4>Recording Webcam</h4>
              <div class="btn-group btn-toggle" id="recording"> 
                  <button class="btn btn-default" id="start_recording">ON</button>
                  <button class="btn btn-primary active" id="stop_recording">OFF</button>
              </div>
              <hr>
              <video controls autoplay id="record_webcam"></video>
            </div>
          `);

          var video = document.querySelector("#record_webcam");
          let start = document.getElementById("start_recording");
          let stop = document.getElementById("stop_recording");
          let options = { mimeType: "video/webm;codecs=vp9" };

          let chunks = [];
          let stream, mediaRecorder;

          async function startRecordingWebCam() {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = function (ev) {
              chunks.push(ev.data);
            };
            mediaRecorder.onstop = (ev) => {
              let blob = new Blob(chunks);
              chunks = [];
              var file = new File([blob], `${flashcard.id}.mp4`, {
                type: "video",
                lastModified: Date.now(),
              });
              var form = new FormData();
              form.append("file", file);

              var settings = {
                async: true,
                crossDomain: true,
                url: SERVER + "profile/upload",
                method: "POST",
                type: "POST",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                data: form,
                headers: {
                  Authorization: Bearer localStorage.getItem("token"),
                },
              };
              $.ajax(settings)
                .done(function (response) {
                  console.log("🚀 ~ file: index.html ~ line 57 ~ response",response);
                  let resp = JSON.parse(response);
                  if (resp.message == "No file provided!") {
                    swal({
                      title: "File Not Select",
                      text: resp.message,
                      icon: "warning",
                      timer: 1000,
                    });
                  } else {
                    console.log("this is else part");
                    sendResponse(flashcard.id, resp.file_url);
                    swal({
                      title: "Good job!",
                      text: "Video uploaded successfully!",
                      icon: "success",
                      timer: 1000,
                    });
                    video.src = response.file_url;
                  }
                })
                .fail(function (error) {
                  console.log("🚀 ~ file: index.html ~ line 56 ~ error", error);
                  swal({
                    title: "Error!",
                    text: "Video upload failed!",
                    icon: "warning",
                    timer: 1000,
                  });
                });
            };
          }

          start.addEventListener("click", (ev) => {
            startRecordingWebCam();

            start.classList.remove("btn-default");
            start.classList.add("btn-primary");
            start.classList.add("active");
            stop.classList.remove("active");
            stop.classList.remove("btn-primary");
            stop.classList.add("btn-default");
            console.log("start recording video", mediaRecorder.state);
          });
          stop.addEventListener("click", (ev) => {
            mediaRecorder.stop();
            stop.classList.remove("btn-default");
            stop.classList.add("btn-primary");
            stop.classList.add("active");
            start.classList.remove("active");
            start.classList.remove("btn-primary");
            start.classList.add("btn-default");
            stream.getTracks().forEach(function (track) {
              track.stop();
            });
            console.log("stop recording video", mediaRecorder.state);
          });
        }

        if (flashcard.lesson_type == "record_screen") {
          $("#myCarousel").append(`
            <div class="${className}" id="flashcard_${flashcard.id}">
              <h4>Recording Screen</h4>
              <div class="btn-group btn-toggle"> 
                <button class="btn btn-default" id="start_recording_screen">ON</button>
                <button class="btn btn-primary active" id="stop_recording_screen">OFF</button>
              </div>
              <hr>
              <video controls autoplay id="record_screen"></video>F
            </div>
          `);
          var video = document.querySelector("#record_screen");
          let start_screen = document.getElementById("start_recording_screen");
          let stop_screen = document.getElementById("stop_recording_screen");
          let recorder, stream, audioStream, webcamStream;

          function calc() {
            console.log("switch...", start_screen.checked);
          }
          async function startRecording() {
            stream = await navigator.mediaDevices.getDisplayMedia({
              video: { cursor: "always" },
            });
            audioStream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
              },
            });

            stream.addTrack(audioStream.getAudioTracks()[0]);

            recorder = new MediaRecorder(stream);

            const chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = (e) => {
              const completeBlob = new Blob(chunks);
              video.src = URL.createObjectURL(completeBlob);
              var file = new File([completeBlob], `${flashcard.id}.mp4`, {
                type: "video",
                lastModified: Date.now(),
              });
              var form = new FormData();
              form.append("file", file);

              var settings = {
                async: true,
                crossDomain: true,
                url: SERVER + "profile/upload",
                method: "POST",
                type: "POST",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                data: form,
                headers: {
                  Authorization: Bearer localStorage.getItem("token"),
                },
              };
              $.ajax(settings)
                .done(function (response) {
                  console.log("🚀 ~ file: index.html ~ line 57 ~ response",response);
                  let resp = JSON.parse(response);
                  if (resp.message == "No file provided!") {
                    swal({
                      title: "File Not Select",
                      text: resp.message,
                      icon: "warning",
                      timer: 1000,
                    });
                  } else {
                    console.log("this is else part");
                    sendResponse(flashcard.id, resp.file_url);
                    swal({
                      title: "Good job!",
                      text: "Video uploaded successfully!",
                      icon: "success",
                      timer: 1000,
                    });
                  }
                })
                .fail(function (error) {
                  console.log("🚀 ~ file: index.html ~ line 56 ~ error", error);
                  swal({
                    title: "Error!",
                    text: "Video upload failed!",
                    icon: "warning",
                    timer: 1000,
                  });
                });
            };

            recorder.start();
          }

          start_screen.addEventListener("click", () => {
            start_screen.classList.remove("btn-default");
            start_screen.classList.add("btn-primary");
            start_screen.classList.add("active");
            stop_screen.classList.remove("active");
            stop_screen.classList.remove("btn-primary");
            stop_screen.classList.add("btn-default");

            startRecording();
          });

          stop_screen.addEventListener("click", () => {
            stop_screen.classList.remove("btn-default");
            stop_screen.classList.add("btn-primary");
            stop_screen.classList.add("active");
            start_screen.classList.remove("active");
            start_screen.classList.remove("btn-primary");
            start_screen.classList.add("btn-default");

            let tracks = stream.getTracks();
            console.log(tracks);
            console.log(stream.getAudioTracks());
            tracks.forEach((track) => track.stop());
          });
        }

        if (flashcard.lesson_type == "quick_read") {

          $("#myCarousel").append(
            '<div class="' +
              className +
              '">' +
              '<div class="quick-read-container">' +
              '<div class="speedreader-txt" alt="quick_read"><h1 class="speedrdr-txt">' +
              flashcard.question +
              "</h1></div>" +
              '<div class="word-display text-center"><div class="txt"></div></div>' +
              '<div class="box card p-4">' +
              '<div class="form-group arrow-group d-flex justify-content-center">' +
              '<div class="timer-field field-control d-flex align-items-center">' +
              '<div class="field-arrow text-center">' +
              '<div class="monitor d-flex">' +
              '<div class="timer-length txt-num">1</div>' +
              '<div class="word-speed">min</div>' +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="wpm-field field-control d-flex align-items-center">' +
              '<div class="field-txt">WPM</div>' +
              '<div class="field-arrow text-center">' +
              '<button class="btn btn-plus btn-arrow" type="button">' +
              '<i class="fa fa-angle-up" aria-hidden="true"></i>' +
              "</button>" +
              '<div class="monitor d-flex">' +
              '<input type="text" class="word-length txt-input-num form-control">' +
              '<div class="word-speed">x1</div>' +
              "</div>" +
              '<button class="btn btn-minus btn-arrow" type="button">' +
              '<i class="fa fa-angle-down" aria-hidden="true"></i>' +
              "</button>" +
              "</div>" +
              "</div>" +
              '<div class="wordcount-field field-control d-flex align-items-center">' +
              '<div class="field-txt">Words at a time</div>' +
              '<div class="field-arrow text-center">' +
              '<button class="btn btn-plus btn-arrow" type="button">' +
              '<i class="fa fa-angle-up" aria-hidden="true"></i>' +
              "</button>" +
              '<div class="monitor text-center">' +
              '<div class="word-num txt-num">1</div>' +
              "</div>" +
              '<button class="btn btn-minus btn-arrow" type="button">' +
              '<i class="fa fa-angle-down" aria-hidden="true"></i>' +
              "</button>" +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="form-group mb-0 text-center">' +
              '<button type="button" class="btn btn-primary start-btn disabled">START NOW</button>' +
              "</div>" +
              '<div class="form-group text-center slider-group">' +
              '<div id="slider"></div>' +
              "</div>" +
              '<div class="form-group mb-0 text-center pt-3 btm-options">' +
              '<button type="button" class="btn btn-danger stop-btn">Stop</button>' +
              '<div class="sound-btn-container d-flex align-items-center">' +
              '<button type="button" class="btn btn-secondary speak-btn">' +
              '<span class="speak"><i class="fa fa-volume-up" aria-hidden="true"></i></span>' +
              '<span class="mute"><i class="fa fa-volume-off" aria-hidden="true"></i></span>' +
              "</button>" +
              '<div class="sound-select position-relative">' +
              '<button class="btn light-btn" type="button">' +
              '<span class="icon"><i class="fa fa-microphone" aria-hidden="true"></i></span>' +
              '<span class="txt"></span>' +
              '<span class="icon arrow-icon"><i class="fa fa-caret-down" aria-hidden="true"></i></span>' +
              "</button>" +
              '<div class="drop-list voice-drop-list user-select-none">' +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="timer">00:00</div>' +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
          );

          setTimeout(function () {
            $("head").append('<script src="js/jquery-ui.min.js"></script>');
            $("head").append('<script src="js/speed-reader.js"></script>');
          }, 1);
        }
        if (flashcard.lesson_type == "title_text") {
          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div alt="title_text" style=""><h1> ' +
              flashcard.question +
              "</h1><h3>" +
              flashcard.answer +
              "</h3></div></div>"
          );
        }
        if (flashcard.lesson_type == "question_choices") {
          $("#myCarousel").append(
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
            $("#flashcard_" + i).prepend(
              '<center><img src="' +
                flashcard.image +
                '" alt="Chania" style="width:400px;border:5px;border-style:solid;border-color:black"></center>'
            );
          }
          if (typeof flashcard.options == "string") {
            flashcard.options = flashcard.options.split(",");
          }
          flashcard.options.forEach(function (valu) {
            $("#myCarousel")
              .find("ul")
              .each((a, b, c) => {
                if ($(b).attr("alt") == "question_choices_" + i) {
                  $(b).append("<br><input type='radio' class='className_"+flashcard.id+"' id='" +valu +"' value='" +valu +"' onclick=nextSlide(this) name='choices_" +i +"'> <label style='font-weight: normal;' for='" +
                      valu +"'>" +valu +"</lable>"
                  );
                }
              });
            if (
              $("#myCarousel").find("ul").attr("alt") ===
              "question_choices_" + i
            ) {
            }
          });
        }

        if (flashcard.lesson_type == "question_checkboxes") {
          $("#myCarousel").append(
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
            $("#flashcard_" + i).prepend(
              '<center><img src="' +
                flashcard.image +
                '" alt="Chania" style="width:400px;border:5px;border-style:solid;border-color:black"></center>'
            );
          }

          flashcard.options.forEach(function (valu) {
            $("#myCarousel")
              .find("ul")
              .each((a, b, c) => {
                if ($(b).attr("alt") == "question_checkboxes_" + i) {
                  $(b).append(
                    "<br><input type='checkbox' class='className_"+flashcard.id+"' id='" +
                      valu +
                      "' value='" +
                      valu +
                      "' name='checkboxes_" +
                      i +
                      "' onclick=nextSlide(this)> <label style='font-weight: normal;' for='" +
                      valu +
                      "'>" +
                      valu +
                      "</lable>"
                  );
                }
              });
            if (
              $("#myCarousel").find("ul").attr("alt") ===
              "question_checkboxes_" + i
            ) {
            }
          });
        }

        if (flashcard.lesson_type == "iframe_link") {
          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div alt="iframe_link" class="iframe_div"><h1> ' +
              flashcard.question +
              '</h1><iframe  class="iframe_screen" src= "' +
              flashcard.image +
              '"></iframe></div></div>'
          );
        }
        if (flashcard.lesson_type == "video_file") {
          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div alt="title_text" style=""><h1>Video File</h1><h1> ' +
              flashcard.question +
              "</h1>" +
              (flashcard.image
                ? '<video style="height:500px;width:1000px"; controls preload="metadata"> <source src= "' +
                  flashcard.image +
                  "#t=0.5" +
                  '"></video>'
                : "<h5>No file uploaded.</h5>") +
              "</div></div>"
          );
        }

        if (flashcard.lesson_type == "image_file") {
          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div alt="title_text" style=""><h1> ' +
              flashcard.question +
              '</h1><img src= "' +
              flashcard.image +
              '" style="max-height:418px;margin:auto;display:block"></div></div>'
          );
        }

        if (flashcard.lesson_type == "user_tour") {

          user_tour_array = [];

          flashcard.options.forEach(function (res) {
            user_tour_array.push(res);
          });

          tempMap++;
          console.log("response user_tour_array=>", user_tour_array);

          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div alt="title_text" style="height:100%"><h1>User Tour</h1><h1> ' +
              `<div style="margin-top:16px;"class="form-group">
                    <button class='btn btn-info gps-entry' 
                    onclick="viewMapLocations('${tempMap},${user_tour_array})">View Map</button>
                    </div>
                    <div class="journalModalTour">
                    <div id='journal-body-tour-${tempMap}'></div>
                    </div></div>`
          );

          viewMapLocations(tempMap, user_tour_array);
        }

        if (flashcard.lesson_type == "user_gps") {
          console.log("flashcard.lesson_type == 'user_gps'");
          console.log("flashcard value ===> ", flashcard);

          $("#myCarousel").append(
            `<div class="' +
          ${className} +'"><div class="title_input">
          <div alt="title_input" style=""><h1>GPS Note:</h1>
          <p> ${flashcard.question}</p>
          <div><label>Latitude: </label>
          <input id="lat_${flashcard.id}" value="0" disabled></div>
          <div style="margin-top:16px;"><label>Longitude: </label>
          <input id="long_${flashcard.id}" value="0" disabled></div>
          <div class="form-group">
           <textarea class="form-control className_${flashcard.id}" rows="10" name="note" placeholder="note" id="note_${flashcard.id}" onblur=nextSlide(this)></textarea>
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
        }

        if (flashcard.lesson_type == "user_video_upload") {
          console.log("user_video_upload flashcard.lesson_type ===> ",flashcard.lesson_type);
          $("#myCarousel").append(`
            <div class="${className}">
              <div alt="title_text" style="">
                <h2> ${flashcard.question}</h2>
                <input type="file" class="form-control className_${flashcard.id}" value="Choose File" id="myFile" onchange="handleVideoUpload('user_video_upload', this)"/>
                <video style="max-height:450px;max-width:1000px;display:none; margin:auto"; controls preload="metadata" id="user-video-tag"></video>
              </div>
            </div>
          `
          );
        }

        if (flashcard.lesson_type == "user_image_upload") {
          console.log("user_image_upload flashcard.lesson_type ===> ",flashcard.lesson_type);
          $("#myCarousel").append(`
            <div class="${className}">
              <div alt="title_text" style="">
                <p> ${flashcard.question}</p>
                <input type="file" class="form-control className_${flashcard.id}" value="Choose File" id="image_upload_${flashcard.id}" onchange="handleImageUpload('user_image_upload',${flashcard.id}, this)"/> 
                <img style="width:auto; margin:auto; display:none;" id="user-image-display_${flashcard.id}">
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "title_textarea") {
          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div class="title_textarea"><div alt="title_text" style=""><h1> ' +
              flashcard.question +
              '</h1><textarea name ="textarea_' +
              i +
              '" class="form-control className_'+flashcard.id+'" placeholder="Enter you answer here" onblur="nextSlide(this)"></textarea></div></div></div>'
          );
        }
        if (flashcard.lesson_type == "title_input") {
          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div class="title_input"><div alt="title_input" style=""><h1> ' +
              flashcard.question +
              '</h1><textarea style="height:100px" name ="title_input_' +
              i +
              '" class="form-control className_'+flashcard.id+'" placeholder="Enter you answer here" onblur="nextSlide(this)"></textarea></div></div></div>'
          );
        }

        if (flashcard.lesson_type == "name_type") {
          $("#myCarousel").append(
            '<div class="' +
              className +
              '"><div class="name_type"><div alt="name_type" style=""><h1> Enter your name: </h1><input name ="name_type_' +
              i +
              '" class="form-control className_'+flashcard.id+'" placeholder="Enter you name here" onblur="nextSlide(this)"></div></div></div>'
          );
        }

        if (flashcard.lesson_type == "signature") {
          $("head").append(
            '<script src="https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js"></script>'
          );
          $("#myCarousel").append(`
            <div class="${className}" id="flashcard_${flashcard.id}">
              <div class="text-center alt="signature">
                <input type="text" hidden name="input_signature_${flashcard.id}" id="signInput">
                <img id="slide_signature" hidden>
                <button class="btn btn-primary className_${flashcard.id}" type="button" onclick="signLesson(event,'slide_signature', 'signInput', this)"> Click To Sign</button>
              </div>
            </div>
          `);
        }
        i++;
      });

      if (session_id) {
        console.log("🚀 ~ file: page.js ~ line 1223 ~ init ~ session_id", session_id)
        $.get(
          SERVER +"courses_api/lesson/response/get/" + lesson_id + "/" + localStorage.getItem("session_id"),
          function (response) {
            console.log("🚀 ~ file: slide.js ~ line 1510 ~ init ~ response", response)
            response.forEach(function (rf) {
              console.log("🚀 ~ file: slide.js ~ line 777 ~ rf", rf)
              loaded_flashcards.forEach(function (f, i) {
                console.log("🚀 ~ file: slide.js ~ line 1538 ~ f", f)
                if (rf.flashcard[0].id == f.id) {
                  if (f.lesson_type == "title_textarea") {
                    $("textarea[name=textarea_" + i).val(rf.answer);
                  }
                  if (f.lesson_type == "user_video_upload") {
                    console.log("user_video_upload-response", rf.answer);
                    if (rf.answer) {
                      $("#user-video-tag").css("display", "block");
                      $("#user-video-tag").append(
                        '<source src="' +
                          rf.answer +
                          '" type="video/mp4" #t=0.5></source>'
                      );
                      $("#user-video-tag")[0].load();
                    }
                  }
                  if (f.lesson_type == "user_image_upload") {
                    if (rf.answer) {
                      $(`#user-image-display_${f.id}`).attr("src", rf.answer);
                      $(`#user-image-display_${f.id}`).css("display", "block");
                    }
                  }
                  if (f.lesson_type == "title_input") {
                    $("input[name=title_input_" + i).val(rf.answer);
                  }
                  if (f.lesson_type == "question_choices") {
                    $(
                      "input[name=choices_" + i + "][value=" + rf.answer + "]"
                    ).attr("checked", "checked");
                  }

                  if (f.lesson_type == "question_checkboxes") {
                      console.log(rf.answer)
                    rf.answer.split(",").forEach((v) => {
                      if (!(v))  { v = false; }
                      $(
                        "input[name=checkboxes_" + i + "][value=" + v + "]"
                      ).attr("checked", true);
                    });
                  }
                  if (f.lesson_type == "signature") {
                    $("input[name=input_signature_" + i + "]").val(rf.answer);
                    $("#slide_signature").attr("src", rf.answer);
                    if (rf.answer) {
                      $("#slide_signature").attr("hidden", false);
                      console.log($("#flashcard_" + i));
                      console.log($("#flashcard_" + i).find("button"));
                      $("#flashcard_" + i).find("button")[0].innerText =
                        "Update Signature";
                    }
                  }
                  if (f.lesson_type == "user_gps") {
                    let ans = {};
                    try {
                      ans = JSON.parse(rf.answer);
                    } catch (e) {
                    }
                    $("#note_" + i).val(rf.answer);
                    $("#lat_" + i).val(rf.latitude);
                    $("#long_" + i).val(rf.longitude);
                    console.log("set previos gps value");
                  }
                  if (f.lesson_type == "gps_session") {
                    let ans = {};
                    try {
                      ans = JSON.parse(rf.answer);
                    } catch (e) {
                    }
                    $("#gps_sess" + i).val(rf.answer);
                    console.log("set previos gps value");
                  }
                  if (f.lesson_type == "email_verify") {
                    $("input[name=email_verify_" + i).val(rf.answer);
                  }
                }
              });
            });
          }
        )
        .done((res) =>
          console.log("🚀 ~ file: slide.js ~ line 727 ~ res", res)
        )
        .fail((err) => console.log("Invitation err", err));
      }
      if (total_slides && flashcards[0].lesson_type == "user_gps") {
        handle_gps_click();
        document.addEventListener("gpsPosition", (d) => {
          console.log("pos", CURRENT_POSITION, CURRENT_POSITION_LOW);
          let lat = CURRENT_POSITION
            ? CURRENT_POSITION.coords.latitude
            : CURRENT_POSITION_LOW.coords.latitude;
          let long = CURRENT_POSITION
            ? CURRENT_POSITION.coords.longitude
            : CURRENT_POSITION_LOW.coords.longitude;
          $("#lat_0").val(lat);
          $("#long_0").val(long);
        });
      }
    }
  );

  setTimeout(function() {
    $("body").css('display', 'block')
  }, 1000);
}

function handleVideoUpload(key, data) {
  var les_id_video;
  var classLists_video = $(data).attr("class").split(/\s+/);
  var class_video = classLists_video.filter(name => name.includes('className_'))
  les_video = class_video[0].split("_")
  les_id_video = les_video[1]
  function search(les_id_video, loaded_flashcards){
    for (var i=0; i < loaded_flashcards.length; i++) {
      if (loaded_flashcards[i].id == les_id_video) {
        current_flashcard = loaded_flashcards[i]
        flashcard_id = loaded_flashcards[i].id
        console.log("🚀 ~ file: slide.js ~ line 191 ~ nextSlide ~ loaded_flashcards[i]", loaded_flashcards[i])
        break;
      }
    }
  }

  search(les_id_video, loaded_flashcards)
  var file = $("#myFile").prop("files");
  console.log("🚀 ~ file: index.html ~ line 33 ~ handleVideoUpload ~ file",file[0]);
  GLOBAL_FILE = file[0];
  var form = new FormData();
  form.append("file", GLOBAL_FILE);

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "profile/upload",
    method: "POST",
    type: "POST",
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    data: form,
    headers: {
      Authorization: Bearer localStorage.getItem("token"),
    },
  };

  console.log(settings);
  $.ajax(settings)
    .done(function (response) {
      console.log("🚀 ~ file: index.html ~ line 57 ~ response", response);
      if (response.message == "No file provided!") {
        swal({
          title: "File Not Select",
          text: response.message,
          icon: "warning",
          timer: 1000,
        });
      } else {
        console.log("this is else part");
        swal({
          title: "Good job!",
          text: "Video uploaded successfully!",
          icon: "success",
          timer: 1000,
        });
        const file_url = response.file_url;
        displayVideo(file_url, data);

        function displayVideo(file_url, data) {
          if (file_url) {
            if (key == "user_video_upload") {
              var strTYPE = "video/mp4";
              $("#user-video-tag").css("display", "block");
              $("#user-video-tag").append(
                '<source src="' +
                  file_url +
                  '#t=0.5" type="' +
                  strTYPE +
                  '"></source>'
              );
              $("#user-video-tag")[0].load();
            } else {
              var strTYPE = "video/mp4";
              $("#myCarousel #video").val(file_url);
              $("#myCarousel #flashcard_" + flashcard_id + "").append(
                '<div id="video_url"><p> Video URL : ' +
                  file_url +
                  '</p><video id="videoplayer" style="width:100%"; controls preload="metadata"> <source src="' +
                  file_url +
                  "#t=0.5" +
                  '" type="' +
                  strTYPE +
                  '"></source></video></div>'
              );

              $("#videoplayer")[0].load();
            }
          }
          nextSlide(data)
        }
      }
    })
    .fail(function (error) {
      console.log("🚀 ~ file: index.html ~ line 56 ~ error", error);
      swal({
        title: "Error!",
        text: "Video upload failed!",
        icon: "warning",
        timer: 1000,
      });
    });
}

function handleImageUpload(key, id, data) {
  var file = $(`#image_upload_${id}`).prop("files");
  console.log("🚀 ~ file: slide.js ~ line 929 ~ handleImageUpload ~ file",file[0]);
  GLOBAL_FILE = file[0];
  var form = new FormData();
  form.append("file", GLOBAL_FILE);

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "profile/upload",
    method: "POST",
    type: "POST",
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    data: form,
    headers: {
      Authorization: Bearer localStorage.getItem("token"),
    },
  };

  console.log(settings);
  $.ajax(settings)
    .done(function (response) {
      console.log("🚀 ~ file: slide.js ~ line 951 ~ response", response);
      if (response.message == "No file provided!") {
        swal({
          title: "File Not Select",
          text: response.message,
          icon: "warning",
          timer: 1000,
        });
      } else {
        console.log("this is else part");
        swal({
          title: "Good job!",
          text: "Video uploaded successfully!",
          icon: "success",
          timer: 1000,
        });
        const file_url = response.file_url;
        displayImage(file_url, data);

        function displayImage(file_url, data) {
          if (file_url) {
            if (key == "user_image_upload") {
              $(`#user-image-display_${id}`).css("display", "block");
              $(`#user-image-display_${id}`).attr("src", file_url);
            }
          }
          nextSlide(data)
        }
      }
    })
    .fail(function (error) {
      console.log("🚀 ~ file: index.html ~ line 56 ~ error", error);
      swal({
        title: "Error!",
        text: "Video upload failed!",
        icon: "warning",
        timer: 1000,
      });
    });
}

function qrcodeResponse(data){
  $("#main").html("")
  $.ajax({
    async: true,
    url: SERVER + "courses_api/qrcode",
    type: "POST",
    crossDomain: true,
    crossOrigin: true,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    processData: false,
    success: function (responseqrcode) {
      var base64img = "data:image/png;base64," + responseqrcode;
      Base64ToImage(base64img, function(img) {
        document.getElementById('main').appendChild(img);   
      });
    },
    error: function (res) {
      console.log("🚀 ~ file: slide.js ~ line 1766 ~ flashcards.forEach ~ res", res)
    },
  });
}

function Base64ToImage(base64img, callback) {
  var img = new Image();
  img.onload = function() {
    callback(img);
  };
  img.src = base64img;
}

var data = {};
var dist_array = [];
var interval;
var CURRENT_POSITION = null;

function start() {
  $(document).delegate("#start_session", "click", function(e) {
    $("#start_session").hide();
    $("#stop_session").show();
    $('#distance').html('');
    $('#livedata').html('');

    var start_session_time = new Date();
    const out = document.getElementById("livedata");

    interval = setInterval(function() {
      var interval_time = new Date();
      
      var diffInMilliSeconds = Math.round(Math.abs(interval_time - start_session_time) / 1000);
      const diff = timeConvCalc(diffInMilliSeconds);
      a = diff.split(": ");
      const total_time = ((parseInt(a[0]))*60*60) + ((parseInt(a[1]))*60) + parseInt(a[2]);

      dist_array.push(data['latitude']);
      dist_array.push(data['longitude']);
      var lat1 = dist_array[0];
      var lon1 = dist_array[1];
      var lat2 = data['latitude'];
      var lon2 = data['longitude'];
      const dista = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
      
      avg_speed = (dista *1000) / total_time;

      const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
      const newElement = document.createElement("div");
      newElement.textContent = format("Total Distance : ", dista, 'Speed :', avg_speed, "Total Time :", diff);
      out.appendChild(newElement)
      if (isScrolledToBottom) {
        out.scrollTop = out.scrollHeight - out.clientHeight;
      }

      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = deg2rad(lat2-lat1);
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
      }

      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }
    }, 1000);
    
    function format () {
      return Array.prototype.slice.call(arguments).join(' ');
    }

    $(document).ready(function () {
      $.ajax({
        url: SERVER + "courses_api/member_session_start",
        async: true,
        crossDomain: true,
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        processData: false,
        headers: {
          Authorization: Bearer localStorage.getItem('user-token'),
        },
        success: function (response) {
          console.log("🚀 ~ file: gps_session.html ~ line 1856 ~ response", response.status);
        },
        error: function (err) {
          console.log("🚀 ~ file: gps_session.html ~ line 1859 ~ err", err);
        },
      });
    });
  });

  $(document).delegate("#stop_session", "click", this ,function(e) {
    $("#start_session").show();
    $("#stop_session").hide();
    clearInterval(interval);
    div_name = this

    $(document).ready(function () {
      $.ajax({
        url: SERVER + "courses_api/member_session_stop",
        async: true,
        crossDomain: true,
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        processData: false,
        headers: {
          Authorization: Bearer localStorage.getItem('user-token'),
        },
        success: function (response) {
          console.log("🚀 ~ file: gps_session.html ~ line 1884 ~ response", response);
          gps_response = response;
          nextSlide(div_name)
          $('#distance').append("<h2>Total Distance : "+ response.distance +" km</h2><h2>Averege Speed : "+ 
                                  response.avg_speed + " m/s</h2><h2>Total Time : "+ timeConvCalc(response.total_time) +"</h2>");
        },
        error: function (err) {
          console.log("🚀 ~ file: gps_session.html ~ line 1889 ~ err", err);
        },
      });
    });
  });
}

function timeConvCalc(diffInMilliSeconds) {
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  let difference = '';
  if (days > 0) {
    difference += (days === 1) ? `${days}: ` : `${days}: `;
  }
  difference += (hours === 0 || hours === 1) ? `${hours}: ` : `${hours}: `;
  difference += (minutes === 0 || hours === 1) ? `${minutes}: ` : `${minutes}: `;
  difference += (diffInMilliSeconds === 0 || minutes === 1 || hours === 1 ) ? `${diffInMilliSeconds}` : `${diffInMilliSeconds}`;

  return difference;
}

var geo_options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 2700,
};

function geo_error(err) {
  if (
    err.code == 1 ||
    err.code == err.PERMISSION_DENIED ||
    err.code == err.UNKNOWN_ERROR
  ) {
      alert("GPS error");
  }
  console.log("errror no gps");
  console.warn("ERROR(" + err.code + "): " + err.message);
}
  
function geo_success(position) {
  CURRENT_POSITION = position;
  console.log(position.coords.latitude + " " + position.coords.longitude);
  data['latitude'] = position.coords.latitude;
  data['longitude'] = position.coords.longitude;
}
  
navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);

let accelerometer = null;
try {
  accelerometer = new Accelerometer({ frequency: 60 });
  accelerometer.onerror = (event) => {
    if (event.error.name === 'NotAllowedError') {
      console.log('Permission to access sensor was denied.');
    } else if (event.error.name === 'NotReadableError') {
      console.log('Cannot connect to the sensor.');
    }
  };
  accelerometer.addEventListener('reading', () => {
    console.log("Acceleration along the X-axis " + acl.x);
    console.log("Acceleration along the Y-axis " + acl.y);
    console.log("Acceleration along the Z-axis " + acl.z);
  });
  accelerometer.start();
} catch (error) {
  if (error.name === 'SecurityError') {
    console.log('Sensor construction was blocked by the Permissions Policy.');
  } else if (error.name === 'ReferenceError') {
    console.log('Sensor is not supported by the User Agent.');
  } else {
    throw error;
  }
}
window.addEventListener("DOMContentLoaded", start, false);
window.addEventListener("DOMContentLoaded", init, false);

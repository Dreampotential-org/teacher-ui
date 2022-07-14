var answer = "";
var signature = "";
var current_slide = 0;
var total_slides = 0;
var loaded_flashcards = null;
var pct = 0;
var completed = false;
var signature = [];
var phone_verification_status = false;
var session_id = null;
var user_tour_array = [];
var tempMap = 0;
var gps_response;
let api;

function updateProgressBar() {
  pct = (current_slide / total_slides) * 100;
  $(".progress-bar").css("width", pct + "%");
  $(".progress-bar").attr("aria-valuenow", pct);
  $("#progress").html(current_slide + " out of " + total_slides);
}

function updateSign(data_, event, imgId, signInput) {
  console.log("yo", event, event.target.parentNode);
  if (event && data_) {
    console.log($("#flashcard_" + current_slide).find("#" + imgId)[0]);
    $("#flashcard_" + current_slide)
      .find("#" + imgId)
      .attr("src", data_);
    $("#flashcard_" + current_slide)
      .find("#" + imgId)
      .removeAttr("hidden");
    $("#flashcard_" + current_slide)
      .find("#" + signInput)
      .val(data_);
    $("#flashcard_" + current_slide)
      .find("button.btn")
      .text("Redraw Signature");
  }
  document.removeEventListener("signatureSubmitted", (e) => {});
  window.currentSignature = undefined;
}

function signLesson(event, imgId, signInput) {
  if ($("#signature")) {
    $("#signature").modal("show");
  }

  document.addEventListener("signatureSubmitted", function (e) {
    if (window.currentSignature)
      updateSign(
        JSON.parse(JSON.stringify(window.currentSignature)).data,
        event,
        imgId,
        signInput
      );
  });
}

function sendResponse(flashcard_id, answer) {
  console.log("response....", flashcard_id, answer);
  var current_flashcard = loaded_flashcards[current_slide - 1];
  console.log(
    "current_flashcard.lesson_type => ",
    current_flashcard.lesson_type
  );
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
      navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
      var data_ = {
        flashcard: flashcard_id,
        session_id: localStorage.getItem("session_id"),
        answer: answer ? answer : "",
        latitude:
          CURRENT_POSITION != null ? CURRENT_POSITION.coords.latitude : "",
        longitude:
          CURRENT_POSITION != null ? CURRENT_POSITION.coords.longitude : "",
      };
    } else {
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
        url:
          SERVER +
          "courses_api/session/event/" +
          flashcard_id +
          "/" +
          sessionId,
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
    error: function (res) {},
  });
}

function updateMeta(type, answer) {
  if (type == "name") {
    swal({ title: "setting up name to " + answer });
  }
}

function checkEmptyResponse(slideIndex, flashCardType) {
  switch (flashCardType) {
    case "question_choices":
      answer = $("input[name= choices_" + (slideIndex) + "]:checked").val();
      break;
    case "title_textarea":
      answer = $("textarea[name= textarea_" + (slideIndex) + "]").val();
      break;
    case "title_text":
      answer = $("input[name= text_" + (slideIndex) + "]").val();
      break;
    case "question_checkboxes":
      answer = $("input[name= checkboxes_" + (slideIndex) + "]:checked").val();
      break;
    case "title_input":
      answer = $(
        "textarea[name= title_input_" + (slideIndex) + "]"
      ).val();
      break;
    case "signature":
      answer = $(
        "input[name= input_signature_" + (slideIndex) + "]"
      ).val();
      break;
    case "name_type":
      answer = $("input[name= name_type_" + (slideIndex) + "]").val();
      break;
    case "user_video_upload":
      answer = $("#user-video-tag").find("source").attr("src");
      break;
    case "user_image_upload":
      answer = $(`#user-image-display_${flashcard_id}`).attr("src");
      break;
    case "user_gps":
      answer = $("#note_" + (slideIndex)).val();
      break;
    case "email_verify":
      answer = $("input[id= email_address]").val();
      break;
    case "gps_session":
      break;
    case "verify_phone":
      answer = $("input[id=phone_number]").val();
      break;
    case "datepicker":
      answer = $("#datepicker").val();
      break;
    case "jitsi_meet":
      break;
    default:
      return true;
  }
  if (!answer){
    document.getElementById("theSlide").style.color = "red";
    return true
  }
  return false
}

function nextSlide() {
  var lesson_id = getParam("lesson_id");
  const this_slide = getParam("this_slide");
  if (current_slide < total_slides) {
    var current_flashcard = loaded_flashcards[current_slide];
    document.getElementById("theSlide").style.color = null;
    if (current_flashcard.is_required == true) {
      if (checkEmptyResponse(current_slide, current_flashcard.lesson_type)){
        return
      }
    }
    current_slide++;
    completed = false;
    if (current_slide == total_slides) {
      $("#nextButton").html("Submit");
    }
  } else {
    completed = true;
    $(document).ready(function () {
      $.ajax({
        url: SERVER + "lesson_notifications/lesson/notify/" + lesson_id,
        async: true,
        crossDomain: true,
        crossOrigin: true,
        type: "POST",
        // headers: { Authorization: `Token ${localStorage.getItem("user-token")}` },
      })
        .done((response) => {
          console.log(
            "🚀 ~ file: slide.html ~ line 240 ~ response",
            response
          );
        })
        .fail((err) => {
          console.log("🚀 ~ file: slide.html ~ line 245 ~ errorss", err);
        });
    });
    swal({
      title: "Submitted",
      text: "You have successfully completed the lesson. Thank you.",
      icon: "success",
      timer: 2000,
    });
  }
  console.log(loaded_flashcards);
  var current_flashcard = loaded_flashcards[current_slide - 1];
  console.log(current_flashcard);
  current_flashcard = current_flashcard.id
    ? current_flashcard
    : loaded_flashcards[current_slide - 2];
  var flashcard_id = current_flashcard.id;
  console.log(current_flashcard.lesson_type);
  updateProgressBar();

  if (!completed) {
    var type = current_flashcard.lesson_type;
    console.log("SLIDE JS TYPE ===> ", type);

    if (type == "question_choices") {
      answer = $(
        "input[name= choices_" + (current_slide - 1) + "]:checked"
      ).val();
      console.log(answer);
      sendResponse(flashcard_id, answer);
    } else if (type == "question_checkboxes") {
      let answer = [];
      $("input[name= checkboxes_" + (current_slide - 1) + "]:checked").each(
        (j, k) => {
          answer.push(k.value);
        }
      );
      console.log(answer.join(","));
      sendResponse(flashcard_id, answer.join(","));
    } else if (type == "title_textarea") {
      answer = $("textarea[name= textarea_" + (current_slide - 1) + "]").val();
      sendResponse(flashcard_id, answer);
    } else if (type == "title_input") {
      answer = $(
        "textarea[name= title_input_" + (current_slide - 1) + "]"
      ).val();
      console.log("title inpt");
      sendResponse(flashcard_id, answer);
    } else if (type == "signature") {
      answer = $(
        "input[name= input_signature_" + (current_slide - 1) + "]"
      ).val();
      sendResponse(flashcard_id, answer);
    } else if (type == "name_type") {
      answer = $("input[name= name_type_" + (current_slide - 1) + "]").val();
      sendResponse(flashcard_id, answer);
    } else if (type == "user_video_upload") {
      answer = $("#user-video-tag").find("source").attr("src");
      sendResponse(flashcard_id, answer);
    } else if (type == "user_image_upload") {
      answer = $(`#user-image-display_${flashcard_id}`).attr("src");
      sendResponse(flashcard_id, answer);
    } else if (type == "user_gps") {
      answer = $("#note_" + (current_slide - 1)).val();
      sendResponse(flashcard_id, answer);
      document.removeEventListener("gpsPosition", () => {});
    } else if (type == "gps_session") {
      answer = gps_response;
      sendResponse(flashcard_id, answer);
    } else if (type == "email_verify") {
      answer = $("input[id= email_address]").val();
      sendResponse(flashcard_id, answer);
    } else if (type == "verify_phone") {
      answer = $("input[id=phone_number]").val();
      sendResponse(flashcard_id, answer, current_flashcard);
    } else if (type == "datepicker") {
      answer = $("#datepicker").val();
      sendResponse(flashcard_id, answer);
    } else if (type == "jitsi_meet") {
      api.dispose();
    }
    else if (type == "contact_form") {
      answer = {};
      $('#flashcard_'+(current_slide-1)).find('form').serializeArray().forEach(entry=>{
        answer[entry.name] = entry.value;
      });
      console.log(answer);
      sendResponse(flashcard_id, JSON.stringify(answer));
    }

    if (
      current_slide != total_slides &&
      loaded_flashcards[current_slide].lesson_type == "user_gps"
    ) {
      handle_gps_click();
      document.addEventListener("gpsPosition", (d) => {
        console.log("pos", CURRENT_POSITION, CURRENT_POSITION_LOW);
        let lat = CURRENT_POSITION
          ? CURRENT_POSITION.coords.latitude
          : CURRENT_POSITION_LOW.coords.latitude;
        let long = CURRENT_POSITION
          ? CURRENT_POSITION.coords.longitude
          : CURRENT_POSITION_LOW.coords.longitude;
        $("#lat_" + current_slide).val(lat);
        $("#long_" + current_slide).val(long);
      });
    } else if (type == "user_gps") {
      console.log("User-GPS slide page");
      answer = $("#note_" + (current_slide - 1)).val();
      sendResponse(flashcard_id, answer);
    }
    if (
      current_slide != total_slides &&
      loaded_flashcards[current_slide].lesson_type == "jitsi_meet"
    ) {
      startJitsiMeet(loaded_flashcards[current_slide]);
    }
    $("#myCarousel").carousel("next");
  }
}

function prevSlide() {
  if (current_slide > 0) {
    current_slide--;
    $("#nextButton").html("Next");
  }
  var current_flashcard = loaded_flashcards[current_slide + 1];
  console.log(current_flashcard);
  if (current_flashcard) {
    if (current_flashcard.lesson_type == "jitsi_meet") {
      api.dispose();
    }
  }
  if (loaded_flashcards[current_slide].lesson_type == "jitsi_meet") {
    startJitsiMeet(loaded_flashcards[current_slide]);
  }

  updateProgressBar();
  console.log(current_slide);
  $("#myCarousel").carousel("prev");
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
    async: false,
    contentType: "application/json",
    success: function (data) {
      phone_verification_status = true;
    },
    error: function (res) {
      phone_verification_status = false;
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
      phone_verification_status = false;
    },
  });
}

function viewMapLocations(tempMap, user_tour_array) {
  console.log("mapppp==>", "#journal-body-tour-" + tempMap);

  $("#journal-body-tour-" + tempMap).html(
    `<div id='gps-view-tour-${tempMap}' style='width:100%;height:450px;'></div>
        `
  );

  console.log("user_tour_array=>", user_tour_array);

  let lat = 0,
    long = 0;
  //question, answer , lat , long

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
          // Create content
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

function verifyPhone(event) {
  if ($("#verify_phone")) {
    $("#verify_phone").modal("show");
  }

  document.addEventListener("phoneVerified", function (e) {
    $("#verify_phone").modal("hide");
    phone_verification_status = true;
  });
}

function verifyEmail(event) {
  if ($("#email_verify")) {
    $("#email_verify").modal("show");
  }

  document.addEventListener("emailVerified", function (e) {
    $("#email_verify").modal("hide");
  });
}

async function startJitsiMeet(flashcard) {
  var domain = "meet.jit.si";
  var options = {
    roomName: flashcard.question,
    // width: 700,
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

// braintree toggle function
function toggleDisplay() {
  var x = document.getElementById("collapseStripe");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function init() {
  $("body").css("display", "none");
  console.log("INIT dom");
  $("#sign-modal").load("signature/index.html");
  $("#verify-phone-modal").load("phone/index.html");
  $("#verify-email-modal").load("email/index.html");
  $("#video-modal").load("video/index.html");
  $("#gps-modal").load("gps/index.html");
  $("#progress-section").hide();
  var lesson_id = getParam("lesson_id");
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if(params.iFrame == 1)
    $("#carouselNav").hide();
  get_session();
  $.get(
    SERVER + "courses_api/slide/read/" + lesson_id,
    function (response, status, xhr) {
      console.log(">>>>>>>>>>>>>> slide", response);
      console.log(response);
      document.title = response.lesson_name
        ? response.lesson_name
        : "Lesson - " + lesson_id;
      total_slides = response.flashcards.length;
      $("#progress-section").show();
      if(params.iFrame == 1){
        $("#carouselNav").hide();
        $("#progress-section").hide();
      }
      $("#progress").html(current_slide + 1 + " out of " + total_slides);
      var flashcards = response.flashcards;
      console.log("🚀 ~ file: slide.js ~ line 343 ~ flashcards", flashcards);
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

      flashcards.forEach(async (flashcard, index) => {
        console.log("flashcard=>", flashcard);
        if (i == 0) {
          className = "item active";
        } else {
          className = "item";
        }
        $("#carousel-indicators").append(
          '<li data-target="#myCarousel" data-slide-to="' +
            i +
            '" class="active"></li>'
        );
        if (flashcard.lesson_type == "braintree_Config") {
          $("#theSlide").append(
            `<div class="
            ${className}
              ">
              <form action="/store/Checkout" method="post" id="payment-form">
              <div id="checkoutMethods">
                <div style="margin: 10px">
                  <h2>Checkout with Braintree</h2>
                  Price of ${flashcard.braintree_item_name}:<input
                  type="text"
                  name="itemPrice"
                  id="itemPrice"
                  value="${flashcard.braintree_item_price}"
                  />
                  <br><br>
                  Item ID :<input
                  type="text"
                  name="item_ID"
                  id="item_ID"
                  value="${flashcard.braintree_item_id}"
                  />
                  <div id="bt-dropin"></div>
                    <!-- Used to display form errors. -->
                    <div id="card-errors" role="alert"></div>
                  </div>
                  <input type="hidden" id="nonce" name="payment_method_nonce" />
                </div>
              
              <button id="checkout">Submit Payment</button>
            </form></div>`
          );

          var braintree_form_data = new FormData();
          console.log(
            "flashcard.braintree_merchant_ID=",
            flashcard.braintree_merchant_ID
          );
          braintree_form_data.append(
            "BT_MERCHANT_ID",
            flashcard.braintree_merchant_ID
          );
          braintree_form_data.append(
            "BT_PUBLIC_KEY",
            flashcard.braintree_public_key
          );
          braintree_form_data.append(
            "BT_PRIVATE_KEY",
            flashcard.braintree_private_key
          );

          var segment_settings_buy_item = {
            async: false,
            crossDomain: true,
            url:
              SERVER +
              "store/segment_client_token/" +
              flashcard.braintree_item_id,
            method: "POST",
            type: "POST",
            processData: false,
            contentType: false,
            data: braintree_form_data,
            headers: {
              Authorization: localStorage.getItem("user-token"),
            },
          };
          $.ajax(segment_settings_buy_item)
            .done(function (braintree_response) {
              console.log(braintree_response);
              $("[id='itemTitle']").html(braintree_response.title);
              $("[id='itemPrice']").html(braintree_response.price);
              $("[id='item_ID']").val(braintree_response.id);
              $("[id='client_token']").val(braintree_response.client_token);

              var form = document.querySelector("#payment-form");
              console.log("form = ", form);
              var client_token = braintree_response.client_token;
              console.log("client_token = ", client_token);
              braintree.dropin.create(
                {
                  authorization: client_token,
                  container: "#bt-dropin",
                },
                function (createErr, instance) {
                  form.addEventListener("submit", function (event) {
                    event.preventDefault();
                    instance.requestPaymentMethod(function (err, payload) {
                      if (err) {
                        console.log("Error", err);
                        return;
                      }

                      document.querySelector("#nonce").value = payload.nonce;

                      var order_form = new FormData();

                      order_form.append("item_ID", $("#item_ID").val());
                      order_form.append("title", $("#itemTitle").text());
                      order_form.append("payment_method_nonce", payload.nonce);
                      order_form.append("itemPrice", $("#itemPrice").text());
                      order_form.append(
                        "user-name",
                        localStorage.getItem("user-name")
                      );
                      order_form.append(
                        "BT_MERCHANT_ID",
                        flashcard.braintree_merchant_ID
                      );
                      order_form.append(
                        "BT_PUBLIC_KEY",
                        flashcard.braintree_public_key
                      );
                      order_form.append(
                        "BT_PRIVATE_KEY",
                        flashcard.braintree_private_key
                      );

                      var settings_add_order = {
                        async: false,
                        crossDomain: true,
                        url: SERVER + "store/segment_checkout",
                        method: "POST",
                        type: "POST",
                        processData: false,
                        contentType: false,
                        mimeType: "multipart/form-data",
                        data: order_form,
                        headers: {
                          Authorization: localStorage.getItem("user-token"),
                        },
                      };
                      $.ajax(settings_add_order)
                        .done(function (checkout_response) {
                          console.log(checkout_response);
                          var resp = JSON.parse(checkout_response);
                          if (resp.success == true) {
                            swal(
                              {
                                title: "Thank you",
                                text: "Your Order id is " + resp.ID,
                                icon: "success",
                              },
                              function (isConfirmed) {
                                if (isConfirmed) {
                                  location.reload();
                                }
                              }
                            );
                          } else {
                            swal(
                              {
                                title: "Try Again",
                                text: "Your Order is not complete.",
                                icon: "error",
                              },
                              function (isConfirmed) {
                                if (isConfirmed) {
                                  location.reload();
                                }
                              }
                            );
                          }
                        })
                        .fail(function (response) {
                          console.log("order is Failed!");
                          swal({
                            title: "Error!",
                            text: "Order is failed!",
                            icon: "warning",
                          });
                        });
                    });
                  });
                }
              );
            })
            .fail(function (response) {
              console.log("Buy item Failed!");
              swal({
                title: "Error!",
                text: "Buy Item is failed!",
                icon: "warning",
              });
            });
        }

        if (flashcard.lesson_type == "verify_phone") {
          $("#theSlide").append(`
            <div class="${className} ${
            i == 0 ? "active" : ""
          }" id="flahscard_${i}" id="verify_phone">
              <div alt="verify_phone">
            
                <input id="phone" placeholder="Enter your phone number" class="form-control" name="verify_phone_${i}" type="tel"></br>
                <button type="submit" onclick="verifyPhone(event)" id="send_sms" >Verify Phone</button>
 
              
              <!-- <script src="build/js/intlTelInput.js"></script> -->
              <script src="../www/css/build/js/intlTelInput.js"></script>
              <script>
              // Vanilla Javascript
              var input = document.querySelector("#phone");
              window.intlTelInput(input,({
                // options here
              }));
          
              $(document).ready(function() {
                  $('.iti__flag-container').click(function() { 
                    var countryCode = $('.iti__selected-flag').attr('title');
                    var countryCode = countryCode.replace(/[^0-9]/g,'')
                    $('#phone').val("");
                    $('#phone').val("+"+countryCode+" "+ $('#phone').val());
                 });
              });
            </script>
              </div>
            </div>
          `);
        }


        // <div alt="verify_phone">
        // <input type="text" hidden name="verify_phone_${i}" id="verifyPhone">
        // <button class="btn btn-primary" type="button" onclick="verifyPhone(event)"> Click To Verify Phone Number</button>
        // <p id="phone_verification_status">${
        //   phone_verification_status ? "verified" : "not verified"
        // }</p>
        // </div>

        if (flashcard.lesson_type == 'stripe_Config') {
          $("#theSlide").append(`
            <div class="${className}" id="flahscard_${i}" id="stripe_payment">
                <h3>Pay to stripe</h3>
                 <form id='stripe-payment-form_${i}'>
                 <div style='margin-top: 2rem;'>
                   <h4>Amount: $${flashcard.stripe_item?.price} ${flashcard.stripe_item?.stripe_recurring_price ? " <small>(Recurring)</small>" : ""}</h4>
                 </div>

                  <div style='margin-top: 1rem;'>
                    <label for='full_name'  >Full Name: </label>
                    <br>
                    <input type='text' name='full_name' id='full_name' placeholder='eg. Jane Doe' />
                  </div>
                  <div style='margin-top: 1rem;'>
                    <label for='email'  style='margin-bottom:0'>Email: </label>
                    <br>
                    <input type='email' name='email' id='email' placeholder='eg. janedoe@example.com' />
                  </div>
                  <div style='margin-top: 1rem;'>
                    <label for='card_number'  style='margin-bottom:0'>Card Number: </label>
                    <br>
                    <input type='number' name='card_number' id='card_number' placeholder='eg.4242424242424242' />
                  </div>
                  <div style='margin-top: 1rem;'>
                    <label for='exp_month' style='margin-bottom:0' >Expiry Date</label>
                    <br>
                    <input type='month' name='exp_mth' id='exp_month' placeholder='eg. Mar 2021' />
                  </div>
                  <div style='margin-top: 1rem;'>
                    <label for='cvc' style='margin-bottom:0' >CVC: </label>
                    <br>
                    <input type='number' max=999 name='cvc' id='cvc' placeholder='eg. 444' />
                  </div>
                 <button type="submit" id='stripe_submit' class="btn btn-primary" style='margin-top: 1rem'>Checkout</button>
                 </form>
            </div>
          `);

          $(`#stripe-payment-form_${i}`).submit(function (event) {
            event.preventDefault();
            $('#stripe_submit').attr('disabled', true);

            const formData =$(this).serializeArray()
            const data = {};
            formData.forEach(({name, value}) => {
              if(name=== 'exp_mth') {
                const yearMth = value.split('-');
                data['expiry_year'] = yearMth[0];
                data['expiry_month'] = yearMth[1];
              } else {
                data[name] = value;
              }
            })

             console.log({data});

          //   $.ajax({
          //     url: SERVER + "store_stripe/checkout/",
          //     type: "POST",
          //     data: data,
          //     headers: {
          //         Authorization: `${localStorage.getItem("user-token")}`,
          //     },
          //     success: (res) => {
          //       if (res) {
          //         console.log('redirecting');
          //         $('#stripe_submit').attr('disabled', true);
          //         window.open(res.redirect, '_blank');
          //       }
          //     },
          //     error: (err) => {
          //       console.log(err)
          //       swal({
          //         title: "Error!",
          //         text: "Payment is failed!",
          //         icon: "warning",
          //       }); console.log(err);
          //     },
          // });

            $.ajax({
              url: SERVER + "store_stripe/pay_stripe/" + flashcard.id + "/",
              type: "POST",
              data: data,
              headers: {
                  Authorization: `${localStorage.getItem("user-token")}`,
              },
              success: (res) => {
                if (res) {
                  console.log(res);
                  swal({
                    title: "Success!",
                    text: "Payment is successful!",
                    icon: "success",
                  })
                }
              },
              error: (err) => {
                console.log(err)
                swal({
                  title: "Error!",
                  text: "Payment is failed!",
                  icon: "warning",
                }); 
              },
          });
          })
        }

        if (flashcard.lesson_type == "chiro_front") {
          $("#theSlide").append(`
            <div class="${className} ${
            i == 0 ? "active" : ""
          }" id="flahscard_${i}" id="chiro_front">
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
          $("#theSlide").append(`
            <div class="${className} ${
            i == 0 ? "active" : ""
          }" id="flahscard_${i}" id="chiro_side">
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
          $("#theSlide").append(`
              <div class="${className} ${
            i == 0 ? "active" : ""
          }" id="flashcard_${flashcard.id}">
                <h1>QR Code</h1>
                <div id="main" ></div>
              </div>
            `);
          qrcodeResponse(lesson_id);
        }

        if (flashcard.lesson_type == "user_qr_url") {
          $("#theSlide").append(`
            <div class="${className} ${i == 0 ? "active" : ""}" id="flashcard_${
            flashcard.id
          }">
              <h1>QR URL</h1>
              <a href="${flashcard.question}" target="_blank">${
            flashcard.question
          }</a>
            </div>
          `);
        }

        if (flashcard.lesson_type == "gps_session") {
          $("#theSlide").append(`
            <div class="${className} ${i == 0 ? "active" : ""}" id="flashcard_${
            flashcard.id
          }">
              <h1>GPS Session</h1>
              <div id="livedata" style="overflow:auto"></div>
              <button class="btn btn-default" id='start_session'>Start Session</button>
              <button class="btn btn-primary active" id='stop_session' style='display:none;'>Stop Session</button> 
              <div id='distance' ></div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "email_verify") {
          $("#theSlide").append(`
            <div class="${className} ${
            i == 0 ? "active" : ""
          }" id="flahscard_${i}" id="email_verify">
              <div alt="email_verify">
                <button class="btn btn-primary" type="button" onclick="verifyEmail(event)"> Click To Verify Email Address </button>
                <p>Verified Email <span id="email_address_info"></span></p>
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "datepicker") {
          $("#theSlide").append(`
            <div class="${className} ${
            i == 0 ? "active" : ""
          }" id="flahscard_${i}" id="datepicker">
              <p>Date: <input type="text" id="datepicker"></p>
            </div>
          `);
          $("#datepicker").datepicker({ dateFormat: "yy-mm-dd" });
        }

        if (flashcard.lesson_type == "jitsi_meet") {
          $("#theSlide").append(`
            <div class="${className} ${i == 0 ? "active" : ""}" id="flashcard_${
            flashcard.id
          }">
              <h4>Join Conference</h4>
              <div class="btn-group btn-toggle" id="join_conference"></div>
            </div>
          `);
        }
        if (flashcard.lesson_type == "record_webcam") {
          $("#theSlide").append(`
            <div class="${className} ${i == 0 ? "active" : ""}" id="flashcard_${
            flashcard.id
          }">
              <h4>Recording Webcam Testing</h4>
              <div class="btn-group btn-toggle" id="recording"> 
                <button class="btn btn-default" id="start_recording">ON</button>
                <button class="btn btn-primary active" id="stop_recording">OFF</button>
              </div>
              <hr>
              <video controls autoplay id="record_webcam"></video>
            </div>
          `);
          // let recording = document.getElementById("start_recording");
          var video = document.querySelector("#record_webcam");
          let start = document.getElementById("start_recording");
          let stop = document.getElementById("stop_recording");
          let options = { mimeType: "video/webm;codecs=vp9" };

          let chunks = [];
          let stream, mediaRecorder;

           function startRecordingWebCam() {

            start.onclick = function() {
              navigator.mediaDevices.getUserMedia({
               audio: true,
               video: true
             })
             .then(stream => {
               window.localStream = stream;
               video.srcObject = stream;
               audio.srcObject = stream;
             })
             .catch((err) => {
               console.log(err);
             });
           };

            // stream = await navigator.mediaDevices.getUserMedia({
            //   video: true,
            //   audio: true,
            // });
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = function (ev) {
              chunks.push(ev.data);
            };
            mediaRecorder.onstop = (ev) => {
              let blob = new Blob(chunks);
              chunks = [];
              // flashcard id, video url from s3
              var file = new File([blob], `${flashcard.id}.mp4`, {
                type: "video",
                lastModified: Date.now(),
              });
              var form = new FormData();
              form.append("file", file);

              var settings = {
                async: true,
                crossDomain: true,
                url: SERVER + "s3_uploader/upload",
                method: "POST",
                type: "POST",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                data: form,
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              };
              $.ajax(settings)
                .done(function (response) {
                  console.log(
                    "🚀 ~ file: index.html ~ line 57 ~ response",
                    response
                  );
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
                    // const file_url = response.file_url;
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
            // stop.classList.add("btn-default");
            console.log("start recording video", mediaRecorder.state);
          });
          stop.onclick = function() {
            localStream.getVideoTracks()[0].stop();
            video.src = '';
            
            localStream.getAudioTracks()[0].stop();
            audio.src = '';
          };
        }

        if (flashcard.lesson_type == "record_screen") {
          $("#theSlide").append(`
            <div class="${className} ${i == 0 ? "active" : ""}" id="flashcard_${
            flashcard.id
          }">
              <h4>Recording Screen</h4>
              <div class="btn-group btn-toggle"> 
                <button class="btn btn-default" id="start_recording_screen">ON</button>
                <button class="btn btn-primary active" id="stop_recording_screen">OFF</button>
              </div>
              <hr>
              <video controls autoplay id="record_screen"></video>
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
                url: SERVER + "s3_uploader/upload",
                method: "POST",
                type: "POST",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                data: form,
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              };
              $.ajax(settings)
                .done(function (response) {
                  console.log(
                    "🚀 ~ file: index.html ~ line 57 ~ response",
                    response
                  );
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
          $("#prevButton").attr("data-type", "quick_read");
          $("#nextButton").attr("data-type", "quick_read");

          $("#theSlide").append(
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
          $("#prevButton").attr("data-type", "title_text");
          $("#nextButton").attr("data-type", "title_text");
          $("#theSlide").append(
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
          $("#prevButton").attr("data-type", "question_choices");
          $("#nextButton").attr("data-type", "question_choices");
          $("#theSlide").append(
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
            $("#theSlide")
              .find("ul")
              .each((a, b, c) => {
                if ($(b).attr("alt") == "question_choices_" + i) {
                  $(b).append(
                    "<br><input type='radio' id='" +
                      valu +
                      "' value='" +
                      valu +
                      "' onclick='radioOnClick(`" +
                      valu +
                      "`)' name='choices_" +
                      i +
                      "'> <label style='font-weight: normal;' for='" +
                      valu +
                      "'>" +
                      valu +
                      "</lable>"
                  );
                }
              });
            if (
              $("#theSlide").find("ul").attr("alt") ===
              "question_choices_" + i
            ) {
            }
          });
        }

        if (flashcard.lesson_type == "question_checkboxes") {
          $("#prevButton").attr("data-type", "question_checkboxes");
          $("#nextButton").attr("data-type", "question_checkboxes");
          $("#theSlide").append(
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
            $("#theSlide")
              .find("ul")
              .each((a, b, c) => {
                if ($(b).attr("alt") == "question_checkboxes_" + i) {
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
                      "</lable>"
                  );
                }
              });
            if (
              $("#theSlide").find("ul").attr("alt") ===
              "question_checkboxes_" + i
            ) {
            }
          });
        }

        if (flashcard.lesson_type == "iframe_link") {
          $("#theSlide").append(
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
          $("#theSlide").append(
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
          $("#theSlide").append(
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
          $("#prevButton").attr("data-type", "user_tour");
          $("#nextButton").attr("data-type", "user_tour");

          user_tour_array = [];

          flashcard.options.forEach(function (res) {
            user_tour_array.push(res);
          });

          tempMap++;
          console.log("response user_tour_array=>", user_tour_array);

          $("#theSlide").append(
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

          $("#theSlide").append(
            `<div class="' +${className} +'"><div class="title_input">
              <div alt="title_input" style=""><h1>GPS Note:</h1>
                <p> ${flashcard.question}</p>
                <div><label>Latitude: </label>
                  <input id="lat_${i}" value="0" disabled>
                </div>
                <div style="margin-top:16px;"><label>Longitude: </label>
                  <input id="long_${i}" value="0" disabled></div>
                  <div class="form-group">
                    <textarea class="form-control" rows="10" name="note" placeholder="note" id="note_${i}"></textarea>
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
          console.log(
            "user_video_upload flashcard.lesson_type ===> ",
            flashcard.lesson_type
          );
          $("#theSlide").append(`
            <div class="${className}">
              <div alt="title_text" style="">
                <h2> ${flashcard.question}</h2>
                <input type="file" class="form-control" value="Choose File" id="myFile" onchange="handleVideoUpload('user_video_upload')"/>
                <video style="max-height:450px;max-width:1000px;display:none; margin:auto"; controls preload="metadata" id="user-video-tag">
                </video>
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "user_image_upload") {
          console.log(
            "user_image_upload flashcard.lesson_type ===> ",
            flashcard.lesson_type
          );
          $("#theSlide").append(`
            <div class="${className}">
              <div alt="title_text" style="">
                <p> ${flashcard.question}</p>
                <input type="file" class="form-control" value="Choose File" id="image_upload_${flashcard.id}" onchange="handleImageUpload('user_image_upload',${flashcard.id})"/> 
                <img style="width:auto; margin:auto; display:none;" id="user-image-display_${flashcard.id}">
              </div>
            </div>
          `);
        }

        if (flashcard.lesson_type == "title_textarea") {
          $("#theSlide").append(
            '<div class="' +
              className +
              '"><div class="title_textarea"><div alt="title_text" style=""><h1> ' +
              flashcard.question +
              '</h1><textarea name ="textarea_' +
              i +
              '" class="form-control" placeholder="Enter you answer here"></textarea></div></div></div>'
          );
        }
        if (flashcard.lesson_type == "title_input") {
          $("#theSlide").append(
            '<div class="' +
              className +
              '"><div class="title_input"><div alt="title_input" style=""><h1> ' +
              flashcard.question +
              '</h1><textarea style="height:100px" name ="title_input_' +
              i +
              '" class="form-control" placeholder="Enter you answer here"></textarea></div></div></div>'
          );
        }

        if (flashcard.lesson_type == "name_type") {
          $("#theSlide").append(
            '<div class="' +
              className +
              '"><div class="name_type"><div alt="name_type" style=""><h1> Enter your name: </h1><input name ="name_type_' +
              i +
              '" class="form-control" placeholder="Enter you name here"></div></div></div>'
          );
        }

        if (flashcard.lesson_type == "signature") {
          $("head").append(
            '<script src="https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js"></script>'
          );
          $("#theSlide").append(`
            <div class="${className}" id="flashcard_${i}">
              <div class="text-center alt="signature">
                <input type="text" hidden name="input_signature_${i}" id="signInput">
                <img id="slide_signature" hidden> </br>
                <button class="btn btn-primary" type="button" onclick="signLesson(event,'slide_signature', 'signInput')"> Click To Sign</button>
              </div>
            </div>
          `);
        }
        else if (flashcard.lesson_type == "contact_form") {
          $("#theSlide").append(`
            <div class="${className} p-4" id="flashcard_${i}">
              <div class="" alt="contact_form">
                <h3 class="center-block text-center"> ${flashcard.question?flashcard.question:'Get Started'} </h3>
                <form method="POST">
                  <div class="form-group">
                    <label for="fullName">FULL NAME</label>
                    <input type="text" class="form-control" id="fullName" name="name" placeholder="You Name">
                  </div>
                  <div class="form-group">
                    <label for="InputEmail1">EMAIL</label>
                    <input type="email" class="form-control" name="email" id="InputEmail1" placeholder="Email">
                  </div>
                  <div class="form-group">
                    <label for="InputPhone">PHONE NUMBER</label>
                    <input type="text" class="form-control" name="phone" id="InputPhone" placeholder="1234567890">
                  </div>
                  <div class="form-group">
                    <label for="InputWEBSITE">WEBSITE</label>
                    <input type="text" class="form-control" name="website" id="InputWebsite" placeholder="https://dreampotential.org">
                  </div>  
                  <button onclick="nextSlide();nextSlide()" type="button" class="btn btn-primary center-block"><b>SUBMIT</b></button>
                </form>
              </div>
            </div>
          `);
          $('#theSlide')[0].style.padding = '2rem';
        }
        i++;
      });
      $("#theSlide").append(
        `<div class="item"><div alt="quick_read" style="background: #d3d3d361;padding: 20%;text-align: center;box-shadow: 2px 2px 9px 3px #958a8ab5;height: 300px;width: 100%;"><h1>Completed <img height="30px" src="https://www.clipartmax.com/png/full/301-3011315_icon-check-green-tick-transparent-background.png"></h1>
          <button type="button" onclick="current_slide=0;$('#myCarousel').carousel('prev');"> Submit another response </button>
        </div></div>`
      );

      if (session_id) {
        console.log(response);
        $.get(
          SERVER +
            "courses_api/lesson/response/get/" +
            lesson_id +
            "/" +
            localStorage.getItem("session_id"),
          function (response) {
            console.log(
              "🚀 ~ file: slide.js ~ line 1510 ~ init ~ response",
              response
            );
            response.forEach(function (rf) {
              console.log("🚀 ~ file: slide.js ~ line 777 ~ rf", rf);
              loaded_flashcards.forEach(function (f, i) {
                console.log("🚀 ~ file: slide.js ~ line 1538 ~ f", f);
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
                    // $('#'+ rf.answer +'[name=choices_' + i + ']').attr('checked', 'checked');
                    $(
                      "input[name=choices_" + i + "][value=" + rf.answer + "]"
                    ).attr("checked", "checked");
                  }

                  if (f.lesson_type == "question_checkboxes") {
                    console.log(rf.answer);
                    rf.answer.split(",").forEach((v) => {
                      if (!v) {
                        v = false;
                      }
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
                      // return false;
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
                    } catch (e) {}
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
  // make load cleanly
  setTimeout(function () {
    $("body").css("display", "block");
  }, 1000);
}

async function responsePromise(braintree_item_id, braintree_form_data) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: SERVER + "store/segment_client_token/" + braintree_item_id,
      type: "POST",
      headers: {
        Authorization: localStorage.getItem("user-token"),
      },
      async: false,
      crossDomain: true,
      processData: false,
      contentType: false,
      data: braintree_form_data,
      success: function (data) {
        // console.log("########### session ########",data.client_token);
        // var session = $.parseJSON(data);
        console.log("########### session ########", data);
        // if (session.is_staff === 1) {
        resolve(data);
        // } else {
        //     resolve(false);
        // }
      },
    });
  });
}
function handleVideoUpload(key) {
  var file = $("#myFile").prop("files");
  console.log(
    "🚀 ~ file: index.html ~ line 33 ~ handleVideoUpload ~ file",
    file[0]
  );
  GLOBAL_FILE = file[0];
  var form = new FormData();
  form.append("file", GLOBAL_FILE);

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "s3_uploader/upload",
    method: "POST",
    type: "POST",
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    data: form,
    headers: {
      Authorization: localStorage.getItem("token"),
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
        displayVideo(file_url);

        function displayVideo(file_url) {
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
              $("#theSlide #flashcard_" + current_slide + "").append(
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

function handleImageUpload(key, id) {
  var file = $(`#image_upload_${id}`).prop("files");
  console.log(
    "🚀 ~ file: slide.js ~ line 929 ~ handleImageUpload ~ file",
    file[0]
  );
  GLOBAL_FILE = file[0];
  var form = new FormData();
  form.append("file", GLOBAL_FILE);

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "s3_uploader/upload",
    method: "POST",
    type: "POST",
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    data: form,
    headers: {
      Authorization: localStorage.getItem("token"),
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
        displayImage(file_url);

        function displayImage(file_url) {
          if (file_url) {
            if (key == "user_image_upload") {
              $(`#user-image-display_${id}`).css("display", "block");
              $(`#user-image-display_${id}`).attr("src", file_url);
            }
          }
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

function qrcodeResponse(data) {
  $("#main").html("");
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
      Base64ToImage(base64img, function (img) {
        document.getElementById("main").appendChild(img);
      });
    },
    error: function (res) {
      console.log(
        "🚀 ~ file: slide.js ~ line 1766 ~ flashcards.forEach ~ res",
        res
      );
    },
  });
}
function Base64ToImage(base64img, callback) {
  var img = new Image();
  img.onload = function () {
    callback(img);
  };
  img.src = base64img;
}

var data = {};
var dist_array = [];
var interval;
var CURRENT_POSITION = null;

function start() {
  $(document).delegate("#start_session", "click", function (e) {
    $("#start_session").hide();
    $("#stop_session").show();
    $("#distance").html("");
    $("#livedata").html("");

    var start_session_time = new Date();
    const out = document.getElementById("livedata");

    interval = setInterval(function () {
      var interval_time = new Date();

      var diffInMilliSeconds = Math.round(
        Math.abs(interval_time - start_session_time) / 1000
      );
      const diff = timeConvCalc(diffInMilliSeconds);
      a = diff.split(": ");
      const total_time =
        parseInt(a[0]) * 60 * 60 + parseInt(a[1]) * 60 + parseInt(a[2]);

      dist_array.push(data["latitude"]);
      dist_array.push(data["longitude"]);
      var lat1 = dist_array[0];
      var lon1 = dist_array[1];
      var lat2 = data["latitude"];
      var lon2 = data["longitude"];
      const dista = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);

      avg_speed = (dista * 1000) / total_time;

      const isScrolledToBottom =
        out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
      const newElement = document.createElement("div");
      newElement.textContent = format(
        "Total Distance : ",
        dista,
        "Speed :",
        avg_speed,
        "Total Time :",
        diff
      );
      out.appendChild(newElement);
      if (isScrolledToBottom) {
        out.scrollTop = out.scrollHeight - out.clientHeight;
      }

      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
      }

      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }
    }, 1000);

    function format() {
      return Array.prototype.slice.call(arguments).join(" ");
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
          Authorization: localStorage.getItem("user-token"),
        },
        success: function (response) {
          console.log(
            "🚀 ~ file: gps_session.html ~ line 1856 ~ response",
            response.status
          );
        },
        error: function (err) {
          console.log("🚀 ~ file: gps_session.html ~ line 1859 ~ err", err);
        },
      });
    });
  });

  $(document).delegate("#stop_session", "click", function (e) {
    $("#start_session").show();
    $("#stop_session").hide();
    clearInterval(interval);

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
          Authorization: localStorage.getItem("user-token"),
        },
        success: function (response) {
          console.log(
            "🚀 ~ file: gps_session.html ~ line 1884 ~ response",
            response
          );
          gps_response = response;
          $("#distance").append(
            "<h2>Total Distance : " +
              response.distance +
              " km</h2><h2>Averege Speed : " +
              response.avg_speed +
              " m/s</h2><h2>Total Time : " +
              timeConvCalc(response.total_time) +
              "</h2>"
          );
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
  let difference = "";
  if (days > 0) {
    difference += days === 1 ? `${days}: ` : `${days}: `;
  }
  difference += hours === 0 || hours === 1 ? `${hours}: ` : `${hours}: `;
  difference += minutes === 0 || hours === 1 ? `${minutes}: ` : `${minutes}: `;
  difference +=
    diffInMilliSeconds === 0 || minutes === 1 || hours === 1
      ? `${diffInMilliSeconds}`
      : `${diffInMilliSeconds}`;

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
  data["latitude"] = position.coords.latitude;
  data["longitude"] = position.coords.longitude;
}

let accelerometer = null;
try {
  accelerometer = new Accelerometer({ frequency: 60 });
  accelerometer.onerror = (event) => {
    if (event.error.name === "NotAllowedError") {
      console.log("Permission to access sensor was denied.");
    } else if (event.error.name === "NotReadableError") {
      console.log("Cannot connect to the sensor.");
    }
  };
  accelerometer.addEventListener("reading", () => {
    console.log("Acceleration along the X-axis " + acl.x);
    console.log("Acceleration along the Y-axis " + acl.y);
    console.log("Acceleration along the Z-axis " + acl.z);
  });
  accelerometer.start();
} catch (error) {
  if (error.name === "SecurityError") {
    console.log("Sensor construction was blocked by the Permissions Policy.");
  } else if (error.name === "ReferenceError") {
    console.log("Sensor is not supported by the User Agent.");
  } else {
    throw error;
  }
}
window.addEventListener("DOMContentLoaded", start, false);
window.addEventListener("DOMContentLoaded", init, false);

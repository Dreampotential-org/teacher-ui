var quick_read_count = 0;
var title_text_count = 0;
var question_choices_count = 0;
var video_file_count = 0;
var image_file_count = 0;
var iframe_link_count = 0;
var verify_phone_count = 0;
var title_textarea_count = 0;
var title_input_count = 0;
var braintree_count = 0;
var question_checkboxes_count = 0;
var question_text_count = 0;
var name_type_count = 0;
var user_video_upload_count = 0;
var user_gps_count = 0;
var sign_count = 0;
var sortArray = [];
var MODE;
var CURRENT_IMAGE_FLASHCARD_TYPE = 0;
var CURRENT_IMAGE_TYPE;
var CURRENT_VIDEO_FLASHCARD_TYPE = 0;
var CURRENT_VIDEO_TYPE;
var pos = 0;
var image_type ="";
var video_type ="";
var data_id_value="";
var video_data_id_value="";

window.addEventListener('DOMContentLoaded', init, false);
var lesson_id = getParam('lesson_id');

function getTotalFlashcardsNumber(){
    return $("#sortable").children().length
}
function selectLesson() {
  var thelesson_id = $('#select_lesson :selected').val();
  window.location.href = '/lesson.html?lesson_id=' + thelesson_id;
}

function getAllLessons() {
  $.ajax({
    url: SERVER + 'courses_api/lesson/all',
    async: true,
    crossDomain: true,
    crossOrigin: true,
    type: 'GET',
    headers: { Authorization: `${localStorage.getItem('user-token')}` },
  }).done((response2) => {
    for (var lesson of response2) {
      $('#select_lesson').append("<option value='" + lesson.id + "'>" + lesson.lesson_name + '</option>');
    }
  });
}

function addChoices(id, value) {
  if (!value) {
    value = '';
  }
  var next_id =
    $('#choices_' + id)
      .children()
      .last()
      .data('id') + 1;
  $('#choices_' + id).append(
    '<div><input type="text" class="form-control" data-id="' +
      next_id +
      '"rows="7" placeholder="Choices" value="' +
      value +
      '"><button onclick="$(this).parent().remove()" class="btn btn-danger">Remove Choice</button></div>'
  );
}

function addCheckboxes(id, value) {
  if (!value) {
    value = '';
  }
  var next_id =
    $('#checkboxes_' + id)
      .children()
      .last()
      .data('id') + 1;

  $('#checkboxes_' + id).append(
    '<div><input type="text" class="form-control" data-id="' +
      next_id +
      '"rows="7" placeholder="Choices" value="' +
      value +
      '"><button onclick="$(this).parent().remove()" class="btn btn-danger">Remove Choice</button></div>'
  );
}

function getParam(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function sortablePositionFunction(isNew, posU) {
  if (!posU) {
    posU = $('#sortable').children().length;
  }
  if (!isNew) {
    $('#sortable').children().last().attr('data-position', posU);
  } else {
    $('#sortable').children().last().attr('data-position', pos);
    pos++;
  }
}

function addSpeedRead(isNew, id, value, posU) {
  if (!isNew) {
    $('#speed_read').find('textarea').html(value);
    $('#speed_read').find('textarea').attr('data-id', id);
  } else {
    $('#speed_read').find('textarea').html('');
  }
  $('#speed_read')
    .find('textarea')
    .attr('name', 'speed_read_' + quick_read_count);
  $('#sortable').append($('#speed_read').html());
  $('#sortable').children().last().attr('id', null);
  sortablePositionFunction(isNew, posU);
  quick_read_count++;
}

function addTitleText(isNew, id, title, text, posU) {
  if (!isNew) {
    $('#title_text').find('input[type=text]').attr('value', title);
    $('#title_text').find('textarea').html(text);
    $('#title_text').find('input[type=text]').attr('data-id', id);
    $('#title_text').find('textarea').attr('data-id', id);
  } else {
    $('#title_text').find('input[type=text]').attr('value', '');
    $('#title_text').find('textarea').html('');
  }
  $('#title_text')
    .find('textarea')
    .attr('name', 'text_' + title_text_count);
  $('#title_text')
    .find('input[type=text]')
    .attr('name', 'title_' + title_text_count);
  $('#sortable').append($('#title_text').html());
  sortablePositionFunction(isNew, posU);

  title_text_count++;
}

function addRecordWebCam(isNew, id, title, text, posU) {
  console.log(isNew, id, title, posU);
  $('#sortable').append($('#record_webcam').html());
  sortablePositionFunction(isNew, posU);

  title_text_count++;
}

function addJitsiMeet(isNew, id, title, text, posU) {
  console.log(isNew, id, title, posU)
  if (!isNew) {
    $('#jitsi_meet').find('input[type=text]').attr('value', title);
    $('#jitsi_meet').find('textarea').html(text);
    $('#jitsi_meet').find('input[type=text]').attr('data-id', id);
    $('#jitsi_meet').find('textarea').attr('data-id', id);
  } else {
    $('#jitsi_meet').find('input[type=text]').attr('value', '');
    $('#jitsi_meet').find('textarea').html('');
  }
  $('#jitsi_meet')
    .find('textarea')
    .attr('name', 'text_' + title_text_count);
  $('#jitsi_meet')
    .find('input[type=text]')
    .attr('name', 'title_' + title_text_count);
  $('#sortable').append($('#jitsi_meet').html());
  sortablePositionFunction(isNew, posU);

  title_text_count++;
}

function addTitleInput(isNew, id, title, text, posU) {
  if (!isNew) {
    $('#title_input').find('textarea').html(title);
    $('#title_input').find('teaxtarea').attr('data-id', id);
  } else {
    $('#title_input').find('textarea').html('');
  }
  $('#title_input')
    .find('textarea')
    .attr('name', 'title_input_textarea_' + title_input_count);
  $('#sortable').append($('#title_input').html());
  sortablePositionFunction(isNew, posU);

  title_input_count++;
}

function addNameType(isNew, id, title, text, posU) {
  if (!isNew) {
    $('#name_type').find('textarea').html(title);
    $('#name_type').find('teaxtarea').attr('data-id', id);
  } else {
    $('#name_type').find('textarea').html('');
  }
  $('#name_type')
    .find('textarea')
    .attr('name', 'name_type_textarea_' + title_input_count);
  $('#sortable').append($('#name_type').html());
  sortablePositionFunction(isNew, posU);

  name_type_count++;
}

function addQuestionChoices(isNew, id, question, choices, image, posU) {
  $('#question_choices')
    .find('input')
    .first()
    .attr('name', 'question_' + question_choices_count);
  if (question_choices_count == 0) {
    $('#question_choices')
      .find('#choices')
      .attr('id', 'choices_' + question_choices_count);
  } else {
    $('#question_choices')
      .find('#choices_' + (question_choices_count - 1))
      .attr('id', 'choices_' + question_choices_count);
  }

  $('#question_choices')
    .find('input')
    .last()
    .attr('name', 'image_' + question_choices_count);
  $('#question_choices')
    .find('button')
    .last()
    .attr('onclick', 'addChoices(' + question_choices_count + ')');
  let tempQC = $('#question_choices').html();

  if (!isNew) {
    $('#question_choices').find('input').first().attr('value', question);
    $('#question_choices').find('input').last().attr('value', image);

    $('#question_choices').find('input').first().attr('data-id', id);
    $('#question_choices').find('input').last().attr('data-id', id);
    $('#choices_' + question_choices_count)
      .find('input')
      .remove();

    choices.map((choice) => {
      addChoices(question_choices_count, choice);
    });
    image_type = "questionChoices";
    // Display image
    displayImage(image,"");
  } else {
    $('#question_choices').find('input').first().attr('value', '');
    $('#question_choices').find('text').html('');
    $('#question_choices').find('input').last().attr('value', '');
  }
  $('#sortable').append($('#question_choices').html());
  sortablePositionFunction(isNew, posU);
  question_choices_count++;
  $('#question_choices').html(tempQC);
}

function addQuestionCheckboxes(isNew, id, question, options, image, posU) {
  $('#question_checkboxes')
    .find('input')
    .first()
    .attr('name', 'question_checkboxes_question_' + question_checkboxes_count);
  if (question_checkboxes_count == 0) {
    $('#question_checkboxes')
      .find('#checkboxes')
      .attr('id', 'checkboxes_' + question_checkboxes_count);
  } else {
    $('#question_checkboxes')
      .find('#checkboxes_' + (question_checkboxes_count - 1))
      .attr('id', 'checkboxes_' + question_checkboxes_count);
  }

  $('#question_checkboxes')
    .find('input')
    .last()
    .attr('name', 'image_' + question_checkboxes_count);
  $('#question_checkboxes')
    .find('button')
    .last()
    .attr('onclick', 'addCheckboxes(' + question_checkboxes_count + ')');
  let tempQ = $('#question_checkboxes').html();

  if (!isNew) {
    $('#question_checkboxes').find('input').first().attr('value', question);
    $('#question_checkboxes').find('input').last().attr('value', image);

    $('#question_checkboxes').find('input').first().attr('data-id', id);
    $('#question_checkboxes').find('input').last().attr('data-id', id);
    $('#checkboxes_' + question_checkboxes_count)
      .find('input')
      .remove();
    options.map((choice) => {
      addCheckboxes(question_checkboxes_count, choice);
    });
    image_type = "questionCheckboxes";
    // Display image
    displayImage(image,"");
  } else {
    $('#question_checkboxes').find('input').first().attr('value', '');
    $('#question_checkboxes').find('text').html('');
    $('#question_checkboxes').find('input').last().attr('value', '');
  }
  $('#sortable').append($('#question_checkboxes').html());
  sortablePositionFunction(isNew, posU);
  question_checkboxes_count++;
  $('#question_checkboxes').html(tempQ);
}

function handleImageUpload(key) {
  image_type = key;//imageFile, questionChoices, questionCheckboxes
  $('#imageUpload').click();
}

//handleImageSelect(this.value)
function handleImageSelect(e) {
  var file = e.files[0];
  if (file) {
    GLOBAL_FILE = file;
    //        $("#imageUploadForm").submit();
    uploadFile('image');
  }
}

function handleVideoUpload(key) {
  video_type = key; //user_video_upload
  // prompt for video upload
  $('#videoUpload').click();
}

//handleVideoSelect(this.value)
function handleVideoSelect(e) {
  var file = e.files[0];
  if (file) {
    GLOBAL_FILE = file;
    //        $("#imageUploadForm").submit();
    uploadFile('video');
  }
}

function uploadFile(fileType) {
  swal({
    title: '0%',
    text: 'File uploading please wait.',
    icon: 'info',
    buttons: false,
    closeOnEsc: false,
    closeOnClickOutside: false,
  });

  var form = new FormData();
  form.append('file', GLOBAL_FILE);

  var settings = {
    async: true,
    //            "crossDomain": true,
    url: SERVER + 's3_uploader/upload',
    method: 'POST',
    type: 'POST',
    processData: false,
    contentType: false,
    mimeType: 'multipart/form-data',
    data: form,
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  $.ajax(settings).done(function (response) {
    swal({
      title: 'Good job!',
      text: 'File uploaded successfully!',
      icon: 'success',
    });

    var form = new FormData();
    form.append('file', GLOBAL_FILE);

    var settings = {
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          'progress',
          function (evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              $('.swal-title').text(parseInt(percentComplete * 100) + '%');
            }
          },
          false
        );
        return xhr;
      },
      async: true,
      crossDomain: true,
      url: SERVER + 's3_uploader/upload',
      method: 'POST',
      type: 'POST',
      processData: false,
      contentType: false,
      mimeType: 'multipart/form-data',
      data: form,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };

    $.ajax(settings)
      .done(function (response) {
        swal({
          title: 'Good job!',
          text: 'File uploaded successfully!',
          icon: 'success',
        });

        response = JSON.parse(response);
        const file_url = response['file_url'];

        if (fileType == 'image') {
          displayImage(file_url,data_id_value);

          if(image_type=="questionChoices"){
            $('#image-question-choices').attr('value', file_url);
          }
          else if(image_type=="questionCheckboxes"){
           $('#image-question-checkboxes').attr('value', file_url);
          }
          else if(image_type=="imageFile"){
            if(data_id_value!=undefined){
              $("input[data-id='"+data_id_value+"']").attr('value', file_url);
            }
            else{
              $('#image-file').attr('value', file_url);
            }


          }

        } else if (fileType == 'video') {
    
          displayVideo(file_url,video_data_id_value);
          
          if(video_type=="user_video_upload"){
            $('#txt-user-video').attr('value', file_url);
          }
          else{
            if(video_data_id_value!=undefined){
              $("input[data-id='"+video_data_id_value+"']").attr('value', file_url);
            }
            else{
              $('#video').attr('value', file_url);
            }
          }
        }
      })
      .fail(function (response) {
        swal({
          title: 'Error!',
          text: 'File upload failed!',
          icon: 'warning',
        });
      });
  });
}

function displayVideo(file_url,video_data_id) {
  var strTYPE = 'video/mp4';
  if(video_type=="user_video_upload"){
   /* $('#userVideoplayer').html('<source src="' + file_url + '#t=0.1' + '" type="' + strTYPE + '"></source>');
    $('#user-video-output').css('display', 'block');
    $('#userVideoplayer')[0].load();
    
    $('#user_video_upload').find('#txt-user-video').first().attr('value',file_url);*/
    // Change button text
    // $('#upload-vid-btn').attr('value', 'Upload new Video');
  }
  else{
   /* $('#videoplayer').html('<source src="' + file_url + '#t=0.5'+ '" type="' + strTYPE + '"></source>');
    $('#video-output').css('display', 'block');
    $('#videoplayer')[0].load();
    $('#upload-vid-btn').attr('value', 'Upload new Video');*/
    //
    if(!file_url){

    }
    else{

     // $("input[data-id='"+video_data_id+"']").parent().siblings('.video-output').html('')
     // var parent = $("input[data-id='"+video_data_id+"']").parent().siblings('.video-output');
      
      if(!video_data_id){
      $('.videoplayer').html('<source src="' + file_url + '#t=0.1'+ '" type="' + strTYPE + '"></source>');
      $('.video-output').css('display', 'block');
      $('.videoplayer')[0].load();
      $('.upload_vid_btn').attr('value', 'Upload new Video');
      }
      else{
      $("input[data-id='"+video_data_id+"']").parent().siblings('.video-output').html(' <video class="videoplayer" controls height="360" style="width: 100%;" preload="metadata"><source src="' + file_url + '#t=0.1'+ '" type="' + strTYPE + '" id="'+video_data_id+'"></source></video>');
      $('.video-output').css('display', 'block');
      $('.videoplayer')[0].load();
      $('.upload_vid_btn').attr('value', 'Upload new Video');
      }
    }
//
  }
}

function displayImage(file_url,data_id) {
  // Clear existing image
  // $('#output').html('');
 //
 if(file_url!=""){
  if(image_type=="questionChoices"){
    $('#output-question-choices').html('');
    var img = $('<img style="width:400px">');
    img.attr('src', file_url);  
    img.appendTo('#output-question-choices');
    $('#upload-img-btn-question-choices').attr('value', 'Upload new Image');
  }
  else if(image_type=="questionCheckboxes"){
    $('#output-question-checkboxes').html('');
    var img = $('<img style="width:400px">');
    img.attr('src', file_url);  
    img.appendTo('#output-question-checkboxes');
    $('#upload-img-btn-question-checkboxes').attr('value', 'Upload new Image');
  }
  else if(image_type=="imageFile"){
    // $('#output-image-file').html('');
    var img = $('<img style="width:400px">');
    img.attr('src', file_url);  
    img.attr('data-id', data_id);
    img.attr('id', data_id);
    if(!data_id)
    {
      img.appendTo('.output-image-file');
    }
    else{
      $("input[data-id='"+data_id+"']").parent().siblings('.output-image-file').html('')
      var parent = $("input[data-id='"+data_id+"']").parent().siblings('.output-image-file');
      img.appendTo(parent);
    }
    //
    // $('.output-image-file').each(function(i, e){
    //   $('<img style="width:400px">')
    //       .attr("id", "id_" + i)
    //       .attr('src', file_url)
    //       .attr('data-id', data_id)
    //       .appendTo(this);
    // });
    //
  }
 }
 //
  /*$('#output-image-file').html('');
  var img = $('<img style="height:100%;width:100%">');
  img.attr('src', file_url);*/
    // img.appendTo('#output');
  /*img.appendTo('#output-image-file');
    // Change button text
   $('#upload-img-btn').attr('value', 'Upload new Image');*/
}

function addIframeLink(isNew, id, question, choices, image, posU) {
  if (!isNew) {
    $('#iframe_link').find('input').first().attr('value', question);
    $('#iframe_link').find('input').last().attr('value', image);

    $('#iframe_link').find('input').first().attr('data-id', id);
    $('#iframe_link').find('input').last().attr('data-id', id);
  } else {
    $('#iframe_link').find('input').first().attr('value', '');
    $('#iframe_link').find('input').last().attr('value', '');
  }

  $('#iframe_link')
    .find('input')
    .first()
    .attr('name', 'question_' + iframe_link_count);
  $('#iframe_link')
    .find('input')
    .last()
    .attr('name', 'link_' + iframe_link_count);

  $('#sortable').append($('#iframe_link').html());
  iframe_link_count++;
  sortablePositionFunction(isNew, posU);
}

function addTitleTextarea(isNew, id, question, posU) {
  console.log('Question Text Added');

  if (!isNew) {
    $('#title_textarea').find('textarea').first().html(question);

    $('#title_textarea').find('textarea').last().attr('data-id', id);
  } else {
    $('#title_textarea').find('textarea').first().html('');
  }

  $('#title_textarea')
    .find('textarea')
    .first()
    .attr('name', 'title_textarea_' + title_textarea_count);
  $('#sortable').append($('#title_textarea').html());

  title_textarea_count++;
  sortablePositionFunction(isNew, posU);
}

function addSignaturePad(isNew, id, sign_data, posU) {
  if (!isNew) {
    $('#sign_b64').find('input').first().val(sign_data);
    $('#sign_b64').find('input').last().attr('data-id', id);
    // $("#sign_b64").find("button").last().html("Redraw Signature")
    $('#sign_b64').find('img').last().attr('src', sign_data);
    $('#sign_b64').find('img').last().attr('hidden', false);
  } else {
  }

  $('#sign_b64')
    .find('input')
    .first()
    .attr('name', 'input_signature_' + sign_count);

  $('#sortable').append($('#sign_b64').html());

  sign_count++;
  sortablePositionFunction(isNew, posU);
}
function addUserVideoUpload(isNew, id, question, choices, image, posU){
  if (!isNew) {
    /*$('#user_video_upload').find('txt-user-video').html(image);
    $('#user_video_upload').find('txt-user-video').attr('data-id', id);*/
    video_type = "user_video_upload";
    // Display Video
    displayVideo(image,"");
  } else {
    $('#user_video_upload').find('txt-user-video').html('');
  }
  $('#user_video_upload')
    .find('myFile')
    .attr('name', 'user_video_upload_myFile_' + title_input_count);

  $('#sortable').append($('#user_video_upload').html());
  sortablePositionFunction(isNew, posU);
  user_video_upload_count++;
}

function addVideoFile(isNew, id, question, choices, image, posU) {
  video_type = "";
  if (!isNew) {
    $('#video_file').find('input').first().attr('value', question);
    $('#video_file').find('input').last().attr('value', image);

    $('#video_file').find('input').first().attr('data-id', id);
    $('#video_file').find('input').last().attr('data-id', id);

    $('#video_file').find('.video-output').attr('data-id', id);
    // Display Video
    // displayVideo(image);
    displayVideo(image,id);
  } else {
    $('#video_file').find('input').first().attr('value', '');
    $('#video_file').find('input').last().attr('value', '');
    //
    // $('.video-output').children('video').children('source').attr('src','');
    displayVideo("","");
    //
  }

  $('#video_file')
    .find('input')
    .first()
    .attr('name', 'video_question_' + video_file_count);
  $('#video_file')
    .find('input')
    .last()
    .attr('name', 'video_' + video_file_count)
    .attr('data-id',$('#video_file').find('input').first().attr('data-id')+"_"+ video_file_count);
    
    /*if(video_file_count > 0)
    {
      $('#sortable').append($('#video_file').html()).find('video').last().remove();
    }
    else{
      $('#sortable').append($('#video_file').html());
    }*/

    if(posU==undefined){
      $('#sortable').append($('#video_file').html()).find('video').last().remove();
    }else{
      $('#sortable').append($('#video_file').html());
    }

  // $('#sortable').append($('#video_file').html());
  video_file_count++;
  sortablePositionFunction(isNew, posU);
}

function addImageFile(isNew, id, question, image, posU) {
  console.log("addImageFile ==> ");
  console.log("isNew, id, question, image, posU ");
  console.log(isNew,' , ' ,id, ' , ' ,question, ' , ' ,image, ' , ' ,posU);
  if (!isNew) {
    $('#image_file').find('input').first().attr('value', question);
    $('#image_file').find('input').last().attr('value', image);

    $('#image_file').find('input').first().attr('data-id', id);
    $('#image_file').find('input').last().attr('data-id', id);
    
    $('#image_file').find('output-image-file').attr('data-id', id);
    image_type = "imageFile";
    // displayImage(image,$('#image_file').find('output-image-file').attr('data-id'));
    displayImage(image,id);
  } else {
    $('#image_file').find('input').first().attr('value', '');
    $('#image_file').find('input').last().attr('value', '');
    // $('#image_file').find('#output-image-file').find('img').attr('src','');
    $('#image_file').find('.output-image-file').find('img').attr('src','');
    image_type = "imageFile";
    displayImage("","");
  }

  $('#image_file')
    .find('input')
    .first()
    .attr('name', 'image_question' + image_file_count);

  $('#image_file')
    .find('input')
    .last()
    .attr('name', 'image_' + image_file_count)
    .attr('data-id',$('#image_file').find('input').first().attr('data-id')+"_"+ image_file_count);

  //
  // $('#image_file')
  //   .find('img')
  //   .last()
  //   .attr('name', 'image_' + image_file_count)
  //   .attr('data-id',$('#image_file').find('input').first().attr('data-id')+"_"+ image_file_count);
  //  

  $('#sortable').append($('#image_file').html());
  image_file_count++;
  sortablePositionFunction(isNew, posU);
}

function addVerifyPhone(isNew, id, question, image, posU) {
  if (!isNew) {
  } else {
    $('#title_textarea').find('textarea').first().html('');
  }

  $('#verify_phone')
    .find('input')
    .first()
    .attr('name', 'verify_phone_' + verify_phone_count);
  $('#sortable').append($('#verify_phone').html());

  verify_phone_count++;
  sortablePositionFunction(isNew, posU);
}

function addUserGps(isNew, id, question, image, posU){
  if (!isNew) {
    // $('#user_gps').find('textarea').first().html(question);
    // $('#user_gps').find('textarea').last().attr('data-id', id);
  } else {
    // $('#user_gps').find('textarea').first().html('');
  }
  $('#sortable').append($('#user_gps').html());
  user_gps_count++;
  sortablePositionFunction(isNew, posU);
  // handle_gps_click();
}

function addBrainTree(isNew, id, merchant_ID, braintree_public_key, braintree_private_key, braintree_item_name, braintree_item_price, posU) {
  if (!isNew) {
    console.log(id, merchant_ID, braintree_public_key, braintree_private_key, braintree_item_name, braintree_item_price, posU);
    $('#brain_tree').find('#braintree_merchant_ID').attr('value', merchant_ID);
    $('#brain_tree').find('#braintree_public_key').attr('value', braintree_public_key);
    $('#brain_tree').find('#braintree_private_key').attr('value', braintree_private_key);
    $('#brain_tree').find('#braintree_item_name').attr('value', braintree_item_name);
    $('#brain_tree').find('#braintree_item_price').attr('value', braintree_item_price);
    //// flash card ID
    $('#brain_tree').find('#braintree_merchant_ID').attr('data-id', id);
    $('#brain_tree').find('#braintree_public_key').attr('data-id', id);
    $('#brain_tree').find('#braintree_private_key').attr('data-id', id);
    $('#brain_tree').find('#braintree_item_name').attr('data-id', id);
    $('#brain_tree').find('#braintree_item_price').attr('data-id', id);
  } else {
    console.log('empty values');
    $('#brain_tree').find('#braintree_merchant_ID').attr('value', '');
    $('#brain_tree').find('#braintree_public_key').attr('value', '');
    $('#brain_tree').find('#braintree_private_key').attr('value', '');
    $('#brain_tree').find('#braintree_item_name').attr('value', '');
    $('#brain_tree').find('#braintree_item_price').attr('value', '');
  }

  $('#brain_tree')
    .find('#braintree_merchant_ID')
    .attr('name', 'braintree_merchant_ID_' + braintree_count);
  $('#brain_tree')
    .find('#braintree_public_key')
    .attr('name', 'braintree_public_key_' + braintree_count);
  $('#brain_tree')
    .find('#braintree_private_key')
    .attr('name', 'braintree_private_key_' + braintree_count);
  $('#brain_tree')
    .find('#braintree_item_name')
    .attr('name', 'braintree_item_name_' + braintree_count);
  $('#brain_tree')
    .find('#braintree_item_price')
    .attr('name', 'braintree_item_price_' + braintree_count);

  $('#sortable').append($('#brain_tree').html());
  braintree_count++;
  sortablePositionFunction(isNew, posU);
}

function sendUpdates() {
  var lesson_name = $('#lesson_name').val();
  var lesson_visiblity = $('#lesson_is_public').prop('checked');
  var meta_attributes = [];
  data_ = {
    lesson_name: lesson_name,
    lesson_is_public: lesson_visiblity,
  };
  var flashcards = [];
  var position_me = 0;
  // Saving Quick Reads
  flashcards_div = [];
  flashcard_body = [];
  current_flashcard_elements = [];
  var attr_array = [];
  position_me = 0;

  if (document.querySelector('#name:checked')) {
    meta_attributes.push('name');
  }

  if (document.querySelector('#email:checked')) {
    meta_attributes.push('email');
  }

  if (document.querySelector('#phone:checked')) {
    meta_attributes.push('phone');
  }

  sortable_div = document.getElementById('sortable').childNodes;
  sortable_div.forEach((flashcard_div) => {
    try {
      if (flashcard_div.getAttribute && flashcard_div.getAttribute('data-position')) {
        flashcards_div.push(flashcard_div);
      }
    } catch (e) {
      console.log(e);
    }
  });

  flashcards_div.forEach((flashcard) => {
    // Prepare the data
    current_flashcard_elements = [];
    flashcard.childNodes.forEach((flashcard_element) => {
      if (flashcard_element.attributes) {
        current_flashcard_elements.push(flashcard_element);
      }
    });

    current_flashcard_elements.shift(); // remove the header
    flashcard_type = flashcard.getAttribute('data-type');
    position_me += 1;
    //current_flashcard_elements has all the fields of current selected flashcard

    if (current_flashcard_elements.length < 4) {
      current_flashcard_elements.forEach((current_flashcard) => {
        this_element = current_flashcard.firstElementChild;
        if(this_element){
          if (this_element.type == 'textarea' || this_element.type == 'text') {
            attr_value = current_flashcard.firstElementChild.value;
            attr_array.push(attr_value);
          } else {
            this_element = current_flashcard.lastElementChild;
            if (this_element.type == 'textarea' || this_element.type == 'text') {
              attr_value = current_flashcard.lastElementChild.value;
              attr_array.push(attr_value);
            }
          }
        }
        
      });
    } else {
      real_flashcard_elements = [];
      current_flashcard_elements.forEach((current_flashcard_element) => {
        if (current_flashcard_element.attributes) {
          real_flashcard_elements.push(current_flashcard_element);
        }
      });
      attr_array[0] = real_flashcard_elements[0].firstElementChild.value;
      choices_array = [];
      //working on choices
      real_flashcard_elements[1].childNodes.forEach((choice) => {
        choice.childNodes.forEach((choice_unit) => {
          if (choice_unit.type == 'text') {
            choices_array.push(choice_unit.value);
          }
        });
      });
      // Selecting the value of image
      real_flashcard_elements[current_flashcard_elements.length - 1].childNodes.forEach((image_upload_element) => {
        if (image_upload_element.type == 'text') {
          attr_array[1] = image_upload_element.value;
        }
      });
    }
    switch (flashcard_type) {
      case 'jitsi_meet':
        temp = {
          lesson_type: 'jitsi_meet',
          question: attr_array[0],
          position: position_me,
        };
        flashcards.push(temp);
        break;
      case 'record_webcam':
        temp = {
          lesson_type: 'record_webcam',
          question: attr_array[0],
          position: position_me,
        };
        flashcards.push(temp);
        break;
        
      case 'speed_read':
        temp = {
          lesson_type: 'quick_read',
          question: attr_array[0],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'title_text':
        temp = {
          lesson_type: 'title_text',
          question: attr_array[0],
          answer: attr_array[1],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'title_input':
        temp = {
          lesson_type: 'title_input',
          question: attr_array[0],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'iframe_link':
        temp = {
          lesson_type: 'iframe_link',
          question: attr_array[0],
          image: attr_array[1],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'title_textarea':
        temp = {
          lesson_type: 'title_textarea',
          question: attr_array[0],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'image_file':
        temp = {
          lesson_type: 'image_file',
          question: attr_array[0],
          image: attr_array[1],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'video_file':
        temp = {
          lesson_type: 'video_file',
          question: attr_array[0],
          image: attr_array[1],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'question_choices':
        temp = {
          lesson_type: 'question_choices',
          question: attr_array[0],
          options: choices_array,
          image: attr_array[1],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'question_checkboxes':
        temp = {
          lesson_type: 'question_checkboxes',
          question: attr_array[0],
          options: choices_array,
          image: attr_array[1],
          position: position_me,
        };
        flashcards.push(temp);
        break;
      case 'signature':
        temp = {
          lesson_type: 'signature',
          position: position_me,
        };
        flashcards.push(temp);
        break;
      case 'name_type':
        temp = {
          lesson_type: 'name_type',
          question: attr_array[0],
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'verify_phone':
        temp = {
          lesson_type: 'verify_phone',
          position: position_me,
        };
        flashcards.push(temp);
        break;

      case 'user_video_upload':
          temp = {
          lesson_type: 'user_video_upload',
          question: 'User Video Upload',
          // image: attr_array[0],
          image: '',
          position: position_me,
          };
          flashcards.push(temp);
          break;

     case 'user_gps':
        temp = {
          lesson_type: 'user_gps',
          // question: attr_array[0],
          question: 'User GPS',
          // latitude:CURRENT_POSITION.coords.latitude,
          // longitude:CURRENT_POSITION.coords.longitude,
          position: position_me,
        };
        flashcards.push(temp);
        break; 
    }

    attr_array = [];
  });
  data_.flashcards = flashcards;
  data_.meta_attributes = meta_attributes.join(',');

  if (MODE == 'CREATE') {
    $.ajax({
      url: SERVER + 'courses_api/lesson/create',
      data: JSON.stringify(data_),
      type: 'POST',
      contentType: 'application/json',
      headers: { Authorization: `${localStorage.getItem('user-token')}` },
      success: function (data) {
        var currentPathName = window.location.pathname;
        window.location.replace(currentPathName + '?lesson_id=' + data.id);
        swal({
          title: 'Lesson Created',
          text: 'You have successfully created a lesson',
          icon: 'success',
          timer: 2000,
        });
      },
      error: (err) => {
        swal({
          title: 'Error Creating Lesson',
          text: err,
          icon: 'error',
        });
      },
    });
  } else {
    $.ajax({
      url: SERVER + 'courses_api/lesson/update/' + lesson_id + '/',
      data: JSON.stringify(data_),
      type: 'POST',
      headers: { Authorization: `${localStorage.getItem('user-token')}` },
      contentType: 'application/json',
      success: function (data) {
        swal({
          title: 'Lesson Updated',
          text: 'You have updated created a lesson',
          icon: 'success',
          timer: 2000,
        });
      },
      error: function (err) {
        swal({
          title: 'Error Creating Lesson',
          text: err.responseJSON.msg,
          icon: 'error',
        });
      },
    });
  }
}

$(document).ready(function () {
  $('#left-sidebar').load('sidebar.html');
  $('#page-header').load('header.html');
  if (!localStorage.getItem('user-token')) {
    $('#is_public_contanier').hide();
    $('button').hide();
  }
  if (lesson_id) {
    MODE = 'UPDATE';
  } else {
    MODE = 'CREATE';
  }
  const param = new URL(window.location.href);
  const params = param.searchParams.get('params');
  if (MODE == 'UPDATE') {
    $.ajax({
      url: SERVER + 'courses_api/lesson/read/' + lesson_id,
      type: 'GET',
      crossDomain: true,
      contentType: 'application/json',
      headers: { Authorization: `${localStorage.getItem('user-token')}` },
      success: function (response) {
        if (params) {
          $('#lesson_slide').attr('href', `/slide.html?lesson_id=${lesson_id}&params=${params}`);
        } else {
          $('#lesson_slide').attr('href', '/slide.html?lesson_id=' + lesson_id);
        }
        $('#lesson_responses').attr('href', '/lesson_responses.html?lesson_id=' + lesson_id);

        $('#lesson_name').val(response.lesson_name);
        $('#lesson_is_public').prop('checked', response.lesson_is_public);
        $('title').text(response.lesson_name + ' - edit..');

        var flashcards = response.flashcards;
        //Updating meta
        var recieved_meta = response.meta_attributes;

        if (recieved_meta.includes('name')) {
          document.getElementById('name').checked = true;
        }

        if (recieved_meta.includes('email')) {
          document.getElementById('email').checked = true;
        }

        if (recieved_meta.includes('phone')) {
          document.getElementById('phone').checked = true;
        }

        flashcards.sort(function (a, b) {
          keyA = a.position;
          keyB = b.position;
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        flashcards.forEach((flashcard) => {
          if (pos < flashcard.position) {
            pos = flashcard.position + 1;
          }

          if (flashcard.lesson_type == 'quick_read') {
            addSpeedRead(false, flashcard.id, flashcard.question, flashcard.position);
          }

          if (flashcard.lesson_type == 'title_text') {
            addTitleText(false, flashcard.id, flashcard.question, flashcard.answer, flashcard.position);
          }
          if (flashcard.lesson_type == 'BrainTree') {
            console.log(
              flashcard.id,
              flashcard.braintree_merchant_ID,
              flashcard.braintree_public_key,
              flashcard.braintree_private_key,
              flashcard.braintree_item_name,
              flashcard.braintree_item_price,
              flashcard.position
            );
            addBrainTree(
              false,
              flashcard.id,
              flashcard.braintree_merchant_ID,
              flashcard.braintree_public_key,
              flashcard.braintree_private_key,
              flashcard.braintree_item_name,
              flashcard.braintree_item_price,
              flashcard.position
            );
          }
          if (flashcard.lesson_type == 'jitsi_meet') {
            addJitsiMeet(false, flashcard.id, flashcard.question, flashcard.answer, flashcard.position);
          }
          if (flashcard.lesson_type == 'record_webcam') {
            addRecordWebCam(false, flashcard.id, flashcard.question, flashcard.answer, flashcard.position);
          }
          if (flashcard.lesson_type == 'title_input') {
            addTitleInput(false, flashcard.id, flashcard.question, flashcard.answer, flashcard.position);
          }

          if (flashcard.lesson_type == 'question_choices') {
            addQuestionChoices(false, flashcard.id, flashcard.question, flashcard.options, flashcard.image, flashcard.position);
          }

          if (flashcard.lesson_type == 'name_type') {
            addNameType(false, flashcard.id, flashcard.question, flashcard.options, flashcard.position);
          }

          if (flashcard.lesson_type == 'question_checkboxes') {
            addQuestionCheckboxes(false, flashcard.id, flashcard.question, flashcard.options, flashcard.image, flashcard.position);
          }

          if (flashcard.lesson_type == 'video_file') {
            addVideoFile(false, flashcard.id, flashcard.question, flashcard.options, flashcard.image, flashcard.position);
          }

          if (flashcard.lesson_type == 'image_file') {
            addImageFile(false, flashcard.id, flashcard.question, flashcard.image, flashcard.position);
          }

          if (flashcard.lesson_type == 'iframe_link') {
            addIframeLink(false, flashcard.id, flashcard.question, flashcard.options, flashcard.image, flashcard.position);
          }
          if (flashcard.lesson_type == 'title_textarea') {

            addTitleTextarea(false, flashcard.id, flashcard.question, flashcard.position);
          }

          if (flashcard.lesson_type == 'signature') {
            addSignaturePad(false, flashcard.id, null, flashcard.position + 1);
          }

          if (flashcard.lesson_type == 'verify_phone') {
            addVerifyPhone(false, flashcard.id, null, flashcard.position + 1);
          }
          if (flashcard.lesson_type == 'user_video_upload') {
            addUserVideoUpload(false, flashcard.id, flashcard.question, flashcard.options, flashcard.image, flashcard.position);
          }
          if (flashcard.lesson_type == 'user_gps') {
            addUserGps(false, flashcard.id, flashcard.question, flashcard.options, flashcard.position);
          }
        });

        getAllLessons();
      },
      error: (error) => {
        swal({
          title: 'Access Denied!',
          text: error.responseJSON.msg,
          icon: "error",
        });
      },
    });
  } else {
    getAllLessons();
  }

  $('#lesson_form').submit((e) => {
    e.preventDefault();
    sendUpdates();
    var lesson_name = $('#lesson_name').val();
    var lesson_type = $('#selectsegment').val();
    const param = new URL(window.location.href);
    const params = param.searchParams.get('params');
    const lesson_id = param.searchParams.get('lesson_id');
    var answer = $('#answer').val();

    if (params) {
      $.ajax({
        async: true,
        crossDomain: true,
        crossOrigin: true,
        url: SERVER + '/courses_api/invite/response',
        type: 'POST',
        headers: {
          Authorization: `${localStorage.getItem('user-token')}`,
        },
        data: {
          params: params,
          lesson_id: lesson_id,
          lesson_name: lesson_name,
          lesson_type: lesson_type,
          answer: answer,
        },
        success: () => {
          swal({
            title: 'data saved',
            text: 'You have save data successfully ',
            icon: 'success',
          });
        },
        error: (err) => {
          swal({
            title: 'Not Exist',
            text: err.responseJSON.msg,
            icon: 'error',
          });
        },
      });
    }
  });

  $(document).on('click', '.remove_flashcard', function (e) {
    swal(
      {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      },
      function (isConfirm) {
        if (isConfirm) {
          var lesson_element_type = $(e.target).parent().parent().children().last().children().attr('name');
          pos--;
          // if (lesson_element_type.startsWith("speed_read")) {
          //     quick_read_count--;
          // } else if (lesson_element_type.startsWith("text")) {
          //     title_text_count--;
          // } else if (lesson_element_type.startsWith("question")) {
          //     question_choices_count--
          // } else if (lesson_element_type.startsWith("link")) {
          //     iframe_link_count--
          // } else if (lesson_element_type.startsWith("video")) {
          //     video_file_count--
          // } else if (lesson_element_type.startsWith("image")) {
          //     image_file_count--
          // }else if (lesson_element_type.startsWith("title_textarea")) {
          //     title_textarea_count--
          // }else if (lesson_element_type.startsWith("title_input")) {
          //     title_input_count--
          // } else if (lesson_element_type.startsWith("sign_b64")) {
          //     sign_count--
          // } else if (lesson_element_type.startsWith("brain_tree")) {
          //     braintree_count--
          // }else if (lesson_element_type.startsWith("question_checkboxes")) {
          //     question_checkboxes_count--
          // }else if (lesson_element_type.startsWith("name_type")) {
          //     name_type_count--
          // }
          //console.log(lesson_element_type)
          $(e.target).parent().parent().remove();
          sortablePositionFunction();
        } else {
          swal('Cancelled', 'error');
        }
      }
    );
  });

  $('#add').click(function (e) {
    if ($('#selectsegment').val() == 'jitsi_meet') {
      addJitsiMeet(true);
    }
    if ($('#selectsegment').val() == 'record_webcam') {
      addRecordWebCam(true);
    }
    if ($('#selectsegment').val() == 'speed_read') {
      addSpeedRead(true);
    }
    if ($('#selectsegment').val() == 'title_text') {
      addTitleText(true);
    }

    if ($('#selectsegment').val() == 'title_input') {
      addTitleInput(true);
    }

    if ($('#selectsegment').val() == 'question_choices') {
      addQuestionChoices(true);
    }

    if ($('#selectsegment').val() == 'name_type') {
      addNameType(true);
    }

    if ($('#selectsegment').val() == 'question_checkboxes') {
      addQuestionCheckboxes(true);
    }

    if ($('#selectsegment').val() == 'video_file') {
      addVideoFile(true);
    }

    if ($('#selectsegment').val() == 'image_file') {
      addImageFile(true);
    }
    if ($('#selectsegment').val() == 'iframe_link') {
      addIframeLink(true);
    }
    if ($('#selectsegment').val() == 'title_textarea') {
      addTitleTextarea(true);
    }
    if ($('#selectsegment').val() == 'sign_b64') {
      addSignaturePad(true);
    }
    if ($('#selectsegment').val() == 'brain_tree') {
      addBrainTree(true);
    }
    if ($('#selectsegment').val() == 'verify_phone') {
      addVerifyPhone(true);
    }
    if($('#selectsegment').val() == 'user_video_upload'){
      addUserVideoUpload(true);
    }
    if($('#selectsegment').val() == 'user_gps'){
      addUserGps(true);
    }
    if ($('#selectsegment').val() == 'select_type') {
      swal({
        title: 'Please select a type',
        text: 'Select a flashcard type to add to the lesson.',
        icon: 'error',
        timer: 2000,
      });
    }
  });
});
$(document).on('click', '#settingshtml', function (e) {
  
  $('#settingshtml').attr('href', '/settings.html?lesson_id=' + lesson_id);
});

$(document).on('click', '.image_upload_button', function (e) {
  $('#imageUpload').click();
  data_id_value = $(this).siblings("input[type=text]").attr("data-id");
  image_type = "imageFile";
});

$(document).on('click', '.upload_vid_btn', function (e) {
  $('#videoUpload').click();
  video_data_id_value = $(this).siblings("input[type=text]").attr("data-id");
  video_type = "video_file";
});
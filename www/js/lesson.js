var quick_read_count = 0;
var title_text_count = 0;
var question_choices_count = 0;
var video_file_count = 0;
var image_file_count = 0;
var iframe_link_count = 0;
var verify_phone_count =0;
var title_textarea_count = 0;
var title_input_count =0;

var braintree_count = 0;
var question_text_count = 0;
var sign_count = 0;
var sortArray = [];
var MODE;
var pos = 0;

var API_SERVER = 'https://sfapp-api.dreamstate-4-all.org';
//var API_SERVER ='http://localhost:8000';

var lesson_id = getParam('lesson_id');

function selectLesson() {
	var thelesson_id = $('#select_lesson :selected').val();
	window.location.href = '/lesson.html?lesson_id=' + thelesson_id;
}

function getAllLessons() {
    $.ajax({
        
    })
	$.get(API_SERVER + '/courses_api/lesson/all', function(response2) {
        console.log(response2)
        for(var lesson of response2) {
			$('#select_lesson').append(
				"<option value='" + lesson.id + "'>" + lesson.lesson_name + '</option>'
			);
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
			'"><button onclick="$(this).parent().remove()">Remove Choice</button></div>'
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
	if (!isNew) {
		$('#sortable').children().last().attr('data-position', posU);
	} else {
		$('#sortable').children().last().attr('data-position', pos);
		pos++;
	}
}

function addSpeedRead(isNew, id, value, posU) {
	//console.log(quick_read_count)
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

function addTitleInput(isNew, id, title, text, posU) {
    if (!isNew) {
        $("#title_input").find("textarea").html(title)
        $("#title_input").find("teaxtarea").attr("data-id", id)
    } else {
        $("#title_input").find("textarea").html("")
    }
    $("#title_input").find("textarea").attr(
        "name", "title_input_textarea" + title_input_count)
    $("#sortable").append($("#title_input").html())
    sortablePositionFunction(isNew, posU);

    title_input_count++;
}

function addQuestionChoices(isNew, id, question, choices, image, posU) {
	$('#question_choices')
		.find('input')
		.first()
        .attr('name', 'question_' + question_choices_count);
        if(question_choices_count ==0){
            $('#question_choices')
            .find('#choices')
            .attr('id', 'choices_' + question_choices_count);
            
        }else{
            $('#question_choices')
            .find('#choices_'+(question_choices_count-1))
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
        let tempQC = $("#question_choices").html()

	if (!isNew) {
		$('#question_choices').find('input').first().attr('value', question);
		$('#question_choices').find('input').last().attr('value', image);

		$('#question_choices').find('input').first().attr('data-id', id);
		$('#question_choices').find('input').last().attr('data-id', id);
		$('#choices_' + question_choices_count)
			.find('input')
			.remove();
		choices.split(',').forEach(function (choice) {
			//console.log(choice)
			addChoices(question_choices_count, choice);
		});

		// Display image
		displayImage(image);
	} else {
		$('#question_choices').find('input').first().attr('value', '');
		$('#question_choices').find('text').html('');
		$('#question_choices').find('input').last().attr('value', '');
	}
	$('#sortable').append($('#question_choices').html());
    sortablePositionFunction(isNew, posU);
    question_choices_count++;
    $("#question_choices").html(tempQC)

}

function handleImageUpload() {
	// prompt for video upload
	$('#imageUpload').click();
}

//handleImageSelect(this.value)
function handleImageSelect(e) {
	console.log('Selecting file', e, e.files[0]);
	var file = e.files[0];
	if (file) {
		GLOBAL_FILE = file;
		console.log('Submitting form', file.name);
		//        $("#imageUploadForm").submit();
		uploadFile('image');
	}
}

function handleVideoUpload() {
	// prompt for video upload
	$('#videoUpload').click();
}

//handleVideoSelect(this.value)
function handleVideoSelect(e) {
	console.log('Selecting file', e, e.files[0]);
	var file = e.files[0];
	if (file) {
		GLOBAL_FILE = file;
		console.log('Submitting form', file.name);
		//        $("#imageUploadForm").submit();
		uploadFile('video');
	}
}

function uploadFile(fileType) {
	console.log('Submitted');

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
		url: API_SERVER + '/s3_uploader/upload',
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

	console.log(settings);
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
							console.log('percentComplete:', percentComplete);
							$('.swal-title').text(
								parseInt(percentComplete * 100) + '%'
							);
						}
					},
					false
				);
				return xhr;
			},
			async: true,
			crossDomain: true,
			url: API_SERVER + '/s3_uploader/upload',
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

		console.log(settings);
		$.ajax(settings)
			.done(function (response) {
				swal({
					title: 'Good job!',
					text: 'File uploaded successfully!',
					icon: 'success',
				});

				response = JSON.parse(response);
				console.log(response);
				const file_url = response['file_url'];
				console.log(file_url);

				if (fileType == 'image') {
					displayImage(file_url);
					$('#image').attr('value', file_url);
				} else if (fileType == 'video') {
					displayVideo(file_url);
					$('#video').attr('value', file_url);
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

function displayImage(file_url) {
	// Clear existing image
	$('#output').html('');
	var img = $('<img>');
	img.attr('src', file_url);
	img.appendTo('#output');
	// Change button text
	$('#upload-img-btn').attr('value', 'Upload new Image');
}

function displayVideo(file_url) {
	var strTYPE = 'video/mp4';
	$('#videoplayer').html(
		'<source src="' + file_url + '" type="' + strTYPE + '"></source>'
	);
	$('#video-output').css('display', 'block');
	$('#videoplayer')[0].load();

	// Change button text
	$('#upload-vid-btn').attr('value', 'Upload new Video');
}

function addVideoFile(isNew, id, question, choices, image, posU) {
	if (!isNew) {
		$('#video_file').find('input').first().attr('value', question);
		$('#video_file').find('input').last().attr('value', image);

		$('#video_file').find('input').first().attr('data-id', id);
		$('#video_file').find('input').last().attr('data-id', id);

		// Display Video
		displayVideo(image);
	} else {
		$('#video_file').find('input').first().attr('value', '');
		$('#video_file').find('input').last().attr('value', '');
	}

	$('#video_file')
		.find('input')
		.first()
		.attr('name', 'video_question_' + video_file_count);
	$('#video_file')
		.find('input')
		.last()
		.attr('name', 'video_' + video_file_count);
	$('#sortable').append($('#video_file').html());
	video_file_count++;
	sortablePositionFunction(isNew, posU);
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
    console.log("Question Text Added")

    if (!isNew) {
        $("#title_textarea").find("textarea").first().html(question)

        $("#title_textarea").find("textarea").last().attr("data-id", id)

    } else {
        $("#title_textarea").find("textarea").first().html("")
    }

    $("#title_textarea").find("textarea").first().attr(
        "name", "title_textarea_" + title_textarea_count)
    $("#sortable").append($("#title_textarea").html())

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

function addImageFile(isNew, id, question, image, posU) {
	if (!isNew) {
		$('#image_file').find('input').first().attr('value', question);
		$('#image_file').find('input').last().attr('value', image);

		$('#image_file').find('input').first().attr('data-id', id);
		$('#image_file').find('input').last().attr('data-id', id);

		// Display Video
		displayImage(image);
	} else {
		$('#image_file').find('input').first().attr('value', '');
		$('#image_file').find('input').last().attr('value', '');
	}

	$('#image_file')
		.find('input')
		.first()
		.attr('name', 'image_question' + image_file_count);
	$('#image_file')
		.find('input')
		.last()
		.attr('name', 'image_' + image_file_count);
	$('#sortable').append($('#image_file').html());
	image_file_count++;
	sortablePositionFunction(isNew, posU);
}

function addVerifyPhone(isNew,id,question,image,posU){
    if (!isNew) {

    } else {
        $("#title_textarea").find("textarea").first().html("")
    }

    $("#verify_phone").find("input").first().attr(
        "name", "verify_phone_" + verify_phone_count)
    $("#sortable").append($("#verify_phone").html())

    verify_phone_count++;
    sortablePositionFunction(isNew, posU);
}

function addBrainTree(isNew, id, merchant_ID, braintree_public_key,
                      braintree_private_key,
                      braintree_item_name, braintree_item_price, posU) {
    console.log(isNew);
    if (!isNew) {
        console.log(id, merchant_ID, braintree_public_key, braintree_private_key,
            braintree_item_name, braintree_item_price, posU);
        $("#brain_tree").find("#braintree_merchant_ID").attr("value", merchant_ID)
        $("#brain_tree").find("#braintree_public_key").attr("value", braintree_public_key)
        $("#brain_tree").find("#braintree_private_key").attr("value", braintree_private_key)
        $("#brain_tree").find("#braintree_item_name").attr("value", braintree_item_name)
        $("#brain_tree").find("#braintree_item_price").attr("value", braintree_item_price)
        //// flash card ID
        $("#brain_tree").find("#braintree_merchant_ID").attr("data-id", id)
        $("#brain_tree").find("#braintree_public_key").attr("data-id", id)
        $("#brain_tree").find("#braintree_private_key").attr("data-id", id)
        $("#brain_tree").find("#braintree_item_name").attr("data-id", id)
        $("#brain_tree").find("#braintree_item_price").attr("data-id", id)

    } else {
        console.log("empty values");
        $("#brain_tree").find("#braintree_merchant_ID").attr("value", "")
        $("#brain_tree").find("#braintree_public_key").attr("value", "")
        $("#brain_tree").find("#braintree_private_key").attr("value", "")
        $("#brain_tree").find("#braintree_item_name").attr("value", "")
        $("#brain_tree").find("#braintree_item_price").attr("value", "")
    }

    $("#brain_tree").find("#braintree_merchant_ID").attr("name", "braintree_merchant_ID_" + braintree_count)
    $("#brain_tree").find("#braintree_public_key").attr("name", "braintree_public_key_" + braintree_count)
    $("#brain_tree").find("#braintree_private_key").attr("name", "braintree_private_key_" + braintree_count)
    $("#brain_tree").find("#braintree_item_name").attr("name", "braintree_item_name_" + braintree_count)
    $("#brain_tree").find("#braintree_item_price").attr("name", "braintree_item_price_" + braintree_count)
    

    $("#sortable").append($("#brain_tree").html())
    braintree_count++;
    sortablePositionFunction(isNew, posU);
}

function sendUpdates() {
    var lesson_name = $("#lesson_name").val()
    data_ = {
        "lesson_name": lesson_name
    }
    var flashcards = [];
    var position_me = 0;
    // Saving Quick Reads
    for (var i = 0; i < quick_read_count; i++) {
        quick_read_value = $('textarea[name="speed_read_' + i + '"]').val()
        position_me = $('textarea[name="speed_read_' + i + '"]').parent().parent().data("position")
        console.log(position_me)

        if (quick_read_value) {
            temp = {
                "lesson_type": "quick_read",
                "question": quick_read_value,
                "position": position_me
            }
            flashcards.push(temp)
        }
    }

    //Saving Title Text
    for (var i = 0; i < title_text_count; i++) {
        var title_value = $('input[name="title_' + i + '"]').val();
        var text_value = $('textarea[name="text_' + i + '"]').val();

        position_me = $('input[name="title_' + i + '"]').parent().parent().data("position")

        temp = {
            "lesson_type": "title_text",
            "question": title_value,
            "answer": text_value,
            "position": position_me

        }
        flashcards.push(temp)
    }


    for (var i = 0; i < title_input_count; i++) {
        var title_value = $('textarea[name="title_input_textarea' + i + '"]').val();

        position_me = $('textarea[name="title_input_textarea' + i + '"]').parent().parent().data("position")

        temp = {
            "lesson_type": "title_input",
            "question": title_value,
            "position": position_me

        }
        flashcards.push(temp)
    }

    for (var i = 0; i < question_choices_count; i++) {
        var question = $('input[name="question_' + i + '"]').val()

        var choices_array = $('#choices_' + i + ' :input').map(function () {
            var type = $(this).prop("type");

            if (type == "text") {
                return($(this).val())
            }
        })

        position_me = $('input[name="question_' + i + '"]').parent().parent().data("position")


        var choices = choices_array.toArray().join(",")
        var image = $('input[name="image_' + i + '"]').val()
        temp = {
            "lesson_type": "question_choices",
            "question": question,
            "image": image,
            "options": choices,
            "position": position_me
        }
        flashcards.push(temp)
    }

    for (var i = 0; i < video_file_count; i++) {
        var question = $('input[name="video_question_' + i + '"]').val()
        var video = $('input[name="video_' + i + '"]').val()
        position_me = $('input[name="video_question_' + i + '"]').parent().parent().data("position")

        temp = {
            "lesson_type": "video_file",
            "question": question,
            "image": video,
            "options": choices,
            "position": position_me
        }
        flashcards.push(temp)
    }

    for (var i = 0; i < iframe_link_count; i++) {
        var question = $('input[name="question_' + i + '"]').val()
        position_me = $('input[name="question_' + i + '"]').parent().parent().data("position")

        var link = $('input[name="link_' + i + '"]').val()
        temp = {
            "lesson_type": "iframe_link",
            "question": question,
            "image": link,
            "options": choices,
            "position": position_me
        }
        flashcards.push(temp)
    }

    for (var i = 0; i < title_textarea_count; i++) {
        var question = $('textarea[name="title_textarea_' + i + '"]').val()
        position_me = $('textarea[name="title_textarea_' + i + '"]').parent().parent().data("position")

        temp = {
            "lesson_type": "title_textarea",
            "question": question,
            "position": position_me
        }
        flashcards.push(temp)
    }

    data_.flashcards = flashcards
    console.log(data_)

    if (MODE == "CREATE") {

        $.ajax({
            "url": API_SERVER + "/courses_api/lesson/create",
            'data': JSON.stringify(data_),
            'type': 'POST',
            'contentType': 'application/json',
            'success': function (data) {
                //console.log(data.id)
                var currentPathName = window.location.pathname;
                window.location.replace(currentPathName + "?lesson_id=" + data.id)
                alert("FlashCard Created!")
            }
        })

    } else {

        $.ajax({
            "url": API_SERVER + "/courses_api/lesson/update/" + lesson_id + "/",
            'data': JSON.stringify(data_),
            'type': 'POST',
            'contentType': 'application/json',
            'success': function (data) {
                alert("FlashCard Updated!")
            }
        })
    }
}

$(document).ready(function () {

    $("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");
    if (lesson_id) {
        MODE = "UPDATE";
    } else {
        MODE = "CREATE";
    }
    const param = new URL(window.location.href)
    const params = param.searchParams.get('params')
    if (MODE == "UPDATE") {
        $.get(API_SERVER + '/courses_api/lesson/read/' +
              lesson_id + '/', function (response) {
            if(params){
                $("#lesson_slide").attr(
                    "href", `/slide.html?lesson_id=${lesson_id}&params=${params}`)
            }else{

                $("#lesson_slide").attr(
                    "href", "/slide.html?lesson_id=" + lesson_id)
                }
            $("#lesson_responses").attr(
                "href", "/lesson_responses.html?lesson_id=" + lesson_id)

            $("#lesson_name").val(response.lesson_name)
            console.log(response)
            var flashcards = response.flashcards;

            flashcards.sort(function (a, b) {
                keyA = a.position;
                keyB = b.position;
                if (keyA < keyB)
                    return -1;
                if (keyA > keyB)
                    return 1;
                return 0;
            })

            flashcards.forEach((flashcard) => {
                console.log("update check2");
                if (pos < flashcard.position) {
                    pos = flashcard.position + 1
                }

                if (flashcard.lesson_type == "quick_read") {

                    addSpeedRead(false, flashcard.id, flashcard.question,
                                 flashcard.position)
                }

                if (flashcard.lesson_type == "title_text") {
                    addTitleText(false, flashcard.id, flashcard.question,
                                 flashcard.answer, flashcard.position)
                }
                if (flashcard.lesson_type == "BrainTree") {
                    console.log(flashcard.id,
                        flashcard.braintree_merchant_ID,
                        flashcard.braintree_public_key,
                        flashcard.braintree_private_key,
                        flashcard.braintree_item_name,
                        flashcard.braintree_item_price,
                        flashcard.position);
                    addBrainTree(false, flashcard.id,
                            flashcard.braintree_merchant_ID,
                            flashcard.braintree_public_key,
                            flashcard.braintree_private_key,
                            flashcard.braintree_item_name,
                            flashcard.braintree_item_price,
                            flashcard.position)
                }

                if (flashcard.lesson_type == "title_input") {
                    addTitleInput(false, flashcard.id, flashcard.question,
                                 flashcard.answer, flashcard.position)
                }

                if (flashcard.lesson_type == "question_choices") {
                    addQuestionChoices(false, flashcard.id,
                                       flashcard.question,
                                       flashcard.options, flashcard.image,
                                       flashcard.position)
                }

                if (flashcard.lesson_type == "video_file") {
                    addVideoFile(false, flashcard.id, flashcard.question,
                                 flashcard.options, flashcard.image,
                                 flashcard.position)
                }


                if (flashcard.lesson_type == "image_file") {
                    addImageFile(false, flashcard.id, flashcard.question,
                                 flashcard.options, flashcard.image,
                                 flashcard.position)
                }

                if (flashcard.lesson_type == "iframe_link") {
                    addIframeLink(false, flashcard.id, flashcard.question,
                                  flashcard.options, flashcard.image,
                                  flashcard.position)
                }
                if (flashcard.lesson_type == "title_textarea") {
                    console.log("Question Text Added")

                    addTitleTextarea(false, flashcard.id, flashcard.question,
                                    flashcard.position)
                }



                if(flashcard.lesson_type == "signature"){
                    addSignaturePad(false, flashcard.id, null,
                                    flashcard.position + 1);
                }

                if(flashcard.lesson_type == "verify_phone"){
                    addVerifyPhone(false, flashcard.id, null,
                                    flashcard.position + 1);
                }
            })
        
            getAllLessons();

       
        })
    }else{
        getAllLessons();

    }

    $("#lesson_form").submit((e) => {
        e.preventDefault()
        console.log(sortArray)
        sendUpdates()
        var lesson_name = $("#lesson_name").val()
        // console.log(lesson_name , "as lesson name consoled....")
        var lesson_type = $("#selectsegment").val()
        const param = new URL(window.location.href)
        const params = param.searchParams.get('params')
        const lesson_id = param.searchParams.get('lesson_id')
        // console.log("lesson id is :" , lesson_id)
        var answer = $("#answer").val()
        // console.log(answer , "as answer passed ...")

        $.ajax({	
            async: true,	
            crossDomain: true,	
            crossOrigin: true,	
            url: SERVER + "/courses_api/invite/response",	
            type: "POST",	
            headers: {	
                "Authorization": `${localStorage.getItem('user-token')}`	
            },	
            data: {	
                "params" : params,
                "lesson_id" : lesson_id,
                "lesson_name": lesson_name,
                "lesson_type" : lesson_type,
                "answer" : answer,
            },	
            success: () => {	
                swal({	
                    title: "data saved",
                    text: "You have save data successfully ",	
                    icon: "success"	
                })	
            },	
            error: (err) => {	
                swal({	
                    title: "Not Exist",	
                    text: err.responseJSON.msg,	
                    icon: "error"	
                });	
            }	
        })	
    })

    $(document).on("click", ".remove_flashcard", function (e) {
        if (confirm("Are you sure you want to delete")) {
            var lesson_element_type = $(e.target).parent().parent().children().last().children().attr("name")
            //console.log(lesson_element_type)
            pos--;
            if (lesson_element_type.startsWith("speed_read")) {
                quick_read_count--;
            } else if (lesson_element_type.startsWith("text")) {
                title_text_count--;
            } else if (lesson_element_type.startsWith("question")) {
                question_choices_count--
            } else if (lesson_element_type.startsWith("link")) {
                iframe_link_count--
            } else if (lesson_element_type.startsWith("video")) {
                video_file_count--
            } else if (lesson_element_type.startsWith("image")) {
                image_file_count--
            }else if (lesson_element_type.startsWith("title_textarea")) {
                title_textarea_count--
            }else if (lesson_element_type.startsWith("title_input")) {
                title_input_count--
            } else if (lesson_element_type.startsWith("sign_b64")) {
                sign_count--
            } else if (lesson_element_type.startsWith("brain_tree")) {
                braintree_count--
            }
            //console.log(lesson_element_type)
            $(e.target).parent().parent().remove()
            sortablePositionFunction();
        }
    });

    $('#add').click(function (e) {
        if ($("#selectsegment").val() == 'speed_read')
        {
            addSpeedRead(true);
        }
        if ($("#selectsegment").val() == 'title_text')
        {
            addTitleText(true)
        }

        if ($("#selectsegment").val() == 'title_input')
        {
            addTitleInput(true)
        }

        if ($("#selectsegment").val() == 'question_choices')
        {
            addQuestionChoices(true)

        }
        if ($("#selectsegment").val() == 'video_file')
        {
            addVideoFile(true)
        }

        if ($("#selectsegment").val() == 'image_file')
        {
            addImageFile(true)
        }
        if ($("#selectsegment").val() == 'iframe_link')
        {
            addIframeLink(true)
        }
        if ($("#selectsegment").val() == 'title_textarea')
        {
            addTitleTextarea(true)
        }
        if ($("#selectsegment").val() == 'sign_b64')
        {
            addSignaturePad(true)
        }
        if ($("#selectsegment").val() == 'brain_tree')
        {
            addBrainTree(true)
        }
        if ($("#selectsegment").val() == 'verify_phone')
        {
            addVerifyPhone(true)
        }
        if ($("#selectsegment").val() == 'select_type')
        {
            alert("Please select a type");
        }
    })
})

// var data_invite = {
//     name = "passing student",
// }

// function invite_link_data(){
//     console.log("invite_data_button_clicked....")

//     $.ajax({
//         "url": API_SERVER +"/courses_api/invite/response/",
//         'data': JSON.stringify(data_invite),
//         'type': 'POST',
//         'contentType': 'application/json',
//         'success': function (data){
//             alert("done")
//             console.log("invite link is clicked.")
//         },
//         'error': function(res){
//         // alert(JSON.stringify(res))
//     }
// })   

// }

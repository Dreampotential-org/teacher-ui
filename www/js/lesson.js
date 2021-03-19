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
var question_checkboxes_count = 0;
var question_text_count = 0;
var name_type_count =0;
var sign_count = 0;
var sortArray = [];
var MODE;
var pos = 0;


window.addEventListener('DOMContentLoaded', init, false)

var lesson_id = getParam('lesson_id');

function selectLesson() {
	var thelesson_id = $('#select_lesson :selected').val();
	window.location.href = '/lesson.html?lesson_id=' + thelesson_id;
}

function getAllLessons() {
    $.ajax({
        url: SERVER + "courses_api/lesson/all",
        async: true,
        crossDomain: true,
        crossOrigin: true,
        type: "GET",
        headers: { "Authorization": `${localStorage.getItem('user-token')}` }
    }).done((response2) => {
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
        "name", "title_input_textarea_" + title_input_count)
    $("#sortable").append($("#title_input").html())
    sortablePositionFunction(isNew, posU);

    title_input_count++;
}

function addNameType(isNew, id, title, text, posU) {
    if (!isNew) {
        $("#name_type").find("textarea").html(title)
        $("#name_type").find("teaxtarea").attr("data-id", id)
    } else {
        $("#name_type").find("textarea").html("")
    }
    $("#name_type").find("textarea").attr(
        "name", "name_type_textarea_" + title_input_count)
    $("#sortable").append($("#name_type").html())
    sortablePositionFunction(isNew, posU);

    name_type_count++;
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

        console.log(choices);
        choices.map((choice) => {
			addChoices(question_choices_count, choice);
        })

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

function addQuestionCheckboxes(isNew, id, question, options, image, posU) {
	$('#question_checkboxes')
		.find('input')
		.first()
        .attr('name', 'question_checkboxes_question_' + question_checkboxes_count);
        if(question_checkboxes_count ==0) {
            $('#question_checkboxes')
            .find('#checkboxes')
            .attr('id', 'checkboxes_' + question_checkboxes_count);

        } else {
            $('#question_checkboxes')
            .find('#checkboxes_'+(question_checkboxes_count-1))
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
        let tempQ = $("#question_checkboxes").html()

	if (!isNew) {
		$('#question_checkboxes').find('input').first().attr('value', question);
		$('#question_checkboxes').find('input').last().attr('value', image);

		$('#question_checkboxes').find('input').first().attr('data-id', id);
		$('#question_checkboxes').find('input').last().attr('data-id', id);
		$('#checkboxes_' + question_checkboxes_count)
			.find('input')
			.remove();
		options.map((choice) => {
			//console.log(choice)
			addCheckboxes(question_checkboxes_count, choice);
		});

		// Display image
		displayImage(image);
	} else {
		$('#question_checkboxes').find('input').first().attr('value', '');
		$('#question_checkboxes').find('text').html('');
		$('#question_checkboxes').find('input').last().attr('value', '');
	}
	$('#sortable').append($('#question_checkboxes').html());
    sortablePositionFunction(isNew, posU);
    question_checkboxes_count++;
    $("#question_checkboxes").html(tempQ)

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
    var meta_attributes = []
    data_ = {
        "lesson_name": lesson_name
    }
    var flashcards = [];
    var position_me = 0;
    // Saving Quick Reads
    flashcards_div = []
    flashcard_body = []
    current_flashcard_elements = []
    var attr_array = []
    position_me = 0

    if(document.querySelector("#name:checked")){
        meta_attributes.push("name")
    }

    if(document.querySelector("#email:checked")){
        meta_attributes.push("email")
    }

    if(document.querySelector("#phone:checked")){
        meta_attributes.push("phone")
    }

    sortable_div = document.getElementById("sortable").childNodes
    sortable_div.forEach((flashcard_div) => {
        try{
            if(flashcard_div.getAttribute("data-position")){
                flashcards_div.push(flashcard_div)
            }
        }catch(e){
            
        }
        })

        flashcards_div.forEach(flashcard => {
            // Prepare the data
            current_flashcard_elements = []
            flashcard.childNodes.forEach(flashcard_element => {
                if(flashcard_element.attributes){
                    current_flashcard_elements.push(flashcard_element)
                }
            })

            current_flashcard_elements.shift() // remove the header
            flashcard_type = flashcard.getAttribute("data-type")
            position_me +=1
            console.log(current_flashcard_elements)
            //current_flashcard_elements has all the fields of current selected flashcard
            console.log(flashcard_type + " has length of "+current_flashcard_elements.length)

            if(current_flashcard_elements.length < 4 ){

         
            current_flashcard_elements.forEach(current_flashcard_element => {
                this_element = current_flashcard_element.firstElementChild
                if(this_element.type == "textarea" || this_element.type == "text"){
                    attr_value = current_flashcard_element.firstElementChild.value
                    attr_array.push(attr_value)   
                }
            })
            console.log(attr_array)

            }else{
                real_flashcard_elements = [] 
                current_flashcard_elements.forEach(current_flashcard_element => {
                    if(current_flashcard_element.attributes){
                        real_flashcard_elements.push(current_flashcard_element)
                    }
                })
                attr_array[0] = real_flashcard_elements[0].firstElementChild.value
                choices_array = []
                //working on choices
                real_flashcard_elements[1].childNodes.forEach(choice => {
    
                    choice.childNodes.forEach(choice_unit => {
                        if(choice_unit.type == "text"){
                            choices_array.push(choice_unit.value)    
                    }
                })
                })
                // Selecting the value of image
                real_flashcard_elements[current_flashcard_elements.length -1].childNodes.forEach(image_upload_element => {
                    if(image_upload_element.type == "text"){
                        attr_array[1] = image_upload_element.value
                    }
                })
                
                console.log(attr_array)

            }
            console.log(flashcard_type);
            switch(flashcard_type){
                case "speed_read":
                    temp = {
                        "lesson_type": "quick_read",
                        "question": attr_array[0],
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break; 

                case "title_text":
                    console.log("This is a titletext")
                    temp = {
                        "lesson_type": "title_text",
                        "question": attr_array[0],
                        "answer": attr_array[1],
                        "position": position_me
            
                    }
                    flashcards.push(temp)
                    break;
                
                case "title_input":

                    temp = {
                        "lesson_type": "title_input",
                        "question": attr_array[0],
                        "position": position_me
            
                    }
                    flashcards.push(temp)
                    break;
                
                case "iframe_link":            
                    temp = {
                        "lesson_type": "iframe_link",
                        "question": attr_array[0],
                        "image": attr_array[1],
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;

                case "title_textarea":
                    temp = {
                        "lesson_type": "title_textarea",
                        "question": attr_array[0],
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;

                case "image_file":
                    temp = {
                        "lesson_type": "image_file",
                        "question": attr_array[0],
                        "image": attr_array[2],
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;
                
                case "video_file":
                    temp = {
                        "lesson_type": "video_file",
                        "question": attr_array[0],
                        "image": attr_array[2],
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;
                
                case "question_choices":
                    temp = {
                        "lesson_type": "question_choices",
                        "question": attr_array[0],
                        "options":choices_array,
                        "image": attr_array[1],
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;

                case "question_checkboxes":
                    temp = {
                        "lesson_type": "question_checkboxes",
                        "question": attr_array[0],
                        "options":choices_array,
                        "image": attr_array[1],
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;
                case "signature":
                    temp = {
                        "lesson_type": "signature",
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;
                case "name_type":
                    temp = {
                        "lesson_type": "name_type",
                        "question": attr_array[0],
                        "position": position_me

                    }
                    flashcards.push(temp)
                    break;
                
                case "verify_phone":
                    temp = {
                        "lesson_type": "verify_phone",
                        "position": position_me
                    }
                    flashcards.push(temp)
                    break;
            }
            
            attr_array = []

    })
        console.log(flashcards)

    data_.flashcards = flashcards
    data_.meta_attributes = meta_attributes.join(',')
    console.log(data_)

    if (MODE == "CREATE") {

        $.ajax({
            "url": SERVER + "courses_api/lesson/create",
            'data': JSON.stringify(data_),
            'type': 'POST',
            'contentType': 'application/json',
            headers: { "Authorization": `${localStorage.getItem('user-token')}` },
            'success': function (data) {
                //console.log(data.id)
                var currentPathName = window.location.pathname;
                window.location.replace(currentPathName + "?lesson_id=" + data.id)
                swal({	
                    title: "Lesson Created",	
                    text: "You have successfully created a lesson",	
                    icon: "success",
                    timer: 2000
                })
            },
            error: (err) => {	
                swal({	
                    title: "Error Creating Lesson",	
                    text: err,	
                    icon: "error"	
                });	
            }
        })

    } else {

        $.ajax({
            "url": SERVER + "courses_api/lesson/update/" + lesson_id + "/",
            'data': JSON.stringify(data_),
            'type': 'POST',
            'contentType': 'application/json',
            'success': function (data) {
                swal({
                    title: "Lesson Updated",
                    text: "You have updated created a lesson",
                    icon: "success",
                    timer: 2000
                })            }
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
        $.get(SERVER + 'courses_api/lesson/read/' +
              lesson_id, function (response) {
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
            $("title").text(response.lesson_name + " - edit..")

            var flashcards = response.flashcards;
            //Updating meta
            var recieved_meta = response.meta_attributes

            if(recieved_meta.includes("name")){
                document.getElementById("name").checked = true
            }

            if(recieved_meta.includes("email")){
                document.getElementById("email").checked = true
            }

            if(recieved_meta.includes("phone")){
                document.getElementById("phone").checked = true
            }


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

                    if (flashcard.lesson_type == "name_type") {
                        addNameType(false, flashcard.id,
                                           flashcard.question,
                                           flashcard.options, flashcard.image,
                                           flashcard.position)
                    }

                if (flashcard.lesson_type == "question_checkboxes") {
                    addQuestionCheckboxes(false, flashcard.id,
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
                    console.log('signature adding')
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
        var lesson_type = $("#selectsegment").val()
        const param = new URL(window.location.href)
        const params = param.searchParams.get('params')
        const lesson_id = param.searchParams.get('lesson_id')
        var answer = $("#answer").val()
        
        if (params){
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
    }	
    })

    $(document).on("click", ".remove_flashcard", function (e) {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          },function(isConfirm) {
            if (isConfirm) {
                var lesson_element_type = $(e.target).parent().parent().children().last().children().attr("name")
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
                $(e.target).parent().parent().remove()
                sortablePositionFunction();
            } else {
              swal("Cancelled", "error");
            }
          })

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

        if ($("#selectsegment").val() == 'name_type')
        {
            addNameType(true)

        }

        if ($("#selectsegment").val() == 'question_checkboxes')
        {
            addQuestionCheckboxes(true)

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
            swal({	
                title: "Please select a type",	
                text: "Select a flashcard type to add to the lesson.",	
                icon: "error",
                timer: 2000
            })        }
    })
})

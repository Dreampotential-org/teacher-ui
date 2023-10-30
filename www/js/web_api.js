$.ajaxSetup({
    statusCode: {
        401: function (jqxhr, textStatus, errorThrown) {
            // alert('You must login to proceed');
            localStorage.removeItem('user-token');
            $('body').load('student_login.html');
        }
    }
});
function get_users() {
    get_user_list(function (users) {
        for (var user of users) {
            /// XXX @santosh add to users list section

        }
    });
}
function list_question_counters(callback) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "admin_backend/api_admin/question_counters",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        headers: { "Authorization": "Bearer " + localStorage.getItem("user-token") },

    }
    $.ajax(settings).done(function (response) {
        callback(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
        // alert("ERROR")
    })
}

function list_inbound_calls(callback) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "admin_backend/api_admin/list_calls/",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "headers": {
            "Authorization": 'Token ' + localStorage.getItem("user-token"),
        }
    }
    $.ajax(settings).done(function (response) {
        callback(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
        // alert("ERROR")
    })
}

function list_services(callback) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/get_services",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        callback(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
        // alert("ERROR")
    })
}


function get_user_list(callback) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "admin_backend/api_admin/get_members",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "headers": {
            "Authorization": 'Token ' + localStorage.getItem("user-token"),
        },
    }
    $.ajax(settings).done(function (response) {
        callback(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
        // alert("ERROR")
    })
}


function get_activity_list(phone, cb) {
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/checkin_activity_admin?phone=" + phone,
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "headers": {
            "Authorization": 'Token ' + localStorage.getItem("user-token"),
        },
    }
    $.ajax(settings).done(function (response) {
        cb(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
        // alert("ERROR")
    })
}

function get_tags(member_id, cb) {
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/get_user_tags?member_id=" + member_id,
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "headers": {
            "Authorization": 'Token ' + localStorage.getItem("user-token"),
        },
    }
    $.ajax(settings).done(function (response) {
        cb(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
        // alert("ERROR")
    })
}

function assignTag(tag, member_id, cb) {
    var form = new FormData();
    form.append("tag", tag);
    form.append("member_id", member_id);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/assign_tag",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form,
        "headers": {
            "Authorization": 'Token ' + localStorage.getItem("user-token"),
        },
    }
    $.ajax(settings).done(function (response) {
        cb(JSON.parse(response, null));
    }).fail(function (err) {
        console.log(err);
        cb(null, err);
        // alert("ERROR");
    })
}

function send_user_sms(to_number, msg, callback) {
    var form = new FormData();
    form.append("to_number", to_number);
    form.append("msg", msg);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "voip/api_voip/send_sms",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form,
        "headers": {
            "Authorization": localStorage.getItem("token"),
        },
    }
    $.ajax(settings).done(function (response) {
        // change screen for code collecton
        callback(response, null);
        console.log(response)
    }).fail(function (err) {
        console.log(err)
        callback(null, err);
        //alert("ERROR")
    });
}

function send_feedback(msg, type, logId, callback) {
    var form = new FormData();
    // form.append("to_number", to_number);
    form.append("msg", msg);
    form.append("logType", type);
    form.append("logId", logId);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "sfapp2/api/checkin_admin_feedback",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form,
        "headers": {
            "Authorization": 'Token ' + localStorage.getItem("user-token"),
        },
    }
    $.ajax(settings).done(function (response) {
        // change screen for code collecton
        callback(response, null);
        console.log(response)
    }).fail(function (err) {
        callback(null, err);
        //alert("ERROR")
    });
}

function send_image_twilio(callback) {
    // alert("ready");
    swal({
        title: "0%",
        text: "File uploading please wait.",
        icon: "info",
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
    });
    var formData = new FormData()
    formData.append("file", $('input[type=file]')[0].files[0]);
    console.log(formData);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + 'profile/upload',
        "method": "POST",
        "type": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": formData,
        "headers": {
            "Authorization": localStorage.getItem("token")
        }
    };
    console.log(settings);
    $.ajax(settings).done(function (response) {
        swal({
            title: "Good job!",
            text: "File uploaded successfully!",
            icon: "success",
        });
        response = JSON.parse(response);
        console.log(response);
        file_url = response['file_url']
        alert(file_url);
        upload_to_twilio(file_url);
        
        // $('#output').html("<div> Uploaded to S3 Url: "+ file_url + "</div>");

        // var img = $('<img>');
        // img.attr('src', file_url);
        // img.appendTo('#output');
    }).fail(function (response) {
        swal({
            title: "Error!",
            text: "File upload failed!",
            icon: "warning",
        });
    });

}

function upload_to_twilio(image) {
    // console.log(user_phone);
    var form = new FormData();
    form.append("to_number", user_phone);
    form.append("image", image);
    console.log(form)
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "voip/api_voip/send_file",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form,
        "headers": {
            "Authorization": localStorage.getItem("token"),
        },
    }
    $.ajax(settings).done(function (response) {
        console.log(response)
    }).fail(function (err) {
        console.log(err)
        alert("ERROR")
    });
}

function get_sms_to_number(to_number, callback) {
    if (to_number !== undefined) {
        var form = new FormData();
        form.append("to_number", to_number);
        var settings = {
            "async": true,
            "crossDomain": true,
            "processData": false,
            "contentType": false,
            "data" :form,
            "mimeType": "multipart/form-data",
            "url": SERVER + "voip/api_voip/list_sms",
            "method": "POST",
        }
        $.ajax(settings).done(function (response) {
            response = JSON.parse(response)
            // XXX Santosh here is what msg look like to populate
            // SMS chat interface.
            callback(response)
        }).fail(function (err) {
            console.log(err)
            // alert("ERROR")
        })
    }
}

function format_date(created_at) {
    var date = new Date(created_at * 1000)
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours || 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    var strTime = hours + ':' + minutes + ' ' + ampm
    return date.toLocaleDateString('en-US') + ' ' + strTime
}

function setup_activity_view_events() {
    $('body').delegate('.video_entry a.video-view', 'click', function (e) {
        $('#activityModal').modal('show')

        var video_url = $(this).parent().attr('video_url');

        $('#activity-body').html(
            '<video controls="" autoplay="" name="media" ' +
            'id="video">' +
            '<source src="' +
            video_url +
            '" type="video/mp4"></video>'
        )
    })

    $('body').delegate('.gps-entry a.gps-view', 'click', function (e) {
        $('#activityModal').modal('show')

        $('#activity-body').html(
            "<div id='gps-view' style='width:100%;height:400px;'></div>"
        )
        var spot = {
            lat: parseFloat($(this).parent().attr('lat')),
            lng: parseFloat($(this).parent().attr('lng'))
        }
        var name = ''
        var latlng = spot
        var geocoder = new google.maps.Geocoder()

        var panorama = new google.maps.Map(document.getElementById('gps-view'), {
            center: { lat: spot.lat, lng: spot.lng },
            zoom: 18
        })
        geocoder.geocode({ location: latlng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    name = results[0].formatted_address
                    // alert(name);
                    var marker = new google.maps.Marker({
                        position: spot,
                        map: panorama,
                        icon: 'images/map_icon.png'
                    })
                    var infowindow = new google.maps.InfoWindow({
                        content: name
                    })
                    infowindow.setContent(results[0].formatted_address)
                    infowindow.open(panorama, marker)
                    marker.addListener('click', function () {
                        infowindow.open(panorama, marker)
                    })
                } else {
                    window.alert('No results found')
                }
            } else {
                window.alert('Geocoder failed due to: ' + status)
            }
        })
    })
}


function get_all_active_numbers(callback) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "voip/api_voip/active",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "headers": {
            "Authorization": 'Token ' + localStorage.getItem("user-token"),
        }
    }
    $.ajax(settings).done(function (response) {
        callback(response.active)
    }).fail(function (err) {
        console.log(err)
        // alert("ERROR")
    })
}



// document.addEventListener("DOMContentLoaded", filterTable);

function filterTable() {
	var inputFilter = document.getElementById("txtFind"); // get input type of text
	var bodyRow 	= document.getElementById("lead_table").getElementsByTagName("tbody")[0];  // find Body Row Table
	var rowTable    = bodyRow.getElementsByTagName("tr");	// get all of the rows
	var lengthRow   = rowTable.length; // calculate number of rows
	var lengthCol 	= document.getElementById("lead_table").getElementsByTagName("th").length; //number of table's column
	var arrStr  	= [];  // create array for save all of value from input
	var saveNumRows = []; // create Array for save Row's number
	var backupArr   = []; // get backup the array
	var getNumRows = []; // create array for use one time !
	var lenVal , goFilter , numRowArr;

	for( var i = 0 ; i < lengthRow ; i++){
		getNumRows[i] = rowTable[i].getElementsByTagName("td")[0].innerHTML; // save all of the Row's number
	}
	backupArr[0] = getNumRows; // get Backup the all of the row

	// when user write and focus out
	inputFilter.addEventListener("keyup", function(e){

		var val = this.value.toLowerCase().trim();
		arrStr  = val.split(" "); //save all of character in array
		lenVal  = arrStr.length; // get length of array 

		if(val.length == 0){ // if length of input value is Zero 
			for( var i = 0 ; i < lengthRow ; i++){
				saveNumRows[i] = rowTable[i].getElementsByTagName("td")[0].innerHTML; // save all of the Row's number
			}//for		
		}//if

		for( var i = 0 ; i < lenVal ; i++){
			goFilter(arrStr[i],lenVal); // send value and length array
		}//for

	});//inputFilter.addEventList ener

	var goFilter = function(val,arrInput){

 		for( var i = 0, counter= 0 , numRowArr = backupArr[arrInput-1].length ; i < numRowArr ; i++){
			for( var j = 1 ; j < lengthCol ; j++){
					 
				    var colTable = rowTable[parseInt(backupArr[arrInput-1][i])-1].getElementsByTagName("td")[j].innerHTML.toLowerCase();//get table's cell

  					if( colTable.indexOf(val) >= 0){
   						saveNumRows[counter] = rowTable[parseInt(backupArr[arrInput-1][i])-1].getElementsByTagName("td")[0].innerHTML; // save number of row that is in result

						rowTable[parseInt(saveNumRows[counter])-1].setAttribute("class","showRowResult"); // add class to display table-row for show

						//saveNumRows[counter] = backupArr[arrInput-1][i];
						counter++;
						break; // when any result finded , break the row and go to the next row
					}//if
					else{
						rowTable[parseInt(backupArr[arrInput-1][i])-1].setAttribute("class","results"); // add class for hidden table's row that is not in result 
					}//else
			}//for
		}//for		
		backupArr[arrInput] = saveNumRows;	// save number of rows in first Character or sevtence before Space
		saveNumRows = []; 	// remove element's array for reuse again
  	}//goFilter
}//filterTable

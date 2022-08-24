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

$(document).ready(function() {

	$("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");
	//webkitURL is deprecated but nevertheless
	URL = window.URL || window.webkitURL;

	var gumStream; 						//stream from getUserMedia()
	var rec; 							//Recorder.js object
	var input; 							//MediaStreamAudioSourceNode we'll be recording

	// shim for AudioContext when it's not avb. 
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioContext //audio context to help us record

	var recordButton = document.getElementById("recordButton");
	console.log(recordButton);
	var stopButton = document.getElementById("stopButton");
	var pauseButton = document.getElementById("pauseButton");

	//add events to those 2 buttons
	recordButton.addEventListener("click", startRecording);
	stopButton.addEventListener("click", stopRecording);
	pauseButton.addEventListener("click", pauseRecording);


	$('#loading-image').parent("div").css("display" , "block");

	getVoicemailList();
        

})

$("#body-row .collapse").collapse("hide");


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

	// Collapse/Expand icon
	//$('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
}



const startRecording = () =>  {
	console.log("recordButton clicked");
    $("#recordingsList").html("");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
        
		// document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) {
        console.log(err);
	  	//enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

const pauseRecording = () => {
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

const stopRecording = () =>  {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

const createDownloadLink = (blob) => {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

    var audio_html = '<div class="row mt-3"> <div class="col-md-12"> <audio style="width:100%" src="'+url+'" controls="true"></audio></div></div>';
	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	link.href = url;
	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	link.innerHTML = "Save to disk";
    var html  = "<div class='row mt-3'><div class='col-md-6 float-right'> </div> <div class='col-md-6 float-right'> <a class='btn btn-primary' href='"+url+"' download> Save to disk </a> <a class='btn btn-primary' id='SaveVoiceMail_to_server' data-blob = '"+blob+"'> Upload </a>  </div>";
    console.log(blob)
	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(filename+".wav "))

	//add the save to disk link to li
	li.appendChild(link);
	
	//upload link
	var upload = document.createElement('a');
	upload.href="/ringlessVoiceMail_api/";
	upload.innerHTML = "Upload";
	upload.addEventListener("click", function(event){
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
		  var fd=new FormData();
          
		  fd.append("audio_data",blob, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))//add a space in between
	li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
	// recordingsList.appendChild(li);
    $("#recordingsList").html("");
    $("#recordingsList").append(audio_html);
    $("#recordingsList").append(html);


	$(document).on('click','#SaveVoiceMail_to_server', function(){

		// var SERVER = "http://127.0.0.1:8000/";
		var fd = new FormData();
			  
		fd.append("audio_data",blob, filename);
		$.ajax({
	
			url : SERVER + "ringlessVoiceMail_api/upload/",
			data: fd,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST',
			type: 'POST', // For jQuery < 1.9
			headers: { "Authorization": "Bearer "+`${localStorage.getItem('user-token')}` }

			
			
		}).done( function (response) {
			console.log(response); 
			$("#recordingsList").html("");
			$("#recordRinglessVoiceMailModal").modal("toggle")
			getVoicemailList();  
		}).fail( (err) => {
				console.log(err);
				
		})
	
	});

}





$(document).on("click", ".send_voice_mail_btn", function(){
	$('#loading-image').parent("div").css("display" , "block");

	// var SERVER = "http://127.0.0.1:8000/";
	var html = "";
	$("#sendVoiceMail").attr("data-Voice_id", $(this).attr("data-id"))
	$.ajax({
		url : SERVER + "voip/api_voip/getlead",
		async : false,
		crossDomain : true,
		crossOrigin : true,
		type : 'GET',
		headers: { "Authorization": `${localStorage.getItem('user-token')}` }
   }).done( (response)=> {
		html += "<option value=''> Select </option>";
		responseText = (response).replaceAll(NaN,'""')
		var obj = JSON.parse(responseText)
		obj.forEach((item , index) => {
			html += "<option value='"+item.phone+"'> "+ item.name   +" </option>";
		
		})
		$("#voiceMailLead").html(html);
		$("#leadsModal").modal();
		$('#loading-image').parent("div").css("display" , "none");
	})
	.fail( (err) => {
		console.log(err)
		$('#loading-image').parent("div").css("display" , "none");
	})
	
})

$(document).on('click', '.remove_voice_msgs', function(){
	
	$("#remove_voice_msgs_btn").attr("data-id", $(this).attr("data-id"));
	$("#removeVoiceMailModal").modal();

})

$(document).on("click","#remove_voice_msgs_btn",function(){
	$("#removeVoiceMailModal").modal("toggle");
	$('#loading-image').parent("div").css("display" , "block");
	var voice_id = $(this).attr("data-id");
	// var SERVER = "http://127.0.0.1:8000/";
	$.ajax({
		url : SERVER + "ringlessVoiceMail_api/remove/",
		async : false,
		crossDomain : true,
		crossOrigin : true,
		type : 'DELETE',
		method : 'DELETE',
		data : {
			"voice_id" : voice_id
		},
		headers: { "Authorization": "Bearer "+`${localStorage.getItem('user-token')}` }
   }).done( (response)=> {

		getVoicemailList();
		
		swal({	
			title: "Success",	
			text: "Ringless voice mail has been deleted.",	
			icon: "success",	
			timer: 2000
			});	
			
		$('#loading-image').parent("div").css("display" , "none");
		
	})
	.fail( (err) => {
		swal({	
			title: "not deleting voicemail.",	
			text: "somthing went wrong.",	
			icon: "error",	
			timer: 2000
			});	
		console.log(err)
		$('#loading-image').parent("div").css("display" , "none");
		
	
	})

})

const getVoicemailList = () => {
	// var SERVER = "http://127.0.0.1:8000/";
	$.ajax({
		url: SERVER + "ringlessVoiceMail_api/fetch/",
		async: false,
		crossDomain: true,
		crossOrigin: true,
		type: "GET",
		contentType : 'json',
		headers: { "Authorization": "Bearer "+`${localStorage.getItem('user-token')}` }
	  }).done( (response) => {
		  console.log(response)
		  if(response.message == "success")
		  {
			  var html = "";
			  for (const element of response. ringlessVoiceMails) {
				  html += "<tr><td> "+ element.id  +" </td><td> " + element.voiceMail_name  +" </td> <td> <a class='btn btn-primary fa fa-send send_voice_mail_btn' href='javascript:;' data-id="+element.id+"> Send </a> <a class='btn btn-danger fa fa-trash remove_voice_msgs' href='javascript:;' data-id="+element.id+"> Delete </a></td></tr>";
				  
			  }
			  $("#inbound-data").html(html);
			  $('#loading-image').parent("div").css("display" , "none");
			  
		  }          
	  }).fail( (err) => {
		  swal({	
			  title: "not fetching voicemail list.",	
			  text: "somthing went wrong.",	
			  icon: "error",	
			  timer: 2000
			  });	
		  //  $('#send_sms').trigger("reset");
		  console.log(err)
		  $('#loading-image').parent("div").css("display" , "none");
	  })
}

$(document).on("click", "#sendVoiceMail", function(){
	var voice_id = $(this).attr("data-voice_id");
	var receiver = $("#voiceMailLead").val()
	if(receiver == "")
	{
		swal({	
			title: "Error",	
			text: "Please select receiver",	
			icon: "error",	
			timer: 2000
			});
			
		return false;
	}
	// var SERVER = "http://127.0.0.1:8000/";
	$.ajax({
		url: SERVER + "ringlessVoiceMail_api/send/",
		async: false,
		crossDomain: true,
		crossOrigin: true,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		data : {
			voice_id : voice_id,
			receiver : receiver
		},
		headers: { "Authorization": "Bearer "+`${localStorage.getItem('user-token')}` }
	  }).done( (response) => {
		  console.log(response)
		  swal({	
			title: "Success",	
			text: "Voice mail has been sent successfully.",	
			icon: "success",	
			timer: 2000
			});
		           
			$("#leadsModal").modal("toggle");
	  }).fail( (err) => {
		  
		  $('#loading-image').parent("div").css("display" , "none");
		  $("#leadsModal").modal("toggle");
	  })
	  
})

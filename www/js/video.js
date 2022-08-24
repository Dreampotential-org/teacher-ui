
window.addEventListener('DOMContentLoaded', init, false)

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
        Authorization: Bearer localStorage.getItem('token'),
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
          timer: 2000,
        });
      } else {
          console.log("this is else part")
        swal({
          title: 'Good job!',
          text: 'Video uploaded successfully!',
          icon: 'success',
          timer: 2000,
        });
        const file_url = response.file_url;
        displayVideo(file_url);
        function displayVideo(file_url) {
            if (file_url) {
                var strTYPE = "video/mp4";
                $('#myCarousel #video').val(file_url);
                $("#theSlide #video").append('<p> Video URL : '+ file_url +'</p><video id="videoplayer" style="height:500px;width:100%"; controls> <source src="' + file_url + '" type="' + strTYPE + '"></source></video>')
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
        timer: 2000,
      });

    });
// ---------------------------------------new update----------------------------


}

 

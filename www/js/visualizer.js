window.addEventListener('DOMContentLoaded', init, false);
$(document).ready(function () {
    $("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");
    $.ajax({
        type: "GET",
        url: SERVER+'voip/api_voip/recording_by_sid',
        dataType: 'json',
        async: true,	
        crossDomain: true,	
        crossOrigin: true,
        headers: {	
            "Authorization": `${localStorage.getItem('user-token')}`	
        },	
        success: function (obj, textstatus) {
        console.log("🚀 ~ file: lesson_responses.js ~ line 83 ~ obj", obj)
        var columnsObj = [
            { data: "date_created", "sWidth": "25%"},
            { data: "sid", "sWidth": "25%"},
            { data: "duration", "sWidth": "25%" },
            { data: "status", "sWidth": "25%" },
            { data: "price", "sWidth": "25%" },
        ];
        // console.log("🚀 ~ file: lesson_responses.js ~ line 100 ~ obj", obj)
                $('#table').DataTable({
                    data: obj,
                    columns: columnsObj,
                });
        },
        // error: function (obj, textstatus) {
        //     alert(obj.msg);
        // }
    });
    $.fn.dataTable.ext.errMode = 'none';
});

window.onload = function () {

    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    audio.load();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = 360
    canvas.height = 210;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            var r = barHeight + (25 * (i / bufferLength));
            var g = 250 * (i / bufferLength);
            var b = 50;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    renderFrame();
};
/*
$(document).ready(function () {
    var width = $(window).width();

    if (width < 800) {
        var i = 0;
        var length = $(".slide__image").length;
        setInterval(function () {
            var prev = i-1;
            if (i > length) {
                i = 0;
            }

            if(i === 0){
                prev = 0;
            }

            $(".slide__image").eq(prev).hide();
            $(".slide__image").eq(i).show();
            i++;
        }, 2000)
    }
})*/

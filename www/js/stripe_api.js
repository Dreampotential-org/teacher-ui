$(document).ready(() => {
    // Check if account is already connected to stripe
    $("#stripe-connect-button").hide();
    $.ajax({
        url: SERVER + "store_stripe/check_connection/",
        type: "GET",
        headers: {
            Authorization: `${localStorage.getItem("user-token")}`,
        },
        success: function (res) {
            console.log(res);
            $("#stripe-connect-button").show();
            $("#stripe-connect-button").attr("disabled", true);
            $("#stripe-connect-button").text("Connected to stripe");
        },
        error: function (err) {
            $("#stripe-connect-button").show();
            console.log(err);
        },
    });

    $("#stripe-connect-button").click(() => {
        $.ajax({
            url: SERVER + "store_stripe/connect/",
            type: "GET",
            headers: {
                Authorization: `${localStorage.getItem("user-token")}`,
            },
            success: (res) => {
                window.location.href = res.redirect;
            },
            error: (err) => {
                swal({
                    title: "Error",
                    text: "Some error occurred",
                    icon: "error",
                    button: "Ok",
                });
                console.log(err);
            },
        });
    });

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "return") {
        $.ajax({
            url: SERVER + "store_stripe/onboarding_complete/",
            type: "POST",
            headers: {
                Authorization: `${localStorage.getItem("user-token")}`,
            },
            success: (res) => {
                window.location.href = "userProfile.html";
            },
            error: (err) => {
                swal({
                    title: "Error",
                    text: "Some error occurred",
                    icon: "error",
                    button: "Ok",
                });
                console.log(err);
            },
        });
    }
});

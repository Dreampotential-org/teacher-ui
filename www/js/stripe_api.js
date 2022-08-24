$(document).ready(() => {
    // Check if account is already connected to stripe
    $("#stripe-connect-button").hide();
    $("#stripe-disconnect-button").hide();

    $.ajax({
        url: SERVER + "store_stripe/check_connection/",
        type: "GET",
        headers: {
            Authorization: Bearer `${localStorage.getItem("user-token")}`,
        },
        success: function (res) {
            console.log(res);
            $("#stripe-connect-button").show();
            $("#stripe-connect-button").attr("disabled", true);
            $("#stripe-connect-button").text(
                "Stripe Integration is Active and Working"
            );
            $("#stripe-disconnect-button").show();
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
                Authorization: Bearer `${localStorage.getItem("user-token")}`,
            },
            success: (res) => {
                console.log({res})
                if (res.redirect) {
                    console.log("redirecting.");
                    window.location.href = res.redirect;
                }
                // window.location.reload();
                if (res.message) {
                    swal({
                        title: "Success",
                        text: res.message,
                        icon: "success",
                        button: "Ok",
                    });
                }
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

    $("#stripe-disconnect-button").click(() => {
        $.ajax({
            url: SERVER + "store_stripe/disconnect/",
            type: "POST",
            headers: {
                Authorization: Bearer `${localStorage.getItem("user-token")}`,
            },
            success: (res) => {
                console.log(res);
                window.location.reload();
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
                Authorization: Bearer `${localStorage.getItem("user-token")}`,
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

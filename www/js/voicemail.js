
window.addEventListener('DOMContentLoaded', init, false);
$(document).ready(function () {
    $("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");
    $.ajax({
        type: "GET",
        url: SERVER+'voip/api_voip/voicemail_view',
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
        var table = $('#table').DataTable({
                    data: obj,
                    columns: columnsObj,
                });
        $()
                // $('#table tbody').on( 'click', 'tr', function () {
                //     console.log( table.row( this ).data() );
                // } );
        },
        // error: function (obj, textstatus) {
        //     alert(obj.msg);
        // }
    });
    $.fn.dataTable.ext.errMode = 'none';
});


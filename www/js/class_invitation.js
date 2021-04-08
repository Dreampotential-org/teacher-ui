SERVER = 'https://sfapp-api.dreamstate-4-all.org/'

const urlParams = new URLSearchParams(window.location.search);
var classData = {}
$(document).ready(function() {
    $.ajax({
        type: 'GET',
        async: true,
        crossDomain: true,
        crossOrigin: true,
        url: SERVER + 'students_list/invitation_info?invitationId='+urlParams.get('invitationId')+'&class_id='+urlParams.get('class_id'),
        success: (data) => {
            classData = data.class_invited;
            $('#invitationLoader').remove();
            $('#joinClassName').text(data.class_invited.class_name);
            $('#join_class').attr('hidden', false);
        },
        error:(er)=>{
            $('#invitationLoader').remove();
            $('#invalid_div').attr('hidden', false);
            swal({
                title: "Warning",
                text: `Invalid class Id`,
                icon: "warning",
            });
        }
    });
});


$('#join_form').on('submit', (ev)=> {
    ev.preventDefault();
    $('#joinbtn').attr('disabled', true)
    let formData = {};
    for (let field of $("#join_form").serializeArray()){
        formData[field.name] = field.value
    }
    $.ajax({
        type: 'POST',
        async: true,
        crossDomain: true,
        crossOrigin: true,
        data: {class_id: urlParams.get('class_id'), uuid: urlParams.get('invitationId'), ...formData},
        url: SERVER + 'students_list/class/join',
        success: (data) => { 
            $('#join_class').empty();
            let html = `<div class="text-center">
            <p class="text-success">Enrolled in class successfully</p>
            <a href="class_list.html?class_id=${classData.id}">
            <button class="btn btn-primary">Go to class</button>
            </a></div>` 
            $('#join_class').append(html);
            $('#join_class').css('height','120px');
            swal({
                title: "Class joined!",
                text: "You have enrolled in class successfully",
                icon: "success",
                buttons: false,
                timer: 1000,
            });
        },
        error:(er)=>{
            $('#joinbtn').attr('disabled', true)
            if (er.status == 409){
                $('#join_class').empty();
                let html = `<div class="text-center">
                <p class="text-danger">Already enrolled in this class</p>
                <a href="class_list.html?class_id=${classData.id}">
                <button class="btn btn-primary">Go to class</button>
                </a></div>` 
                $('#join_class').append(html);
                $('#join_class').css('height','120px');
            }            
            swal({
                title: "Warning",
                text: er.responseJSON.msg||'Something went wrong',
                icon: "warning",
            });
        }
    });
})
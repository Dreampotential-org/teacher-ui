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



$(document).ready(function () {

$("#left-sidebar").load("sidebar.html");
$("#page-header").load("header.html");
$("#tabDiv").show();
$("#systemUserDetail").hide();
$("#buyItem").hide();
// console.log("ajax call started");
// var SERVER = 'http://127.0.0.1:8000/';
var images = [];
var addImages = [];
var settings = {
  "async": true,
  "crossDomain": true,
  "url": SERVER + 'store/userItem',
  "method": "GET",
  "type": "GET",
  "processData": false,
  "contentType": false,
  // "mimeType": "multipart/form-data",
  // "data": form,
  "headers": {
      "Authorization": localStorage.getItem("user-token")
  }
};
$.ajax(settings).done(function (response) {
  // response = JSON.parse(response);
  console.log(response);
    response.forEach((item,i) => {
      var image_temp = '';
      var array_images = []
      if(item.images != '' && item.images != null){
        array_images = item.images.split(',');
        for(var i = 0; i < array_images.length; i++){
          image_temp += '<div id="imageDiv_'+i+'_'+item.id+'" style="position: relative">\
          <img id="image_'+i+'_'+item.id+'" src="'+array_images[i]+'" style="padding:5px;width:42px; height: 42px;cursor: pointer;margin-bottom: 5px;">\
          <button onclick="deleteImage(\''+array_images[i]+'\','+item.id+','+i+')" style="position: absolute; top: 1px; right: 2px" type="button" class="close" aria-label="Close">\
            <span aria-hidden="true">&times;</span>\
          </button>\
          </div>'
        }
      }
      var count_images = array_images.length;
      $("#item-data").append(`<tr>
      <input type="hidden" id="image_count_${item.id}" value="${count_images}">
      <td id=${item.id}>${item.id}</td>
      <td id="title_${item.id}">${item.title}</td>
      <td id="description_${item.id}">${item.description}</td>
      <td id="price_${item.id}">${item.price}</td>
      <td>
      <div style="display: flex;">
        <div style="padding: 10px; display: flex;">
                ${image_temp}
        </div>
      </div>
      </td>
      <td><button onclick="buyItem(${item.id})" class="btn btn-primary">Buy</button></td>
      <td><button type="button" class="btn btn-warning itemEditModal" 
      data-toggle="modal" 
      data-id="${item.id}" 
      data-target="#itemEditModal">
      Edit
      </button></td>
      <td><button onclick="deleteItem(${item.id})" class="btn btn-danger">Delete</button></td>
      </tr>`);
  })
  $('#item_data_table').DataTable({
  "paging": true,
  "pageLength": 5 // false to disable pagination (or any other option)
  });
  
}).fail(function (response) {
  console.log("get user item list is Failed!");
  swal({
      title: "Error!",
      text: "there is some error!",
      icon: "warning",
  });
});
document.getElementById('imageFile').onchange = function (event) {
    images = [];
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      console.log('filesAmount', filesAmount);
      for (var i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event) => {
          console.log('event.target.result....');
          images.push(event.target.result);
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

document.getElementById('editimageFile').onchange = function (event) {
  addImages = [];
  if (event.target.files && event.target.files[0]) {
    var filesAmount = event.target.files.length;
    console.log('filesAmount', filesAmount);
    for (var i = 0; i < filesAmount; i++) {
      var reader = new FileReader();

      reader.onload = (event) => {
        console.log('event.target.result....');
        addImages.push(event.target.result);
      }

      reader.readAsDataURL(event.target.files[i]);
    }
  }
}  
$("#additem").submit((event) => {
  event.preventDefault()
  // craete item
  var item_form = new FormData();
  item_form.append("title", $("#title").val())
  item_form.append("description", $("#description").val())
  item_form.append("price", $("#price").val())
  var json_arr = JSON.stringify(images);
  item_form.append("images", json_arr)

  var settings_add_item = {
    "async": true,
    "crossDomain": true,
    "url": SERVER + 'store/userItem',
    "method": "POST",
    "type": "POST",
    "processData": false,
    "contentType": false,
    // "mimeType": "multipart/form-data",
    "data": item_form,
    "headers": {
        "Authorization": localStorage.getItem("user-token")
    }
  };
  console.log(images.length);
  $.ajax(settings_add_item).done(function (response) {
    // response = JSON.parse(response);
    console.log(response);
    images = [];
    location.reload()
  }).fail(function (response) {
          console.log(response,"add item Failed!");
    swal({
        title: "Error!",
        text: "Add Item is failed!",
        icon: "warning",
    });
  });

})

// update item
// assign values to input fields
$(document).on("click", ".itemEditModal", function () {
  var id = $(this).data('id');
  var title = document.getElementById("title_"+id).textContent;
  var price = document.getElementById("price_"+id).textContent;
  var description = document.getElementById("description_"+id).textContent;
  
  $("[id='editTitle']").val(title);
  $("[id='editPrice']").val(price);
  $("[id='editDescription']").val(description);
  $("[id='edit_id']").val(id);

  var image_count = document.getElementById("image_count_"+id).value;
  $("#imagesUpdateDisplay").empty();
  for(var i = 0; i < image_count; i++){
    var image_scr = $('#image_'+i+'_'+id+'').attr('src');
    $("#imagesUpdateDisplay").append('<img src="'+image_scr+'" style="padding:5px;width:42px; height: 42px;cursor: pointer;">')
  }
});

// send data
$("#edititem").submit((event) => {
  event.preventDefault()
  // update item
  var item_form = new FormData();
  item_form.append("id", $("#edit_id").val())
  item_form.append("title", $("#editTitle").val())
  item_form.append("description", $("#editDescription").val())
  item_form.append("price", $("#editPrice").val())
  var json_arr = JSON.stringify(addImages);
  item_form.append("images", json_arr)
  var settings_add_item_update = {
    "async": true,
    "crossDomain": true,
    "url": SERVER + 'store/userItemDetail/'+$("#edit_id").val(),
    "method": "POST",
    "type": "POST",
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": item_form,
    "headers": {
        "Authorization": localStorage.getItem("user-token")
    }
  };
  $.ajax(settings_add_item_update).done(function (response) {
    // response = JSON.parse(response);
    console.log(response);
    location.reload()
  }).fail(function (response) {
          console.log("Edit item Failed!");
    swal({
        title: "Error!",
        text: "Edit Item is failed!",
        icon: "warning",
    });
  });

})


});
$("#body-row .collapse").collapse("hide");

// delete image
function deleteImage(imageURL,id,countNum){
  var item_form = new FormData();
  item_form.append("id", id)
  item_form.append("imageURL", imageURL)
  var settings_delete_item_image = {
    "async": true,
    "crossDomain": true,
    "url": SERVER + 'store/deleteImage',
    "method": "POST",
    "type": "POST",
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": item_form,
    "headers": {
        "Authorization": localStorage.getItem("user-token")
    }
  };
  $.ajax(settings_delete_item_image).done(function (response) {
    // response = JSON.parse(response);
    console.log(response);
    // $( "#imageDiv_"+countNum+"_"+id+"").remove();
    swal({
      title: "Success",
      text: "Image is deleted Successfully",
      icon: "success",
  });
  location.reload()
  }).fail(function (response) {
    swal({
        title: "Error!",
        text: "Delete Image is failed!",
        icon: "warning",
    });
  });
}

// Collapse/Expand icon
//$('#collapse-icon').addClass('fa-angle-double-left');

// Collapse click
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

}

function deleteItem(id){
    swal({   
          title: "Are you sure?",   
          text: "You will not be able to recover this Item!",   
          type: "warning",   
          showCancelButton: true,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "Yes, delete it!",   
          closeOnConfirm: false 
      }, function (isConfirmed) {
          if(isConfirmed) {

            var settings_add_item_delete = {
              "async": true,
              "crossDomain": true,
              "url": SERVER + 'store/userItemDetail/'+id,
              "method": "DELETE",
              "type": "DELETE",
              "processData": false,
              "contentType": false,
              // "mimeType": "multipart/form-data",
              // "data": item_form,
              "headers": {
                  "Authorization": localStorage.getItem("user-token")
              }
            };
            $.ajax(settings_add_item_delete).done(function (response) {
              swal("Deleted!", "Your Item has been deleted.", "success"); 
              location.reload()
            }).fail(function (response) {
                    console.log("Delete item Failed!");
              swal({
                  title: "Error!",
                  text: "Delete Item is failed!",
                  icon: "warning",
              });
            });
          }
      })
}

function buyItem(id){
  var settings_buy_item = {
    "async": true,
    "crossDomain": true,
    "url": SERVER + 'store/UserOrderItem/'+id,
    "method": "POST",
    "type": "POST",
    "processData": false,
    "contentType": false,
    // "mimeType": "multipart/form-data",
    // "data": item_form,
    "headers": {
        "Authorization": localStorage.getItem("user-token")
    }
  };
  $.ajax(settings_buy_item).done(function (response) {
    $("#buyItem").show();
    $("#tabDiv").hide();
    // window.location.href="http://localhost:8086/checkout.html";
    console.log(response.title);
    $("[id='itemTitle']").html(response.title);
    $("[id='itemPrice']").html(response.price);
    $("[id='item_ID']").val(response.id);
    $("[id='client_token']").val(response.client_token);

    //////// order send data
    var form = document.querySelector("#payment-form");
    var client_token = response.client_token;
    braintree.dropin.create(
      {
        authorization: client_token,
        container: "#bt-dropin",
        paypal: {
          flow: "vault",
        },
      },
      function (createErr, instance) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          instance.requestPaymentMethod(function (err, payload) {
            if (err) {
              console.log("Error", err);
              return;
            }

            // Add the nonce to the form and submit
            document.querySelector("#nonce").value = payload.nonce;
            // form.submit();
            // event.preventDefault()
            // update item
            // alert($("#nonce").val())
            var order_form = new FormData();
            order_form.append("id", $("#item_ID").val())
            order_form.append("title", $("#itemTitle").text())
            order_form.append("payment_method_nonce", payload.nonce)
            order_form.append("price", $("#itemPrice").text())
            order_form.append("user-name", localStorage.getItem("user-name"))
            var settings_add_order = {
              "async": true,
              "crossDomain": true,
              "url": SERVER + 'store/UserCheckout',
              "method": "POST",
              "type": "POST",
              "processData": false,
              "contentType": false,
              "mimeType": "multipart/form-data",
              "data": order_form,
              "headers": {
                  "Authorization": localStorage.getItem("user-token")
              }
            };
            $.ajax(settings_add_order).done(function (response) {
              // response = JSON.parse(response);
              console.log(response);
              var resp = JSON.parse(response)
              if(resp.success == true){
                swal({
                  title: "Thank you",
                  text: "Your Order id is "+resp.ID,
                  icon: "success",
                }, function (isConfirmed) {
                  if(isConfirmed) {
                    location.reload()
                  }});
              }else{
                swal({
                  title: "Try Again",
                  text: "Your Order is not complete.",
                  icon: "error",
                }, function (isConfirmed) {
                  if(isConfirmed) {
                    location.reload()
                  }});

              }
            }).fail(function (response) {
              console.log("order is Failed!");
              swal({
                  title: "Error!",
                  text: "Order is failed!",
                  icon: "warning",
              });
            });
          });
        });
      }
    );
    //////
    
  }).fail(function (response) {
    console.log("Buy item Failed!");
    swal({
        title: "Error!",
        text: "Buy Item is failed!",
        icon: "warning",
    });
  });
}

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
      // console.log(item);
      // console.log(i);
      $("#item-data").append(`<tr>
      <td id=${item.id}>${item.id}</td>
      <td id="title_${item.id}">${item.title}</td>
      <td id="description_${item.id}">${item.description}</td>
      <td id="price_${item.id}">${item.price}</td>
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

$("#additem").submit((event) => {
  event.preventDefault()
  // craete item
  var item_form = new FormData();
  item_form.append("title", $("#title").val())
  item_form.append("description", $("#description").val())
  item_form.append("price", $("#price").val())
  var settings_add_item = {
    "async": true,
    "crossDomain": true,
    "url": SERVER + 'store/userItem',
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
  $.ajax(settings_add_item).done(function (response) {
    // response = JSON.parse(response);
    console.log(response);
    location.reload()
  }).fail(function (response) {
          console.log("add item Failed!");
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



// var group_data = [
// { class_id: "CLS1", group_name: "group1" },
// { class_id: "CLS2", group_name: "group2" },
// { class_id: "CLS3", group_name: "group3" },
// ];
// var system_users;
// var system_students;
// var all_students;
        

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

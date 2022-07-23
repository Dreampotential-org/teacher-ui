function init_notifications() {
    alert("hello new code")
    set_server();
    socket = new WebSocket(WEBSOCKET_HOST + '/notifications/' + 'room1' + '/');
    socket.onopen = function open() {
        console.log('WebSockets connection created.');
        var dict = {
            action: "store_user_name",
            user_name: 'hammad',
            email: 'hammad@gmail.com',
            phone_number: '1234567890',
            meeting_url: "https://localhost:8080/room1" + "#config.prejoinPageEnabled=false",
            roomVisitor: true
        }
        // socket.send(document.getElementById("message").value);
        socket.send(JSON.stringify(dict));
    };
    socket.onmessage = function (event) {
        web_socket_data = JSON.parse(event.data);
        console.log(web_socket_data);
    }
}



window.addEventListener("DOMContentLoaded", init_notifications, false);


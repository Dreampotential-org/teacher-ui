
    // set the channel to the input area on load
    function getChannel(){
      var url = new URL(window.location.href);
      if(url.searchParams.get("channel")){
        document.getElementById("channel").value = url.searchParams.get("channel");
      }

    }

    // copy room link
    function copyElementText(id) {
      var text = document.getElementById(id).innerText;
      var elem = document.createElement("textarea");
      document.body.appendChild(elem);
      elem.value = text;
      elem.select();
      document.execCommand("copy");
      document.body.removeChild(elem);
      Toast.notice("copied to clipboard");
  }


    // check if compatible
    console.log("agora sdk version: " + AgoraRTC.VERSION + " compatible: " + AgoraRTC.checkSystemRequirements());
    

    function Toastify (options) {
      M.toast({html: options.text, classes: options.classes})
    }

    var Toast = {
      info: (msg) => {
        Toastify({
          text: msg,
          classes: "info-toast"
        })
      },
      notice: (msg) => {
        Toastify({
          text: msg,
          classes: "notice-toast"
        })
      },
      error: (msg) => {
        Toastify({
          text: msg,
          classes: "error-toast"
        })
      }
    }
    // check for empty input.
    function validator(formData, fields) {
      var keys = Object.keys(formData)
      for (let key of keys) {
        if (fields.indexOf(key) != -1) {
          if (!formData[key]) {
            Toast.error("Please Enter " + key)
            return false
          }
        }
      }
      return true
    }

    // serialize data from form 
    function serializeformData() {
      var formData = $("#form").serializeArray()
      var obj = {}
      for (var item of formData) {
        var key = item.name
        var val = item.value
        obj[key] = val
      }
      return obj
    }

    
    // adding video stream
    function addView (id, show) {
      if (!$("#" + id)[0]) {
        $("<div/>", {
          id: "remote_video_panel_" + id,
          class: "video-view",
        }).appendTo("#video")

        $("<div/>", {
          id: "remote_video_" + id,
          class: "video-placeholder",
          html: '<p> ' + id +'</p>',
        }).appendTo("#remote_video_panel_" + id)

      }
    }
    function removeView (id) {
      if ($("#remote_video_panel_" + id)[0]) {
        $("#remote_video_panel_"+id).remove()
      }
    }

    // get client devices
    function getDevices (next) {
      AgoraRTC.getDevices(function (items) {
        items.filter(function (item) {
          return ["audioinput"].indexOf(item.kind) !== -1
        })
        .map(function (item) {
          return {
          name: item.label,
          value: item.deviceId,
          kind: item.kind,
          }
        })
        var audios = []
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          if ("audioinput" == item.kind) {
            var name = item.label
            var value = item.deviceId
            if (!name) {
              name = "microphone-" + audios.length
            }
            audios.push({
              name: name,
              value: value,
              kind: item.kind
            })
          }
        }
        next({audios: audios})
      })
    }

    var rtc = {
      client: null,
      joined: false,
      published: false,
      localStream: null,
      remoteStreams: [],
      params: {}
    }

    function handleEvents (rtc) {
      // Occurs when an error message is reported and requires error handling.
      rtc.client.on("error", (err) => {
        console.log(err)
      })
      // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
      rtc.client.on("peer-leave", function (evt) {
        var id = evt.uid;
        console.log("id", evt)
        let streams = rtc.remoteStreams.filter(e => id !== e.getId())
        let peerStream = rtc.remoteStreams.find(e => id === e.getId())
        if(peerStream && peerStream.isPlaying()) {
          peerStream.stop()
        }
        rtc.remoteStreams = streams
        if (id !== rtc.params.uid) {
          removeView(id)
        }
        Toast.notice(id + " Unpublished or left the meeting.")
        console.log("peer-leave", id)
      })
      // Occurs when the local stream is published.
      rtc.client.on("stream-published", function (evt) {
        Toast.notice("Microphone is open")
        console.log("stream-published")
      })
      // Occurs when the remote stream is added.
      rtc.client.on("stream-added", function (evt) {  
        var remoteStream = evt.stream
        var id = remoteStream.getId()
        Toast.info(id + " mic open")
        if (id !== rtc.params.uid) {
          rtc.client.subscribe(remoteStream, function (err) {
            console.log("microphone stream failed", err)
          })
        }
        console.log("stream-added remote-uid: ", id)
      })
      // Occurs when a user subscribes to a remote stream.
      rtc.client.on("stream-subscribed", function (evt) {
        var remoteStream = evt.stream
        var id = remoteStream.getId()
        rtc.remoteStreams.push(remoteStream)
        addView(id)
        remoteStream.play("remote_video_" + id)
        Toast.info(id + " unmute")
        console.log("stream-subscribed remote-uid: ", id)
      })
      // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
      rtc.client.on("stream-removed", function (evt) {
        var remoteStream = evt.stream
        var id = remoteStream.getId()
        Toast.info(id + "muted")
        if(remoteStream.isPlaying()) {
          remoteStream.stop()
        }
        rtc.remoteStreams = rtc.remoteStreams.filter(function (stream) {
          return stream.getId() !== id
        })
        removeView(id)
        console.log("stream-removed remote-uid: ", id)
      })
      rtc.client.on("onTokenPrivilegeWillExpire", function(){
        // After requesting a new token
        // rtc.client.renewToken(token);
        Toast.info("onTokenPrivilegeWillExpire")
        console.log("onTokenPrivilegeWillExpire")
      })
      rtc.client.on("onTokenPrivilegeDidExpire", function(){
        // After requesting a new token
        // client.renewToken(token);
        Toast.info("onTokenPrivilegeDidExpire")
        console.log("onTokenPrivilegeDidExpire")
      })
    }


    /**
      * rtc: rtc object
      * option: {
      *  mode: string, "live" | "rtc"
      *  codec: string, "h264" | "vp8"
      *  appID: string
      *  channel: string, channel name
      *  uid: number
      *  token; string,
      * }
     **/
    
     function join_channel(rtc, option){
      /*
        this function is responsible on joining a channel for audio room. 
      */
      var SERVER ='https://api.dreampotential.org/'
      var response;
      $.ajax({
            url: SERVER + "token/api/get_token/",
            type: "POST",
            data: {
              'channel_name': option.channel
            },
            success: function(response) {
                option.appID = response.app_id
                option.token = response.token
                // Whatever you want to do after the form is successfully submitted
                console.log(response);
                if (rtc.joined) {
                  Toast.error("Your already joined")
                  return;
                }
                
                /**
                 * A class defining the properties of the config parameter in the createClient method.
                 * Note:
                 *    Ensure that you do not leave mode and codec as empty.
                 *    Ensure that you set these properties before calling Client.join.
                 *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
                **/
                rtc.client = AgoraRTC.createClient({mode: option.mode, codec: option.codec})
                rtc.params = option

                // handle AgoraRTC client event
                handleEvents(rtc)

                // init client
                rtc.client.init(option.appID, function () {
                  console.log("init success")

                  /**
                   * Joins an AgoraRTC Channel
                   * This method joins an AgoraRTC channel.
                   * Parameters
                   * tokenOrKey: string | null
                   *    Low security requirements: Pass null as the parameter value.
                   *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
                   *  channel: string
                   *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
                   *    26 lowercase English letters a-z
                   *    26 uppercase English letters A-Z
                   *    10 numbers 0-9
                   *    Space
                   *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
                   *  uid: number | null
                   *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
                   *   Note:
                   *      All users in the same channel should have the same type (number or string) of uid.
                   *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
                  **/
                  rtc.client.join(option.token ? option.token : null, option.channel , option.uid, function (uid) {
                    Toast.notice(option.uid + " joined the room: " + option.channel)
                    console.log("join channel: " + option.channel + " success, uid: " + option.uid)
                    rtc.joined = true

                    rtc.params.uid = uid
                    
                    // set call room link
                    document.getElementById("room-link").innerText = location.protocol + '//' + location.host + location.pathname + "?channel=" + option.channel;
                   
                    // create local stream
                    rtc.localStream = AgoraRTC.createStream({
                      streamID: rtc.params.uid,
                      audio: true,
                      video: false,
                      screen: false,
                      microphoneId: option.microphoneId
                    })

                    // initialize local stream. Callback function executed after intitialization is done
                    rtc.localStream.init(function () {
                      console.log("init local stream success")
                      // play stream with html element id "local_stream"
                      rtc.localStream.play("local_stream")

                      // publish local stream
                      publish(rtc)
                    }, function (err)  {
                      Toast.error("stream init failed, please open console see more detail")
                      console.error("init local stream failed ", err)
                    })
                  }, function(err) {
                    Toast.error("client join failed, please open console see more detail")
                    console.error("client join failed", err)
                  })
                }, (err) => {
                  Toast.error("client init failed, please open console see more detail")
                  console.error(err)
                })
                
            },
            error: function(err) {
              Toast.error("client init failed, please open console see more detail")
                  console.error(err)
            },
        }); 
    }


    function publish (rtc) {
      if (!rtc.client) {
        Toast.error("Please Join Room First")
        return
      }
      if (rtc.published) {
        Toast.error("Your already published")
        return
      }
      var oldState = rtc.published

      // publish localStream
      rtc.client.publish(rtc.localStream, function (err) {
        rtc.published = oldState
        console.log("publish failed")
        Toast.error("publish failed")
        console.error(err)
      })
      Toast.info("publish")
      rtc.published = true
    }

    function unpublish (rtc) {
      if (!rtc.client) {
        Toast.error("Please Join Room First")
        return
      }
      if (!rtc.published) {
        Toast.error("Your didn't publish")
        return
      }
      var oldState = rtc.published
      rtc.client.unpublish(rtc.localStream, function (err) {
        rtc.published = oldState
        console.log("unpublish failed")
        Toast.error("unpublish failed")
        console.error(err)
      })
      Toast.info("unpublish")
      rtc.published = false
    }

    function leave (rtc) {
      document.getElementById("room-link").value = '';
      if (!rtc.client) {
        Toast.error("Please Join First!")
        return
      }
      if (!rtc.joined) {
        Toast.error("You are not in channel")
        return
      }
      /**
       * Leaves an AgoraRTC Channel
       * This method enables a user to leave a channel.
       **/
      rtc.client.leave(function () {
        // stop stream
        if(rtc.localStream.isPlaying()) {
          rtc.localStream.stop()
        }
        // close stream
        rtc.localStream.close()
        for (let i = 0; i < rtc.remoteStreams.length; i++) {
          var stream = rtc.remoteStreams.shift()
          var id = stream.getId()
          if(stream.isPlaying()) {
            stream.stop()
          }
          removeView(id)
        }

        document.getElementById("room-link").innerText = '';

        rtc.localStream = null
        rtc.remoteStreams = []
        rtc.client = null
        console.log("client leaves channel success")
        rtc.published = false
        rtc.joined = false
        Toast.notice("leave success")
      }, function (err) {
        console.log("channel leave failed")
        Toast.error("leave success")
        console.error(err)
      })
    }

    // This function automatically executes when a document is ready.
    $(function () {
      // This will fetch all the devices and will populate the UI for every device. (Audio and Video)
      getDevices(function (devices) {
        devices.audios.forEach(function (audio) {
          $("<option/>", {
            value: audio.value,
            text: audio.name,
          }).appendTo("#microphoneId")
        })
       
        M.AutoInit()
      })


      /*
        button functions 
      */
      var fields = ["channel", "uid"]

      // This will start the join functions with all the configuration selected by the user.
      $("#join").on("click", function async (e) {
        console.log("join")
        e.preventDefault();
        var params = serializeformData(); // Data is feteched and serilized from the form element.
        if (validator(params, fields)) {
          join_channel(rtc, params)
        }
      })
      // This publishes the video feed to Agora
      $("#publish").on("click", function (e) {
        console.log("publish")
        e.preventDefault()
        var params = serializeformData()
        if (validator(params, fields)) {
          publish(rtc)
        }
      });
      // Unpublishes the video feed from Agora
      $("#unpublish").on("click", function (e) {
        console.log("unpublish")
        e.preventDefault()
        var params = serializeformData()
        if (validator(params, fields)) {
          unpublish(rtc)
        }
      });
      // Leeaves the chanenl if someone clicks the leave button
      $("#leave").on("click", function (e) {
        console.log("leave")
        e.preventDefault()
        var params = serializeformData()
        if (validator(params, fields)) {
          leave(rtc)
        }
      });
    });

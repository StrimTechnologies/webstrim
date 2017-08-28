var enableRecordings = false;

var connection = new RTCMultiConnection();

connection.enableScalableBroadcast = true;

room = WebService("GET", "devices/secured/" + sessionStorage.getItem("deviceid"));

if (joinroomid == null) {
    if (room.roomInfo != null) {
        var broadcastId = room.roomInfo;
    }
} else {
    var broadcastId = joinroomid;
}
connection.maxRelayLimitPerUser = 1;
connection.autoCloseEntireSession = true;
connection.socketURL = RTCurl;
connection.socketMessageEvent = 'strim-me';

connection.connectSocket(function (socket) {
    connection.socketOptions.transport = 'polling';
    connection.socketOptions.forceNew = true;
    connection.socketOptions['try multiple transports'] = false;
    connection.socketOptions.secure = true;
    connection.socketOptions.port = '443';

//    document.getElementById('input-text-chat').disabled = false;
    $('#input-text-chat').disabled = false;

    socket.on('join-broadcaster', function (hintsToJoinBroadcast) {
        console.log('join-broadcaster', hintsToJoinBroadcast);

        connection.session = hintsToJoinBroadcast.typeOfStreams;

        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };

        connection.broadcastId = hintsToJoinBroadcast.broadcastId;
        connection.join(hintsToJoinBroadcast.userid);
    });

    socket.on('rejoin-broadcast', function (broadcastId) {
        console.log('rejoin-broadcast', broadcastId);

        connection.attachStreams = [];
        socket.emit('check-broadcast-presence', broadcastId, function (isBroadcastExists) {
            if (!isBroadcastExists) {
                connection.userid = broadcastId;
            }

            socket.emit('join-broadcast', {
                broadcastId: broadcastId,
                userid: connection.userid,
                typeOfStreams: connection.session
            });
        });
    });

    socket.on('broadcast-stopped', function (broadcastId) {
        sessionStorage.removeItem("joinroomid");
        console.error('broadcast-stopped', broadcastId);
        alert('This broadcast has been stopped.');
        document.getElementById('open-or-join').disabled = false;
        document.getElementById('stop').disabled = true;
        document.getElementById('input-text-chat').disabled = true;
        sessionStorage.removeItem("joinroomid");
        sessionStorage.removeItem("start");
        sessionStorage.setItem('fullscreentoggle', 'true');
        window.top.location.reload();
    });

    socket.on('start-broadcasting', function (typeOfStreams) {
        console.log('start-broadcasting', typeOfStreams);

        connection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: false,
            OfferToReceiveAudio: false
        };

        connection.session = typeOfStreams;

        connection.open(connection.userid, function () {
            showRoomURL(connection.sessionid);
            document.getElementById('input-text-chat').disabled = false;
        });
    });
});

connection.onopen = function (event) {
    connection.send('Connected');
};

connection.onmessage = function (event) {
    var mesaj = event.userid + ': ' + event.data;
    appendDIV('<p style="color:blue;padding:5px;">' + mesaj + '</p>');
};

document.getElementById('input-text-chat').onkeyup = function (e) {
    if (e.keyCode != 13)
        return;
    this.value = this.value.replace(/^\s+|\s+$/g, '');
    if (!this.value.length)
        return;
    connection.send(this.value);
    appendDIV('<p style="padding:5px;">Me: ' + this.value + '</p>');
    this.value = '';
};

var chatContainer = document.getElementById('chat-output');
function appendDIV(event) {
    var div = document.createElement('div');
    div.innerHTML = event.data || event;
    chatContainer.insertBefore(div, chatContainer.firstChild);
    div.tabIndex = 0;
    document.getElementById('video-preview').scrollIntoView();
}

window.onbeforeunload = function () {
    document.getElementById('open-or-join').disabled = false;
    document.getElementById('stop').disabled = false;
    document.getElementById('open-or-join').disabled = false;
    document.getElementById('input-text-chat').disabled = false;
};

var videoPreview = document.getElementById('video-preview');

connection.onstream = function (event) {
    if (connection.isInitiator && event.type !== 'local') {
        return;
    }

    if (event.mediaElement) {
        event.mediaElement.pause();
        delete event.mediaElement;
    }

    connection.isUpperUserLeft = false;
    videoPreview.src = URL.createObjectURL(event.stream);
    videoPreview.play();
    videoPreview.userid = event.userid;

    if (event.type === 'local') {
        videoPreview.muted = true;
    }

    if (connection.isInitiator == false && event.type === 'remote') {
        connection.dontCaptureUserMedia = true;
        connection.attachStreams = [event.stream];
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };

        var socket = connection.getSocket();
        socket.emit('can-relay-broadcast');

        if (connection.DetectRTC.browser.name === 'Chrome') {
            connection.getAllParticipants().forEach(function (p) {
                if (p + '' != event.userid + '') {
                    var peer = connection.peers[p].peer;
                    peer.getLocalStreams().forEach(function (localStream) {
                        peer.removeStream(localStream);
                    });
                    event.stream.getTracks().forEach(function (track) {
                        peer.addTrack(track, event.stream);
                    });
                    connection.dontAttachStream = true;
                    connection.renegotiate(p);
                    connection.dontAttachStream = false;
                }
            });
        }

        if (connection.DetectRTC.browser.name === 'Firefox') {
            connection.getAllParticipants().forEach(function (p) {
                if (p + '' != event.userid + '') {
                    connection.replaceTrack(event.stream, p);
                }
            });
        }

        if (connection.DetectRTC.browser.name === 'Chrome') {
            repeatedlyRecordStream(event.stream);
        }
    }
};

//document.getElementById('stop').onclick = function () {        
$('#stop').on('click', function () {

    connection.attachStreams.forEach(function (localStream) {
        localStream.stop();
        connection.close();
    });

    if (sessionStorage.getItem('start') == 'true') {
        if (joinroomid == null) {
            strimdata = JSON.stringify({
                "deviceId": sessionStorage.getItem("deviceid"),
                "price": null,
                "roomInfo": null,
                "strimInfo": null,
                "strimLocation": null,
                "strimName": null,
                "strimStatus": null,
                "userId": {
                    "userId": sessionStorage.getItem("id")},
                "deviceName": sessionStorage.getItem("deviceName"),
                "modelId": sessionStorage.getItem("modelId")
            });

            clearRoom = WebService("PUT", "devices/secured/update", strimdata);
            if (clearRoom == null) {
               // alert("Strim stopped. Room cleared");

            } else {
                alert("Could not clear room info!");
            }
        } else {
            WebService("PUT", "devices/secured/update/strimStatus/" + sessionStorage.getItem("hoster") + "/true", '');
        }
        sessionStorage.removeItem("joinroomid");
        sessionStorage.removeItem("start");
        sessionStorage.setItem('fullscreentoggle', 'true');
        //window.location.reload();

        /*
         $('#liveCamera').on('click', function () {
         openTabs(event, 'CreateStrim');
         });
         $('.toggle').show();
         $('.toggle').click();
         */

        window.location.href = "main.html";
        // $('#level1', window.parent.document).show();
        // $('#toggle', window.parent.document).show();        
        // window.location.href="stream.html";
        // parent.document.getElementById("defaultOpen").click();

    }
});

connection.session = {
    audio: true,
    video: true,
    oneway: true,
    data: true
};

connection.bandwidth = {
    audio: 400,
    video: 2500,
    screen: 2500
};

if (connection.DetectRTC.browser.name === 'Firefox') {
    document.getElementById('alldevices').innerHTML = '<option value="user">Front Facing Camera</option><option value="application">Back Facing Camera</option>';
}

if (connection.DetectRTC.browser.name === 'Chrome') {
    navigator.getUserMedia({video: true, audio: true},
            function (localMediaStream) {
                var skipDuplicateDevices = {};
                connection.DetectRTC.load(function () {
                    connection.DetectRTC.videoInputDevices.forEach(function (device) {
                        if (skipDuplicateDevices[device.id])
                            return;
                        skipDuplicateDevices[device.id] = true;
                        var option = document.createElement('option');
                        option.innerHTML = device.label;
                        option.value = device.id;
                        document.getElementById('alldevices').appendChild(option);
                    });
                });
            },
            function (err) {
                alert("Please allow camera.");
            }
    );
}


$('#alldevices').change(function () {
    var videoSourceId = $(this).val();
    if (connection.DetectRTC.browser.name === 'Chrome') {
        if (connection.mediaConstraints.video.optional.length && connection.attachStreams.length) {
            if (connection.mediaConstraints.video.optional[0].sourceId === videoSourceId) {
                alert('Selected video device is already selected.');
                return;
            }
        }

        connection.attachStreams.forEach(function (stream) {
            stream.getVideoTracks().forEach(function (track) {
                stream.removeTrack(track);
                if (track.stop) {
                    track.stop();
                }
            });
        });

        connection.attachStreams.forEach(function (localStream) {
            localStream.stop();
        });

    }
    /*
     connection.mediaConstraints.video.optional = [{
     sourceId: videoSourceId
     }];    */

    if (DetectRTC.browser.name === 'Firefox') {

        connection.getAllParticipants().forEach(function (p) {
            if (p + '' != event.userid + '') {
                connection.replaceTrack(event.stream, p);
            }
        });

        videoConstraints = {
            deviceId: videoSourceId
        };
    } else {
        var videoConstraints = {
            mandatory: {},
            optional: [{
                    sourceId: videoSourceId
                }]
        };
    }

    connection.mediaConstraints.video = videoConstraints;
    connection.captureUserMedia();
    connection.addStream({
        audio: true,
        video: true,
        oneway: true,
        data: true
    });


});

// document.getElementById('ff-switch').onclick = function () {    
$('#ff-switch').on('click', function () {
    $('#alldevices').change();
});

//document.getElementById('open-or-join').onclick = function () {
$('#open-or-join').on('click', function () {
    if (joinroomid == null && room.roomInfo == null)
    {
        alert("You have to create a Live Strim first !");
    } else {
        sessionStorage.setItem('start', 'true');
        $('#level1').hide();
        $('#toggle').hide();

        appendDIV('Live ON');

        if (joinroomid == null) {
            if (room.roomInfo != null) {

                var broadcastId = room.roomInfo;
                WebService("PUT", "devices/secured/update/strimStatus/" + sessionStorage.getItem("deviceid") + "/true", '');
                if (connection.DetectRTC.browser.name === 'Chrome') {
                    $('#allcameras').show();
                }
                /*
                 if (connection.DetectRTC.browser.name === 'Firefox') {
                 $('#ff-switch').show();
                 }*/
            }
        } else {
            var broadcastId = joinroomid;
            if (sessionStorage.getItem("hosterName") != "broadcast1" && sessionStorage.getItem("hosterName") != "broadcast2" && sessionStorage.getItem("hosterName") != "broadcast3" && sessionStorage.getItem("hosterName") != "broadcast4")
            {
                WebService("PUT", "devices/secured/update/strimStatus/" + sessionStorage.getItem("hoster") + "/false", '');
            }
        }

        //document.getElementById('open-or-join').disabled = true;
        //document.getElementById('stop').disabled = false;
        $('#open-or-join').disabled = true;
        $('#stop').disabled = false;

        var socket = connection.getSocket();

        socket.emit('check-broadcast-presence', broadcastId, function (isBroadcastExists) {
            if (!isBroadcastExists) {
                // the first person (i.e. real-broadcaster) MUST set his user-id
                connection.userid = broadcastId;
            }

            console.log('check-broadcast-presence', broadcastId, isBroadcastExists);

            socket.emit('join-broadcast', {
                broadcastId: broadcastId,
                userid: connection.userid,
                typeOfStreams: connection.session
            });
        });
    }
});

connection.onstreamended = function () {};

connection.onleave = function (event) {
    appendDIV(event.userid + ' Disconnected');
    if (event.userid !== videoPreview.userid)
        return;

    var socket = connection.getSocket();
    socket.emit('can-not-relay-broadcast');

    connection.isUpperUserLeft = true;

    if (allRecordedBlobs.length) {
        // playing lats recorded blob
        var lastBlob = allRecordedBlobs[allRecordedBlobs.length - 1];
        videoPreview.src = URL.createObjectURL(lastBlob);
        videoPreview.play();
        allRecordedBlobs = [];
    } else if (connection.currentRecorder) {
        var recorder = connection.currentRecorder;
        connection.currentRecorder = null;
        recorder.stopRecording(function () {
            if (!connection.isUpperUserLeft)
                return;

            videoPreview.src = URL.createObjectURL(recorder.blob);
            videoPreview.play();
        });
    }

    if (connection.currentRecorder) {
        connection.currentRecorder.stopRecording();
        connection.currentRecorder = null;
    }

};

var allRecordedBlobs = [];

function repeatedlyRecordStream(stream) {
    if (!enableRecordings) {
        return;
    }

    connection.currentRecorder = RecordRTC(stream, {
        type: 'video'
    });

    connection.currentRecorder.startRecording();

    setTimeout(function () {
        if (connection.isUpperUserLeft || !connection.currentRecorder) {
            return;
        }

        connection.currentRecorder.stopRecording(function () {
            allRecordedBlobs.push(connection.currentRecorder.blob);

            if (connection.isUpperUserLeft) {
                return;
            }

            connection.currentRecorder = null;
            repeatedlyRecordStream(stream);
        });
    }, 30 * 1000); // 30-seconds
}

function disableInputButtons() {
    document.getElementById('open-or-join').disabled = true;
    document.getElementById('broadcast-id').disabled = true;
    document.getElementById('stop').disabled = true;
    document.getElementById('input-text-chat').disabled = true;
}

function showRoomURL(broadcastId) {
    var html = 'Peer-to-peer Strim is LIVE!';
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
}
connection.onNumberOfBroadcastViewersUpdated = function (event) {
    if (!connection.isInitiator)
        return;
    document.getElementById('broadcast-viewers-counter').innerHTML = 'Number of broadcast viewers: <b>' + event.numberOfBroadcastViewers + '</b>';
};

(function () {
    var params = {},
            r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);
    window.params = params;
})();

var broadcastId = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
    broadcastId = localStorage.getItem(connection.socketMessageEvent);
} else {
    broadcastId = connection.token();
}

var hashString = location.hash.replace('#', '');
if (hashString.length && hashString.indexOf('comment-') == 0) {
    hashString = '';
}

var broadcastId = params.broadcastId;
if (!broadcastId && hashString.length) {
    broadcastId = hashString;
}

if (broadcastId && broadcastId.length) {
    $("#broadcast-id").val(broadcastId);
    localStorage.setItem(connection.socketMessageEvent, broadcastId);

    (function reCheckRoomPresence() {
        connection.checkPresence(broadcastId, function (isRoomExists) {
            if (isRoomExists) {
                document.getElementById('open-or-join').onclick();
                return;
            }
            setTimeout(reCheckRoomPresence, 5000);
        });
    })();
    //disableInputButtons();
}


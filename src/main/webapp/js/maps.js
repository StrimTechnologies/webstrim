/*
 * @author raduuu2k7
 */

var map, infoWindow;
var x = document.getElementById("maplocation");
x.innerHTML = "Getting location, please wait...";

senzorvalues = WebService("GET", "senzorvalues/secured/senzorid/" + sessionStorage.getItem("senzorid"));
lati = senzorvalues.latitude;
longi = senzorvalues.longitude;

if (lati == null && longi == null)
{
    lati = -34.397;
    longi = 150.644;
    var newUser = 1;
}
function initMap() {
    var markers = [];
    var markerCluster = null;
    var userpos = new google.maps.LatLng(lati, longi);
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);

    //alert ("lati: " + lati);               

    map = new google.maps.Map(document.getElementById('map'), {
        // center: {lat: lati, lng: longi},
        center: new google.maps.LatLng(lati, longi),
        zoom: 11,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        styles: [
            {
                "stylers": [
                    {
                        "saturation": -100
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#0099dd"
                    }
                ]
            },
            {
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#aadd55"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {}
        ]
    });

    $('#defaultOpen').on('click', function () {
        function resizemaps() {
            google.maps.event.addListener(map, "idle", function () {
                google.maps.event.trigger(map, 'resize');
            });
        }
        setTimeout(resizemaps(), 50);
    });

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);


    var centerControlDiv2 = document.createElement('div');
    var centerControl2 = new CenterControl2(centerControlDiv2, map);
    centerControlDiv2.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv2);

    var centerControlDiv3 = document.createElement('div');
    var createstrim = new createstrim(centerControlDiv3, map);
    createstrim.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv3);

    infoWindow = new google.maps.InfoWindow;


    //Create map clustering markers and display them on the map
    function AddMarkers() {
        gpsvalues = WebService("GET", "senzorvalues/secured/all");
        $.each(gpsvalues, function (i) {
            var latLng = new google.maps.LatLng(gpsvalues[i].latitude, gpsvalues[i].longitude);
            var contentString = '<div id="content" style="font-size:11pt;">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">User: ' + gpsvalues[i].senzorId.deviceId.userId.username + '</h1>' +
                    '<div id="bodyContent">' +
                    '<p><font color="green">Strim status: Open to join</font><br>Strim name: ' + gpsvalues[i].senzorId.deviceId.strimName + '<br></p><p style="color:#ed2553;">Price: ' + gpsvalues[i].senzorId.deviceId.price + ' STR</p>' + '<button onclick="strimDetailPage(' + gpsvalues[i].senzorId.deviceId.deviceId + ')">Strim Details</button>' +
                    '</div>' + '</div>';

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                content: contentString,
                //draggable:true,
                title: gpsvalues[i].senzorId.deviceId.strimName
            });

            markers.push(marker);
        });

        markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

        for (var i = 0, marker; marker = markers[i]; i++) {
            google.maps.event.addListener(marker, 'click', function (e) {
                infowindow.setContent(this.content);
                infowindow.open(map, this);
            });
        }
    }

    function DeleteMarkers() {
        //Loop through all the markers and remove
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        markerCluster.clearMarkers();
    }

    AddMarkers();

    var minutes = 1000 * 60;
    var d = new Date();
    var tr = d.getTime();
    var refresh = Math.round(tr / minutes);
    var gpsrecordtimer = Math.round(sessionStorage.getItem("gpsrecordtime") / minutes);


    if ((refresh - gpsrecordtimer) > 4) {
        //GET USER ACTUAL LOCATION
        // Try HTML5 geolocation.
        x.innerHTML = "Getting location, please wait...";
        infoWindow.setPosition(new google.maps.LatLng(lati, longi));
        infoWindow.setContent('Getting location, please wait... <br> Make sure your GPS is enabled.');
        infoWindow.open(map);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                userpos = pos;

                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({'location': {lat: position.coords.latitude, lng: position.coords.longitude}}, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            x.innerHTML = results[1].formatted_address;
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });

                infoWindow.setPosition(pos);
                infoWindow.setContent('You are here');
                infoWindow.open(map);
                map.setCenter(pos);

                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5,
                        strokeWeight: 2,
                        strokeColor: "#ed2553"
                    },
                    map: map
                });

                senzori = JSON.stringify(
                        {
                            "latitude": position.coords.latitude,
                            "longitude": position.coords.longitude,
                            "senzorId": {
                                "deviceId": {
                                    "deviceId": sessionStorage.getItem("deviceid"),
                                    "userId": {
                                        "userId": sessionStorage.getItem("id")
                                    }
                                },
                                "isMinable": true,
                                "senzorId": sessionStorage.getItem("senzorid")
                            },
                            "valueId": sessionStorage.getItem("senzorvalueId")}
                );

                recordgps = WebService("PUT", "senzorvalues/secured/update", senzori);
                if (recordgps == "error") {
                    alert("GPS data could not be stored !");
                } else {
                    var d = new Date();
                    var t = d.getTime();
                    sessionStorage.setItem("gpsrecordtime", t);
                }

            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());

            });
        } else {
            // Browser doesn't support Geolocation         
            handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                    'Error: The Geolocation service failed.<br>Enable your GPS and refresh the page.' :
                    'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }

    } else
    {
        var marker = new google.maps.Marker({
            position: map.getCenter(),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeWeight: 2,
                strokeColor: "#ed2553"
            },
            map: map
        });

        // REVERSE GEOCODING - CONVERT LAT/LNG TO ADDRESS
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': {lat: parseFloat(lati), lng: parseFloat(longi)}}, function (results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    if (newUser == 1) {
                        x.innerHTML = "Getting location, please wait...";
                    } else {
                        x.innerHTML = results[1].formatted_address;
                    }
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }


    ///AUTOCOMPLE SEARCH
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow2 = new google.maps.InfoWindow();
    var infowindowContent2 = document.getElementById('infowindow-content');
    infowindow2.setContent(infowindowContent2);

    autocomplete.addListener('place_changed', function () {
        infowindow2.close();

        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }

        var address = '';

        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || ''),
                (place.address_components[3] && place.address_components[3].short_name || '')
            ].join(' ');
        }

        infowindowContent2.children['place-icon'].src = place.icon;
        infowindowContent2.children['place-name'].textContent = place.name;
        infowindowContent2.children['place-address'].textContent = address;
        infowindow2.setPosition(place.geometry.location);
        infowindow2.open(map);
        $('#pac-input').val('');
        $('#pac-input').blur();


    });

    function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderRadius = '48px';
        controlUI.style.boxShadow = '0 4px 8px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginRight = '15px';
        controlUI.style.marginBottom = '14px';
        controlUI.style.textAlign = 'center';
        controlUI.style.height = '48px';
        controlUI.style.width = '48px';
        controlUI.title = 'Refresh Live Map';
        controlUI.id = 'RefreshLiveMap';
        controlUI.innerHTML = '<img src="images/icons/icons8-Refresh-200.png" width="48px" height="48px"/>';
        controlDiv.appendChild(controlUI);

        controlUI.addEventListener('click', function () {
            $('#refreshmap').show();
            infoWindow.close();
            DeleteMarkers();
            AddMarkers();
            $('#refreshmap').hide();
        });
    }


    function CenterControl2(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderRadius = '48px';
        controlUI.style.boxShadow = '0 4px 8px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginLeft = '15px';
        controlUI.style.textAlign = 'center';
        controlUI.style.height = '48px';
        controlUI.style.width = '48px';
        controlUI.title = 'Center Live Map';
        controlUI.class = 'mapicon1';
        controlUI.innerHTML = '<img src="images/icons/icons8-Near Me-200.png" width="48px" height="48px"/>';
        controlDiv.appendChild(controlUI);

        controlUI.addEventListener('click', function () {
            infoWindow.close();
            map.setCenter(userpos);
            map.setZoom(11);
        });


    }

    function createstrim(controlDiv, map) {
        // Set CSS for the control border.        
        var controlUI = document.createElement('div');
        /* controlUI.style.backgroundColor = '#fff';
         controlUI.style.border = '2px solid #fff'; */
        controlUI.style.backgroundColor = 'white';
        controlUI.style.boxShadow = '0 4px 8px rgba(0,0,0,.3)';
        controlUI.style.borderRadius = '48px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '27px';
        controlUI.style.textAlign = 'center';
        controlUI.style.height = '48px';
        controlUI.style.width = '48px';
        controlUI.title = 'Create P2P Strim';
        controlUI.class = 'mapicon2';
        controlUI.innerHTML = '<img src="images/icons/icons8-Plus Filled-200.png" width="48px" height="48px"/>';
        controlDiv.appendChild(controlUI);

        controlUI.addEventListener('click', function () {
            if (sessionStorage.getItem('fullscreentoggle') == 'true') {
                $('.toggle').click();
            }
            document.getElementById("liveCamera").click();
        });
    }


    function expand() {
        $('#strim').show();
        $('.level1').hide();
        $('.level2').hide();
        $('#usertagmap').show();
        //  $('.toggle').hide();
        $('.close').click();
        google.maps.event.trigger(map, "resize");
    }

    function collapse() {
        $('#strim').hide();
        $('#usertagmap').hide();
        $('.level1').show();
        $('.level2').show();
        $('.toggle').show();
        google.maps.event.trigger(map, "resize");
    }

    $(document).ready(function () {

        if (sessionStorage.getItem('fullscreentoggle') == 'true') {
            expand();
        } else {
            collapse();
        }
        map.setCenter(userpos);
    });

    $('.toggle').on('click', function () {
        infoWindow.close();
        $('#defaultOpen').click();
        if (sessionStorage.getItem('fullscreentoggle') == 'false') {
            expand();
            sessionStorage.setItem('fullscreentoggle', 'true');
        } else {
            collapse();
            sessionStorage.setItem('fullscreentoggle', 'false');
        }
    });
}

function showOnMap(userlat, userlong) {
    var maplocation = new google.maps.LatLng(userlat, userlong);
    $('#defaultOpen').click();
    map.setCenter(maplocation);
    map.setZoom(19);
    $("#RefreshLiveMap").click();
}

         
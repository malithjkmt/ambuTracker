// The global object; we can use this object everywhere on the client side

gmaps = {
    // map object
    map: null,

    // google markers objects
    markers: [],

    currentLocation: {lat: 6.795086, lng: 79.900783},


    SetMyLocation: function(callback){
        // Try HTML5 geolocation.

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                callback(pos);
            }, function() {
                console.log("Geolocation error!!");
            });
        } else {
            // Browser doesn't support Geolocation
            console.log("Geolocation error!!");
        }
    },

    // google lat lng objects
    latLngs: [],

    // our formatted marker data objects
    markerData: [],

    // will receive a "marker" object and build a Google Maps API object from its properties
    addMarker: function(marker) {
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            id: marker.id,
            position: gLatLng,
            map: gmaps.map,
            title: marker.title,
            // animation: google.maps.Animation.DROP,
            icon:'img/male.png'
        });
        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerData.push(marker);
        return gMarker;
    },

    // calculate the bounding box, which is the area on the map we want to center on,
    // that brings the view of all the markers so they can be seen on the map together.
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
            bounds.extend(this.latLngs[i]);
        }
        this.map.fitBounds(bounds);
    },

    // check if a marker already exists
    markerExists: function(key, val, callback) {

        var ex = false;
        gmaps.markers.forEach( function(storedMarker) {
            console.log('inside foreach');
            if (storedMarker.id == val){
                ex= true;
            }
        });
        callback(ex);

    },
    

    // initialize the map
    initialize: function() {


        var lat = 6.523110;
        var lng = 80.121557;

        console.log("[+] Intializing Google Maps...");
        var mapOptions = {
            zoom: 15,  // ideal zoom level for streets
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,

            // map controls
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT,
                mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.HYBRID,

                ]
            }

        };

        gmaps.map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        );






        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.

            var centerControlDiv = document.createElement('div');
            new gmaps.CenterControl(centerControlDiv, gmaps.map);

            centerControlDiv.index = 1;
            gmaps.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

        // global flag saying we intialized already
        Session.set('map', true);



    },


    CenterControl: function(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '100%';
        controlUI.style.width = '50px';
        controlUI.style.height = '50px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';

        // Set background Image
        controlUI.style.backgroundImage = "url('img/loc_black_30.png')";
        controlUI.style.backgroundRepeat = 'no-repeat';
        controlUI.style.backgroundPosition = 'center';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Moratuwa.
        controlUI.addEventListener('click', function() {

                // add a marker on my current location and setCenter
                gmaps.SetMyLocation(function (pos) {
                    gmaps.map.setCenter(pos);
                    var userId = 'defaultUserID';
                    if(Meteor.user()) {
                        userId = Meteor.user()._id;
                    }
                        var objMarker = {
                            id: userId,  //_id ???
                            lat: pos.lat,
                            lng: pos.lng,
                            title: 'me'
                        };

                        // check and add new marker if not exist
                        gmaps.markerExists('id', objMarker.id, function (existence) {
                            console.log("marker exists = " + existence);
                            if (!existence) {
                                console.log('new marker added');
                                gmaps.addMarker(objMarker);
                            }

                        });


                });
            });

        controlUI.addEventListener('mouseover', function() {
            controlUI.style.backgroundImage = "url('img/loc2_blue_30.png')";
        });

        controlUI.addEventListener('mouseout', function() {
            controlUI.style.backgroundImage = "url('img/loc_black_30.png')";
        });

    }



}
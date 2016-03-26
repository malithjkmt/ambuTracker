
    var ZOOM_LEVEL = 15;

    var latLng;
    var map;
    var destination;
    var me = {username:"asdfasdf"};

    Meteor.subscribe('OnlineUsers');
    Meteor.subscribe('Positions');
    Meteor.subscribe('myPosition');

    Meteor.startup(function() {
        GoogleMaps.load();

    });



    Template.map.helpers({
        geolocationError: function() {
            var error = Geolocation.error();
            return error && error.message;
        },
        myMapOptions: function() {
            latLng = Geolocation.latLng();


            if (GoogleMaps.loaded() && latLng) {

                // Map options
                var mapOptions = {
                    zoom: ZOOM_LEVEL,  // ideal zoom level for streets
                    center: new google.maps.LatLng(latLng.lat, latLng.lng),
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
                        position: google.maps.ControlPosition.LEFT_BOTTOM,
                        mapTypeIds: [
                            google.maps.MapTypeId.ROADMAP,
                            google.maps.MapTypeId.HYBRID,
                        ]
                    }
                };

                // Return map
                return mapOptions;
            }
        }
    });

    Template.map.onCreated(function() {

        var self = this;

        GoogleMaps.ready('myMap', function(map) {
            positions = [];

            // Create the DIV to hold the control and call the CenterControl()
            // constructor passing in this DIV.
            var centerControlDiv = document.createElement('div');
            new GoogleMaps.CenterControl(centerControlDiv, GoogleMaps.maps.myMap.instance);
            centerControlDiv.index = 1;
            GoogleMaps.maps.myMap.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

            //################# Places search box begins.... ##################

            // Create the search box and link it to the UI element.
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            GoogleMaps.maps.myMap.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            GoogleMaps.maps.myMap.instance.addListener('bounds_changed', function() {
                searchBox.setBounds(GoogleMaps.maps.myMap.instance.getBounds());
            });

            google.maps.event.addDomListener(input,'click',function(){
                this.value='';
                // Clear out the old markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                destination = null;
            });

            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                if (places.length == 0) {

                    return;
                }

                // Clear out the old markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                console.log("do it here!!!!!!!!!!!!!!");

                places.forEach(function(place) {

                    // backup the user searched destination
                    destination = place.geometry.location;
                    console.log(destination);

                    // Create a marker for each place.
                    markers.push(new google.maps.Marker({
                        map: GoogleMaps.maps.myMap.instance,
                        title: place.name,
                        position: destination
                    }));

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                GoogleMaps.maps.myMap.instance.fitBounds(bounds);
            });

            //################# Places search box ends.... ##################

            // Create and move the position """"when latLng changes.""""" (when only if the clients, lat lang changes)
            self.autorun(function() {

                console.log("self.autorun runs");
                //####### Setup markers########
                // get all current markers from Collection
                var markerCursor = Positions.find({});

                markerCursor.forEach(function(pos) {

                    // Only show the ambulances within 1Km if user has selected a specific location
                    // ( if only the user has selected a destination)
                    if(destination) {
                        // condition to check the marker is within the 1000m range
                        var range = distance(pos.position.lat, pos.position.lng, destination.lat(), destination.lng());
                        if(range <1000){

                            // Load only the online users
                                if(Meteor.users.findOne({_id:pos.userId})){
                                  //  alert(pos.username + " is inside the range " + range);

                                // if the marker of the user has never been added to the map
                                if (!positions[pos.userId]) {
                                    console.log('added new marker for ' + pos.username);

                                    var markerIcon;
                                    // assign marker icons for ambulance and consumers
                                    if(pos.type == 'a'){
                                        markerIcon = 'img/ambulance2.png';
                                    }
                                    else if(pos.type == 'c'){
                                        markerIcon = 'img/male.png';
                                    }

                                    positions[pos.userId] = new google.maps.Marker({
                                        position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                                        map: map.instance,
                                        title: pos.username,
                                        icon: markerIcon
                                    });
                                }


                                // if the marker of that user already been added to the map
                                else {
                                    console.log('updating marker for ' + pos.username);
                                    positions[pos.userId].setPosition(pos.position);
                                }
                            }
                            else{

                                if(positions[pos.userId]){
                                    console.log('remove logged out user');
                                    positions[pos.userId].setMap(null);
                                    positions[pos.userId] = null;

                                    // remove the marker from  the collection also
                                    alert("deleting " + pos.username + "'s position because user is in range but not online ");
                                    Meteor.call('deletePosition', pos._id);

                                }

                            }


                         }
                        else if(pos.username != me.username){
                            // skip adding in to the map, remove the marker if already added
                            if(positions[pos.userId]) {
                                console.log('remove out of range markers');
                                positions[pos.userId].setMap(null);
                                positions[pos.userId] = null;

                                // remove the marker from  the collection also
                                alert("deleting " + pos.username + "'s position because user is not in range ");
                              /*  Meteor.call('deletePosition', pos._id);*/

                            }
                        }

                    }

                    // Load only the online users
                     else if(Meteor.users.findOne({_id:pos.userId})){
                        // alert(pos.username + " is online!!!");

                        // if the marker of the user has never been added to the map
                        if (!positions[pos.userId]) {
                            console.log('added new marker for ' + pos.username);

                            var markerIcon;
                            // assign marker icons for ambulance and consumers
                            if(pos.type == 'a'){
                                markerIcon = 'img/ambulance2.png';
                            }
                            else if(pos.type == 'c'){
                                markerIcon = 'img/male.png';
                            }

                            positions[pos.userId] = new google.maps.Marker({
                                position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                                map: map.instance,
                                title: pos.username,
                                icon: markerIcon
                            });
                        }


                        // if the marker of that user already been added to the map
                        else {
                            console.log('updating marker for ' + pos.username);
                            positions[pos.userId].setPosition(pos.position);
                        }
                    }

                     // if the owner of the marker is not online
                    else{

                       /*  alert(pos.username + " is offline");
                        if(positions[pos.userId]){
                            console.log('remove logged out user');
                            positions[pos.userId].setMap(null);
                            positions[pos.userId] = null;

                            // remove the marker from  the collection also
                            alert("deleting " + pos.username + "'s position because not online");
                            Meteor.call('deletePosition', pos._id);

                        }*/

                        // alert(pos.username + " is OUTSIDE the range ");
                         // Prevent removing my marker
                      //   if(pos.username != me.username){
                             // skip adding in to the map, remove the marker if already added
                             if(positions[pos.userId]) {
                                 console.log('remove offline users markers');
                                 positions[pos.userId].setMap(null);
                                 positions[pos.userId] = null;

                                 // remove the marker from  the collection also
                                 alert("deleting " + pos.username + "'s position because user is not online ");
                                 Meteor.call('deletePosition', pos._id);

                             }
                       //  }


                    }

                });


                // If the user has logged in
                if(Meteor.user()) {
                    me = Meteor.user();
                    var userId = Meteor.userId();
                    //update Collection

                    latLng = Geolocation.latLng();
                    if (! latLng)
                        return;

                    // get the _id of this user
                    var id = Positions.findOne({userId: userId})._id;

                    // Update the collection
                    Meteor.call('UpdatePositions', id, latLng);
                }


                // Center and zoom the map view onto the current position.
                // map.instance.setCenter(position.getPosition());
                // map.instance.setZoom(ZOOM_LEVEL)
            });

        });
    });

    function distance(lat1, lng1, lat2, lng2) {
        var R = 6371000; // metres ( radius of earth)
        var φ1 = lat1*Math.PI / 180;
        var φ2 = lat2*Math.PI / 180;
        var Δφ = (lat2-lat1)*Math.PI / 180;
        var Δλ = (lng2-lng1)*Math.PI / 180;

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;
        return d;
    }

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY",
        requestPermissions: {},
        extraSignupFields: [{
            fieldName: 'first-name',
            fieldLabel: 'First name',
            inputType: 'text',
            visible: true,
            validate: function(value, errorFunction) {
                if (!value) {
                    errorFunction("Please write your first name");
                    return false;
                } else {
                    return true;
                }
            }
        }, {
            fieldName: 'last-name',
            fieldLabel: 'Last name',
            inputType: 'text',
            visible: true,
        }, {
            fieldName: 'Type',
            showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
            fieldLabel: 'Gender',
            inputType: 'radio',
            radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
            data: [{                    // Array of radio options, all properties are required
                id: 1,                  // id suffix of the radio element
                label: 'Ambulance',          // label for the radio element
                value: 'a'              // value of the radio element, this will be saved.
            }, {
                id: 2,
                label: 'consumer',
                value: 'c',
                checked: 'checked'
            }],
            visible: true
        }]
    });

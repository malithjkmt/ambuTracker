
    var ZOOM_LEVEL = 15;

    var latLng;
    var map;

    Meteor.subscribe('OnlineUsers');
    Meteor.subscribe('Positions');

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


            // Create and move the position when latLng changes.
            self.autorun(function() {

                //####### Setup markers########
                // get all current markers from Collection
                var markerCursor = Positions.find({});


                markerCursor.forEach(function(pos) {

                    // Load only the online users
                    if(Meteor.users.findOne({_id:pos.userId})){

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
                });


                // If the user has logged in
                if(Meteor.user()) {
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

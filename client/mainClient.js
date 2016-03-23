
    var ZOOM_LEVEL = 10;

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
                map = new google.maps.LatLng(latLng.lat, latLng.lng);

                // Return map
                return {
                    center: map,
                    zoom: ZOOM_LEVEL,

                };
            }
        }
    });


    Template.dashBoard.events({
        'click #myLocation': function() {

            if ( latLng){
                GoogleMaps.maps.myMap.instance.setCenter({lat:latLng.lat,lng:latLng.lng});
            }
        },
        'click #zoomMe': function() {

            if ( latLng){
                GoogleMaps.maps.myMap.instance.setZoom(18);
            }
        }
    });

    Template.map.onCreated(function() {
        var self = this;

        GoogleMaps.ready('myMap', function(map) {
            positions = [];


            // Create and move the position when latLng changes.
            self.autorun(function() {
                console.log('positions '+positions);

                //####### Setup markers########

                // Get current markers of all users on the map

                // get all current markers from Collection
                var markerCursor = Positions.find({});


                markerCursor.forEach(function(pos) {

                    // Load only the online users
                    if(Meteor.users.findOne({_id:pos.userId})){

                        // if the marker of the user has never been added to the map
                        if (!positions[pos.userId]) {
                            console.log('added new marker for ' + pos.username);
                            positions[pos.userId] = new google.maps.Marker({
                                position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                                map: map.instance,
                                label: pos.username,
                                title: pos.username,

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
                value: 'm'              // value of the radio element, this will be saved.
            }, {
                id: 2,
                label: 'consumer',
                value: 'f',
                checked: 'checked'
            }],
            visible: true
        }]
    });

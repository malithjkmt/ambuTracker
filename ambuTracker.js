Positions = new Mongo.Collection('positions');
var ZOOM_LEVEL = 10;

if(Meteor.isServer){

    // add new users to the Collection
    Accounts.onLogin(function(user){
        var userId = user.user._id;
        var username = Meteor.users.findOne({_id:userId}).username;
        console.log("user logged in  "+ userId + " "+ username);

        var count = Positions.find({userId:userId}).count();
        if(count == 0){
            console.log("new user added "+ userId);
            Positions.insert({
                userId:userId,
                username:username,
                position:{lat:0, lng:0},
            });
        }
    });

    Meteor.publish("OnlineUsers", function() {
        return Meteor.users.find({ "status.idle": false });
    });
    Meteor.publish("Positions", function() {

        return Positions.find({ });
    });


}

if (Meteor.isClient) {
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
        'click .myLocation': function() {

            if ( latLng){
                GoogleMaps.maps.myMap.instance.setCenter({lat:latLng.lat,lng:latLng.lng});
            }
        },
        'click .zoomMe': function() {

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
                            //animation: google.maps.Animation.BOUNCE
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
                    Positions.update({_id: id}, {$set: {position: {lat:latLng.lat, lng:latLng.lng}}});
                    console.log(userId +  " my position changed and updated the Mongo");
                }


                // Center and zoom the map view onto the current position.
               // map.instance.setCenter(position.getPosition());
               // map.instance.setZoom(ZOOM_LEVEL)
            });

        });
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

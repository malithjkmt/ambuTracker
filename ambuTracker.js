Positions = new Mongo.Collection('positions');
var MAP_ZOOM = 10;

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

}

if (Meteor.isClient) {


    Meteor.startup(function() {
        GoogleMaps.load();

    });



    Template.map.helpers({
        geolocationError: function() {
            var error = Geolocation.error();
            return error && error.message;
        },
        myMapOptions: function() {
            var latLng = Geolocation.latLng();

            if (GoogleMaps.loaded() && latLng) {
                 map = new google.maps.LatLng(latLng.lat, latLng.lng);

                // Return map
                return {
                    center: map,
                    zoom: MAP_ZOOM
                };
            }
        }
    });




    Template.map.onCreated(function() {
        var self = this;

        GoogleMaps.ready('myMap', function(map) {

            var position;

            // Create and move the position when latLng changes.
            self.autorun(function() {

                //####### Setup markers########

                // get all current markers from Collection
                var markerCursor = Positions.find({});

                // Get current markers of all users on the map
                markerCursor.forEach(function(pos) {


                    new google.maps.Marker({
                        position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                        map: map.instance,
                        animation: google.maps.Animation.DROP,

                        label: pos.username,
                        title: pos.username
                    });
                });

                // Update My location
                var latLng = Geolocation.latLng();
                if (! latLng)
                    return;

                // If my  position doesn't yet exist, create it.
                if (! position) {
                    position = new google.maps.Marker({
                        position: new google.maps.LatLng(latLng.lat, latLng.lng),
                        map: map.instance
                    });
                }
                // The position already exists, so we'll just change its position.
                else {
                    position.setPosition(latLng);
                }

                // If the user has logged in
                if(Meteor.user()) {
                    var userId = Meteor.userId();
                    //update Collection
                    console.log(userId +  " user is being updated because his position changed!!!");

                    // get the _id of this user
                    var id = Positions.findOne({userId: userId})._id;

                    // Update the collection
                    Positions.update({_id: id}, {$set: {position: {lat:latLng.lat, lng:latLng.lng}}});

                }
                // Center and zoom the map view onto the current position.
                map.instance.setCenter(position.getPosition());
                map.instance.setZoom(MAP_ZOOM)
            });

        });
    });


    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

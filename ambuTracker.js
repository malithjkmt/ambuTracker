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
            var positions = [];

            // Create and move the position when latLng changes.
            self.autorun(function() {

                //####### Setup markers########


                // get all current markers from Collection
                var markerCursor = Positions.find({});

                // Update position of each user
                markerCursor.forEach(function(pos) {
                    console.log(pos.position);

                    if(!positions[pos._id]){
                        positions[pos._id] = new google.maps.Marker({
                            position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                            map: map.instance,
                            label: pos.username,
                            title: pos.username
                        });
                    }
                    else{
                        console.log('inside else');
                         positions[pos._id].setPosition(pos.position);
                    }
                });


                // If the user has logged in
                if(Meteor.user()) {
                    var userId = Meteor.userId();
                    //update Collection
                    console.log(userId +  " user is being updated because his position changed!!!");
                    var latLng = Geolocation.latLng();
                    if (! latLng)
                        console.log('returned!!!!');
                        return;
                    // get the _id of this user
                    var id = Positions.findOne({userId: userId})._id;

                    // Update the collection
                    Positions.update({_id: id}, {$set: {position: {lat:latLng.lat, lng:latLng.lng}}});

                }
                // Center and zoom the map view onto the current position.
               // map.instance.setCenter(position.getPosition());
               // map.instance.setZoom(MAP_ZOOM)
            });

        });
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

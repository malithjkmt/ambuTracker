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


            positions = [];


            // Create and move the position when latLng changes.
            self.autorun(function() {
                console.log('positions '+positions);

                //####### Setup markers########

                // Get current markers of all users on the map

                // get all current markers from Collection
                var markerCursor = Positions.find({});


                markerCursor.forEach(function(pos) {
                    console.log(pos.position);
                    console.log(pos.userId);
                    console.log(pos._id);

                    // if the marker of the user has never been added to the map
                    if(!positions[pos.userId]){
                        console.log('added new marker for '+pos.username);
                        positions[pos.userId] = new google.maps.Marker({
                            position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                            map: map.instance,
                            label: pos.username,
                            title: pos.username
                        });
                    }

                  /*  if(Meteor.user[pos._id]){
                        console.log('user ' + pos.username+ ' logged in');
                    }*/
                    // if the marker of that user already been added to the map
                    else{
                         console.log('updating marker for '+pos.username);
                         positions[pos.userId].setPosition(pos.position);
                    }
                });


                // If the user has logged in
                if(Meteor.user()) {
                    var userId = Meteor.userId();
                    //update Collection

                    var latLng = Geolocation.latLng();
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
               // map.instance.setZoom(MAP_ZOOM)
            });

        });
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

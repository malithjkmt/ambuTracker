Markers = new Mongo.Collection('markers');

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
                return {
                    center: new google.maps.LatLng(latLng.lat, latLng.lng),
                    zoom: 12
                };
            }
        }
    });

    Template.body.onCreated(function() {

        // Once the map is ready on the screen
        GoogleMaps.ready('myMap', function(map) {
            //get current position of client
            var latLng = Geolocation.latLng();

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latLng.lat, latLng.lng),
                map: map.instance
            });
/*
            Markers.insert({
                lat: currentPosition.latitude,
                lng: currentPosition.longitude
            })*/

        });
    });


}

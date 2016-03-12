
if (Meteor.isClient) {
    Meteor.startup(function() {
        GoogleMaps.load();
    });

    Template.map.helpers({
        myMapOptions: function() {

            if (GoogleMaps.loaded()) {
                // Map initialization options
                return {
                    center: new google.maps.LatLng(6.796974, 79.899982),
                    zoom: 15
                };
            }
        }
    });

    Template.body.onCreated(function() {

        GoogleMaps.ready('myMap', function(map) {
            // Add a marker to the map
            var marker = new google.maps.Marker({
                position: map.options.center,
                map: map.instance
            });

        });
    });


}

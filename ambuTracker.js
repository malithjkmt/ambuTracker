if (Meteor.isClient) {
    Meteor.startup(function() {
        GoogleMaps.load();
    });

    Template.map.helpers({
        myMapOptions: function() {
            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                // Map initialization options
                return {
                    center: new google.maps.LatLng(6.523358, 80.114081),
                    zoom: 12
                };
            }
        }
    });


}

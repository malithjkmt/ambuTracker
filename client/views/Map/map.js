
var ZOOM_LEVEL = 8; // ideal zoom level for streets

var latLng;
var map;
var destination;


Template.map.helpers({
    geolocationError: function () {
        var error = Geolocation.error();
        return error && error.message;
    },
    myMapOptions: function () {
        latLng = Geolocation.latLng();

        if (GoogleMaps.loaded() && latLng) {

            // Map options
            var mapOptions = {
                zoom: ZOOM_LEVEL,
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,

                // map controls
                zoomControl: false,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                rotateControl: true,
                fullscreenControl: true,

                // modify map type control
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.LEFT_BOTTOM,
                    mapTypeIds: [
                        google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.HYBRID,
                    ]
                },
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                }
            };
            return mapOptions;
        }
    }


});


Template.MapView.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#wrapper").toggleClass("active");
    }
});


// This only runs once after the API loaded
Template.map.onCreated(function () {

    var self = this;

    GoogleMaps.ready('myMap', function (map) {


        // This array stores the markers locally to the client
        positions = [];

        updateMap(destination, map);

        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        new GoogleMaps.CenterControl(centerControlDiv, map.instance);
        centerControlDiv.index = 1;
        map.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

        //################# Places search box begins.... ##################
        // Create the search box and link it to the UI element.
        var holder = document.getElementById('holder');
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(holder);

        // Bias the SearchBox results towards current map's viewport.
        map.instance.addListener('bounds_changed', function () {
            searchBox.setBounds(map.instance.getBounds());
        });

        google.maps.event.addDomListener(input, 'click', function () {
            /*   // Meteor.call('addAnonymousUser');
             if (Meteor.isCordova) {
             TelephoneNumber.get(function(result) {
             console.log('Phone number: ' + result.line1Number);
             }, function() {
             console.log('Error. Do the phone have this feature? (Settings > About Phone > SIM > Number)');
             });
             }
             */
            this.value = '';
            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            destination = null;

        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            destination = null;
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();

            places.forEach(function (place) {

                // backup the user searched destination
                destination = place.geometry.location;

                console.log(destination);
                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map.instance,
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
            map.instance.fitBounds(bounds);
            updateMap(destination, map);
            destination = null;
        });
        //################# Places search box ends.... ##################

        // ################## update user location on the map reactively  ############
        self.autorun(function () {

            latLng = Geolocation.latLng();

            if (!latLng){
                return;
            }

            new google.maps.Marker({
                position: latLng,
                map: map.instance,
                title: "me",
                icon :'img/male.png',
                animation: google.maps.Animation.DROP

            });

        });

    });
});



function  updateMap(destination, map) {

    //####### Setup markers########
    // get all current markers from Collection
    var markerCursor = Hospitals.find({});
    console.log("inside function");

    // Try to draw each markers on the map
    markerCursor.forEach(function (pos) {

        // if only the user has selected a destination
        if(destination) {
            // Only show the hospitals within 1Km if user has selected a specific location
            var range = distance(pos.position.lat, pos.position.lng, destination.lat(), destination.lng());
            // condition to check the marker(Hospital) is within the 1000m range
            console.log(range);
            if (range < 1000) {

                // if the marker of the user is not available on the map
                if (!positions[pos._id]) {
                    // add marker to the map
                    positions[pos._id] = new google.maps.Marker({
                        position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                        map: map.instance,
                        title: pos.name,
                        icon: 'img/hospital.png',
                        animation: google.maps.Animation.DROP
                    });
                }
                // if the marker of that user already been added to the map, update the current position
                else {
                    positions[pos._id].setPosition(pos.position);
                }

            }
            else {
                // skip adding in to the map, remove the marker if already added
                if (positions[pos._id]) {
                    positions[pos._id].setMap(null);
                    positions[pos._id] = null;
                }

            }
        }
        else{
            // if the marker of the user is currently not on the map
            if (!positions[pos._id]) {

                positions[pos._id] = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.position.lat, pos.position.lng),
                    map: map.instance,
                    title: pos.name,
                    icon: 'img/hospital.png',
                    animation: google.maps.Animation.DROP
                });
            }
            // if the marker of that user already been added to the map
            else {
                // update the marker position
                positions[pos._id].setPosition(pos.position);
            }
        }
    });

}


// function to calculate surface distance between two locations given in latitudes and longitudes
function distance(lat1, lng1, lat2, lng2) {
    var R = 6371000; // metres ( radius of earth)
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2 - lat1) * Math.PI / 180;
    var Δλ = (lng2 - lng1) * Math.PI / 180;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
}
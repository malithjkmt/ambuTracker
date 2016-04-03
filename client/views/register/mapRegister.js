/**
 * Created by Malith on 4/1/2016.
 */

var ZOOM_LEVEL = 15; // ideal zoom level for streets

var latLng;
var map;
var destination;

Template.mapRegister.helpers({
    isAdmin: function (){
        if(true){
            return true;
        }
        else{
            return false;
        }
    }
});

Template.mapRegister.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#wrapper").toggleClass("active");
    }
});


Template.mapRegister.helpers({
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



Template.mapRegister.onCreated(function () {

    var self = this;

    GoogleMaps.ready('mapRegister', function (map) {

        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        new GoogleMaps.CenterControl(centerControlDiv, GoogleMaps.maps.mapRegister.instance);
        centerControlDiv.index = 1;
        map.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);


        var markers = [];

        var location = null;

       /* var testHospital = Hospitals.findOne({name:'Navaloka'});
        console.log(testHospital);
        var poss = testHospital.position;

        new google.maps.Marker({
            position: poss,
            map: map.instance,
            title: "Hospital Location",
            animation: google.maps.Animation.DROP

        });*/



        google.maps.event.addListener(map.instance, 'click', function(event) {
            location = {lat:event.latLng.lat(), lng:event.latLng.lng()}
            Session.set('hospital-location',location);

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            markers.push(new google.maps.Marker({
                position: location,
                map: map.instance,
                title: "Hospital Location",
                animation: google.maps.Animation.DROP

            }));

        });

        // ################ Save location button begins ..##################
        var saveLoc = document.getElementById('saveLoc');
        map.instance.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(saveLoc);

        google.maps.event.addDomListener(saveLoc, 'click', function () {


        });

        // ################ Save location button Ends ..##################

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


        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
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

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map.instance,
                    title: place.name,
                    position: destination,
                    animation: google.maps.Animation.DROP
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.instance.fitBounds(bounds);
        });
        //################# Places search box ends.... ##################
    });
});

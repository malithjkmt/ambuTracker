// The global object; we can use this object everywhere on the client side

gmaps = {
    // map object
    map: null,

    // google markers objects
    markers: [],

    // google lat lng objects
    latLngs: [],

    // our formatted marker data objects
    markerData: [],

    // will receive a "marker" object and build a Google Maps API object from its properties
    addMarker: function(marker) {
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            title: marker.title,
            // animation: google.maps.Animation.DROP,
            icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerData.push(marker);
        return gMarker;
    },

    // calculate the bounding box, which is the area on the map we want to center on,
    // that brings the view of all the markers so they can be seen on the map together.
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
            bounds.extend(this.latLngs[i]);
        }
        this.map.fitBounds(bounds);
    },

    // check if a marker already exists
    markerExists: function(key, val) {
        _.each(this.markers, function(storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    },

    // initialize the map
    initialize: function() {


        var lat = 6.523110;
        var lng = 80.121557;

        console.log("[+] Intializing Google Maps...");
        var mapOptions = {
            zoom: 15,  // ideal zoom level for streets
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,

            // map controls
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true,

            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT,
                mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.HYBRID,

                ]
            }

        };

        this.map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        );


        // global flag saying we intialized already
        Session.set('map', true);
    }

}
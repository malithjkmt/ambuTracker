Template.map.rendered = function() {
    if (! Session.get('map'))
        gmaps.initialize();

    Deps.autorun(function() {
        var pages = Markers.find().fetch();

        _.each(pages, function(marker) {
            if (typeof marker.position !== 'undefined' &&
                typeof marker.position.lat !== 'undefined' &&
                typeof marker.position.lng !== 'undefined') {

                var objMarker = {
                    id: marker.userId,  //_id ???
                    lat: marker.position.lat,
                    lng: marker.position.lng,
                    title: marker.username
                };

                // check if marker already exists
                if (!gmaps.markerExists('id', objMarker.id))
                    gmaps.addMarker(objMarker);

            }
        });
    });
}

Template.map.destroyed = function() {
    Session.set('map', false);
}
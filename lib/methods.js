Meteor.methods({
    'UpdatePositions': function(id, latLng){
        Positions.update({_id: id}, {$set: {position: {lat:latLng.lat, lng:latLng.lng}}});
        console.log(id +  " my position changed and updated the Mongo");
    }
});
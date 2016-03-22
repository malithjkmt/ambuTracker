   Meteor.methods({
        'UpdatePositions': function(id, latLng){
            Positions.update({_id: id}, {$set: {position: {lat:latLng.lat, lng:latLng.lng}}});
            console.log(Positions.findOne({_id: id}).username +  "'s position changed and updated the Mongo");
        }
    });
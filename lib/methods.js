Meteor.methods({

    // Update the position of a marker
    'UpdatePositions': function(id, latLng){
        Positions.update({_id: id}, {$set: {position: {lat:latLng.lat, lng:latLng.lng}}});
    },

    // Remove marker position from the collection
    'deletePosition': function(id){
        Positions.remove({_id: id});
    },

    // add anonymous user
    'addAnonymousUser' : function(){
        Meteor.users.insert({
            username:"usefer",
            profile:{Type: "c"},
            password:"123123"
        });


        console.log(Meteor.users.find({}).fetch());
    }


});
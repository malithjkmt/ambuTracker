Meteor.publish("OnlineUsers", function() {
    return Meteor.users.find({ "status.idle": false });
});
Meteor.publish("Positions", function() {

    return Positions.find({ });
});
Meteor.publish("OnlineUsers", function() {
    return Meteor.users.find({ "status.idle": false });
});
Meteor.publish("Positions", function() {

    // publish only the locations of the ambulances
    return Positions.find({"type": "a"});
});

Meteor.publish("myPosition", function() {

    // publish my location no matter who I am
    return Positions.find({ userId: this.userId });
});
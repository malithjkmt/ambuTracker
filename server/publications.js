Meteor.publish("OnlineUsers", function() {
    // publish only active users (not idle)
    // idle: true if all connections for this user are idle ( user has minimized the window, closed, connection lost... )
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
/**
 * Created by Malith on 3/22/2016.
 */
Meteor.publish("OnlineUsers", function() {
    return Meteor.users.find({ "status.idle": false });
});
Meteor.publish("Positions", function() {

    return Positions.find({ });
});
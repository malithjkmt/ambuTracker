
// add new users to the Collection
Accounts.onLogin(function(user){
    var userId = user.user._id;
    var loginUser =  Meteor.users.findOne({_id:userId});
    var username = loginUser.username;

    var type = loginUser.profile.Type;

    // Check whether there is a marker already for this user
    var count = Positions.find({userId:userId}).count();
    if(count == 0){
        // if not, add a new marker for the new user
        Positions.insert({
            userId:userId,
            username:username,
            position:{lat:0, lng:0},
            type:type

        });
    }
});

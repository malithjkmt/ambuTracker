
// add new users to the Collection
Accounts.onLogin(function(user){
    var userId = user.user._id;
    var username = Meteor.users.findOne({_id:userId}).username;
    console.log("user logged in  "+ userId + " "+ username);

    var count = Positions.find({userId:userId}).count();
    if(count == 0){
        console.log("new user added "+ userId);
        Positions.insert({
            userId:userId,
            username:username,
            position:{lat:0, lng:0},
        });
    }
});

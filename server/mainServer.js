
// add new users to the Collection
Accounts.onLogin(function(user){
    var userId = user.user._id;
    var loginUser =  Meteor.users.findOne({_id:userId});
    var username = loginUser.username;
    console.log("user logged in  "+ userId + " "+ username);
    var type = loginUser.profile.Type;
    console.log(type);

    var count = Positions.find({userId:userId}).count();
    if(count == 0){
        console.log("new user added "+ userId);
        Positions.insert({
            userId:userId,
            username:username,
            position:{lat:0, lng:0},
            type:type

        });
    }
});

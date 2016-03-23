 // add new users to the Collection
    Accounts.onLogin(function(user){

        var userId = user.user._id;
        var username = Meteor.users.findOne({_id:userId}).username;
        console.log(username +"  logged in ");


        if(!(Markers.find({userId:userId}))){
            console.log("new user added; userID = "+ userId + ", username = "+username);

            Markers.insert({
                userId:userId,
                username:username,
                position:{lat:0, lng:0},
            });
        }
    });




 
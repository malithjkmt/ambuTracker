/**
 * Created by Malith on 4/4/2016.
 */
Template.login.events({
    'submit #login-form': function (event) {
        event.preventDefault();
    /*    console.log("entered!!!!");
        var email = event.target.email.value;
        var password = event.target.password.value;

        console.log(email);
        console.log(password);

        Meteor.loginWithPassword(email,password,function(err){
            if(!err) {

                Router.go('/map');
            }
            else{
                alert('Wrong password!');
            }
        });*/

    }
});
/**
 * Created by Malith on 4/2/2016.
 */

Template.Register.onRendered(function () {

    var hospitalName = Session.get('hospitalName');
    var numberOfAmbulance = Session.get('numberOfAmbulance');
    var phoneNumber =Session.get('phoneNumber');
    var email = Session.get('email');


    if(hospitalName){
        document.getElementById('inputName').value = hospitalName;
    }
    if(numberOfAmbulance){
        document.getElementById('inputNumberOfAmbulance').value = numberOfAmbulance;
    }
    if(phoneNumber){
        document.getElementById('inputPhone').value = phoneNumber;
    }
    if(email){
        document.getElementById('inputEmail').value = email;
    }


});


Template.Register.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#wrapper").toggleClass("active");
    },

    'click #regButton':function(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const hospitalName = document.getElementById('inputName').value;
        const position =Session.get('hospital-location');
        const numberOfAmbulance = document.getElementById('inputNumberOfAmbulance').value;
        const phoneNumber = document.getElementById('inputPhone').value;
        const email = document.getElementById('inputEmail').value;

        // Insert a task into the collection
        Hospitals.insert({
            name: hospitalName,
            position: position,
            number:numberOfAmbulance,
            phone: phoneNumber,
            email: email
        });

        Router.go('/map');

    },

    'click #findInMap':function(e){

        e.preventDefault();
        var hospitalName = document.getElementById('inputName').value;
        var numberOfAmbulance = document.getElementById('inputNumberOfAmbulance').value;
        var phoneNumber = document.getElementById('inputPhone').value;
        var email = document.getElementById('inputEmail').value;

        Session.set('hospitalName', hospitalName);
        Session.set('numberOfAmbulance', numberOfAmbulance);
        Session.set('phoneNumber', phoneNumber);
        Session.set('email', email);

        Router.go('/mapRegister');

    }


});

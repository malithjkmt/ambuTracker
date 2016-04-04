
var me = {username: "asdfasdf"};

//Meteor.subscribe('users');
/*Meteor.subscribe('Positions');
Meteor.subscribe('myPosition');*/
Meteor.subscribe('hospitals');

Meteor.startup(function () {

    GoogleMaps.load();
});


// configure the accounts UI Bootstrap package
Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY",
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'first-name',
        fieldLabel: 'First name',
        inputType: 'text',
        visible: true,
        validate: function (value, errorFunction) {
            if (!value) {
                errorFunction("Please write your first name");
                return false;
            } else {
                return true;
            }
        }
    }, {
        fieldName: 'last-name',
        fieldLabel: 'Last name',
        inputType: 'text',
        visible: true,
    }, {
        fieldName: 'Type',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Gender',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
            id: 1,                  // id suffix of the radio element
            label: 'Ambulance',          // label for the radio element
            value: 'a'              // value of the radio element, this will be saved.
        }, {
            id: 2,
            label: 'consumer',
            value: 'c',
            checked: 'checked'
        }],
        visible: true
    }]
});


    var ZOOM_LEVEL = 10;

    Meteor.subscribe('OnlineUsers');
    Meteor.subscribe('Markers');

    Meteor.startup(function() {
        gmaps.initialize();

    });



    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY",
        requestPermissions: {},
        extraSignupFields: [{
            fieldName: 'first-name',
            fieldLabel: 'First name',
            inputType: 'text',
            visible: true,
            validate: function(value, errorFunction) {
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
                value: 'm'              // value of the radio element, this will be saved.
            }, {
                id: 2,
                label: 'consumer',
                value: 'f',
                checked: 'checked'
            }],
            visible: true
        }]
    });

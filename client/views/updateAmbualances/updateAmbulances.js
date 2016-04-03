/**
 * Created by Malith on 4/2/2016.
 */



Template.UpdateAmbulances.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#wrapper").toggleClass("active");
    },

    'click #updateButton':function(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const numberOfAmbulance = document.getElementById('inputNumberOfAmbulance').value;
        const charges = document.getElementById('inputCharges').value;


        // Insert a task into the collection
       Hospitals.update({ _id: "2JPZKEiakGCXFynTL" },
           {$set:{
                number:numberOfAmbulance,
               charges:charges
            }}
            );

        Router.go('/map');

    }

});

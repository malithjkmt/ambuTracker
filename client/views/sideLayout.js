/**
 * Created by Malith on 4/4/2016.
 */
Template.mainSide.events({
    'click #sidebar-wrapper': function(e) {
        $("#wrapper").toggleClass("active");
        e.preventDefault();
        e.stopPropagation();
    },
    'click #regBar': function(e) {
        $("#wrapper").toggleClass("active");
        e.preventDefault();
        e.stopPropagation();
        Router.go('/register');
    },
    'click #mapBar': function(e) {
        $("#wrapper").toggleClass("active");
        e.preventDefault();
        e.stopPropagation();
        Router.go('/map');
    },
    'click #updateBar': function(e) {
        $("#wrapper").toggleClass("active");
        e.preventDefault();
        e.stopPropagation();
        Router.go('/updateAmbulances');
    }

});

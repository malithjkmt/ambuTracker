Router.configure({
    // the default layout
    //layoutTemplate: 'mainSide'
});

Router.route('/', function () {
    this.render('frontDoor');
});

Router.route('/Register', function () {
    this.render('Register');
    this.layout('mainSide');
});



Router.route('/map', function () {
    this.render('MapView');
    this.layout('mainSide');

});

Router.route('/updateAmbulances', function () {
    this.render('UpdateAmbulances');
    this.layout('mainSide');

});


Router.route('/login', function () {
    this.render('login');

});



Router.route('/mapRegister', function () {
    this.render('mapRegister');
    this.layout('mainSide');

});
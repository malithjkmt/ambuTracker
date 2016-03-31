Router.configure({
    // the default layout
    layoutTemplate: 'mainSide'
});

Router.route('/', function () {
    this.render('Register');
    this.layout('mainSide');
});


Router.route('/map', function () {
    this.render('MapView');
    this.layout('mainSide');

});

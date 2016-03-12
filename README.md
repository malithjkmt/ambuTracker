# AmbuTracker
Emergency vehicle tracking system using Meteor framework.

A hybrid web /ios or android application using MeteorJS, Bootstrap themese and Meteor's UI capability, Mongo. 
Apart from Bootsrap everything else comes with MeteorJS

Features of the app
The user can open the app in their mobile, bring up a google map where he can type in a destination
e.g the user is in Galle and types in Colombo 3

The app displays as Icons, available ambulances around the location(3) within a radius of 1 KM. 
Say 1 is in Walukarama road col3, 2 in flower road col3. 
Imagine these are locations of hospitals. So the locations dont move but the ambulances # can change.
User starts the journey, while on his way the app displays in real time any changes(3 can go to 0 or 5)
The user can select either Malukarama road or Flower road as where he wants to go.

Thats from the users point of view. The UI shall use the google maps and be really responsive and seamless.
    
In addition to that there is a simple admin UI for a admin user to update the available ambulances at each hospital.

Current developer version is deployed at:- http://ambutracker.meteor.com 

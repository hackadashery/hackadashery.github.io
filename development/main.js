//node style error first
if ('serviceWorker' in navigator) {
    console.log('Common: SW supported, going to register');
    //need hash in here
    navigator.serviceWorker.register('/sw.bundle.js', {scope:'./'}).then(function(registration) {
        // Registration was successful
        console.log('Common: SW register worked: ', registration);
    }).catch(function(err) {
        // registration failed :(
        console.log('Common: SW register failed with err: ', err);
    });

} else {
    //no SW :(
    //upgrade your browser!
    console.log('Common: SW not supported');
}

var eventManager = require('./base_scripts/eventManager');

var $ = require('jquery');
$('.js-main').addClass('js-loaded');
$('.js-header').addClass('js-loaded'); 
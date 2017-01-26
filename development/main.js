//node style error first
// if ('serviceWorker' in navigator) {
//     console.log('Common: SW supported, going to register');
//     //need hash in here
//     navigator.serviceWorker.register('/sw.bundle.js', {scope:'./'}).then(function(registration) {
//         // Registration was successful
//         console.log('Common: SW register worked: ', registration);
//     }).catch(function(err) {
//         // registration failed :(
//         console.log('Common: SW register failed with err: ', err);
//     });

// } else {
//     //no SW :(
//     //upgrade your browser!
//     console.log('Common: SW not supported');
// }

// =============== base_scripts
window.eventManager = require('./base_scripts/eventManager');
window.api = require('./base_scripts/api');
window.$ = require('jquery');

// =============== component scripts (todo: figure out how to not buundle these in the big bundle)
require('./components/search-by-id/_search-by-id.js').init();
require('./components/search-by-filters/_search-by-filters.js').init();
require('./components/map/_map.js').init();

$('.js-main').addClass('js-loaded');
$('.js-header').addClass('js-loaded'); 

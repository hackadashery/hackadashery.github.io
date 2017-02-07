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
window.api = require('./components/_api/_api.js'); //sits in components as it has an associated dom component (in the footer)
window.$ = require('jquery');
window.threeOneOne = {}; //container for all the 311 app modules

// =============== component scripts (todo: figure out how to not buundle these in the big bundle)
require('./components/_search-by-id/_search-by-id.js').init();
require('./components/_header/_header.js').init();

window.threeOneOne.searchByFilters = require('./components/search-by-filters/_search-by-filters.js');
window.threeOneOne.map = require('./components/map/_map.js');
window.threeOneOne.burndown = require('./components/burn-down/_burn-down.js');
window.threeOneOne.totalRequestsByDept = require('./components/total-requests-by-dept/_total-requests-by-dept.js');
window.threeOneOne.totalRequestsOverTime = require('./components/total-requests-over-time/_total-requests-over-time.js');

$('.js-main').addClass('js-loaded');
$('.js-header').addClass('js-loaded'); 

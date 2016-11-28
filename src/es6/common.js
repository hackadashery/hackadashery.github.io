window.WL_STATE = {};
console.time('INIT');

//node style error first
if ('serviceWorker' in navigator) {

    //need hash in here
    navigator.serviceWorker.register('/sw.bundle.js', {scope:'./'}).then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });

} else {
    //no SW :(
    //upgrade your browser!
}



console.time('mobile menu button');
require('./components/mobile-menu-button').init();
console.timeEnd('mobile menu button');

console.time('line basic');
require('./components/line-basic').init();
console.timeEnd('line basic');

console.time('requests barchart');
require('./components/requests-barchart').init();
console.timeEnd('requests barchart');

console.time('requests linechart');
require('./components/requests-linechart').init();
console.timeEnd('requests linechart');

console.time('burn');
require('./components/burn').init();
console.timeEnd('burn');

console.time('map');
require('./components/map').init();
console.timeEnd('map');

console.time('search by id form');
require('./components/search-by-id-form').init();
console.timeEnd('search by id form');

console.time('general search form');
require('./components/general-search-form').init();
console.timeEnd('general search form');

//Load this last - the events fired from here will kick things off so if you set up a subsciber after this has run you might miss out on something!
console.time('main nav');
require('./components/main-nav').init();
console.timeEnd('main nav');

var $ = require('jquery');
$('.js-main').addClass('js-loaded');
$('.js-header').addClass('js-loaded');
console.timeEnd('INIT');
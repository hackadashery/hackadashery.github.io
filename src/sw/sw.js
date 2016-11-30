"use strict";


//self.oninstall = event => {
self.addEventListener('install', function(event) {
  console.log("Installing the SW");

  //grab the static files and cache them
  function onInstall () {
    return caches.open('static')
      .then(cache => cache.addAll([
        '/dist/js/common.bundle.js',
        '/dist/css/main.css',
        '/'
      ])
    );
  }

  event.waitUntil(onInstall(event));
});

//self.onactivate = () => { 
self.addEventListener('activate', function(event) {
  console.log("Second load only, the SW activates!");
  self.clients.claim();
});

//self.onfetch = (evt) => {

self.addEventListener('fetch', function(event) {
    console.log("a request/response network event is happening:", event); 
    //return the cached version... and check to see if there is a new one on the server (different hash)
    event.respondWith(fetch(event.request));
});
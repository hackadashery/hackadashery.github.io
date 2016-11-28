"use strict";


self.oninstall = () => {
  console.log("First load, now the SW is installed!");
  self.skipWaiting();
};

self.onactivate = () => { 
  console.log("Second load only, the SW activates!");
  self.clients.claim();
};

self.onfetch = evt => {
    console.log("a request/response network event is happening:");
    evt.respondWith(fetch(evt.request));
};
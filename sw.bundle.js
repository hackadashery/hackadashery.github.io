(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1]);

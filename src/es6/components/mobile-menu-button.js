'use strict';

var eventManager = require('../utils/eventManager');
var $ = require('jquery');

module.exports = {
	init(){
		$('.js-mobile-menu-button').on('click', function(){
			console.log('toggle the mobile menu!');

			$('.js-mobile-menu-slide').toggleSlide();
		});
	}
}

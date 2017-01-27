'use strict';

var eventManager = require('../utils/eventManager');
var $ = require('jquery');

module.exports = {
	init(){
		$('.js-mobile-menu-button').on('click', function(){
			console.log('toggle the mobile menu!');
			var menuName = $(this).data('mobile-menu-name');//so we only slide this specific mobile menu

			//now look for any sidebar mobile slider thing with the same name
			$('.js-mobile-menu-slide').each(function(){
				var $thisSidebar = $(this);
				if ($thisSidebar.data('mobile-menu-name') == menuName) {

					$thisSidebar.toggleClass('open');

				}
			});

		});

		$(window).on('resize', function() {

		});
	}
}

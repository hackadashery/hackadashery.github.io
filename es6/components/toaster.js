'use strict';

var $ = require('jquery');

/*
 * This module is responsibe for handling the toasters.
 * For now, toasters are purley presentation elements, so
 * they don't actually have any state which is why you don't 
 * see any state controller being required.
 */

module.exports = {
	init: function(){
		console.log('toaster');
		$('.js-toaster').on('click', function(){
			console.log('toasting toaster');
			var $thisToaster = $(this);

			//toggle!
			if ($thisToaster.hasClass('toasted')) {
				console.log('sliding up');
				$thisToaster.find('.toaster__toast').slideUp(300);
				$thisToaster.removeClass('toasted');
			} else {
				console.log('sliding down');
				$thisToaster.find('.toaster__toast').slideDown(300);
				$thisToaster.addClass('toasted');
			}
		});
	}
}
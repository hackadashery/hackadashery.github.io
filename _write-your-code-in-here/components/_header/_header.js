"use strict";

/* The header JS
 * 
 */

module.exports = {
	init(){
        $( document ).ready(function() {
            $('.js-header__menu-icon').on('click', function(e){
                $('.js-header').toggleClass('header--menu-toggled');
            });
        });
    }
}
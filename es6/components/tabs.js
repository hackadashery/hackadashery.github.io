'use strict';

var tabStateCtrl = require('../state/tabs');

/*
 * This module is responsibe for handling any tab interactions
 * Remember - tabs aren't just the 'tab' looking things that line
 * up accross the top of a page - they are any group of objects
 * that run on a boolean each in which only one can be true.
 * So the logic that runs tabs is the same that might run radio
 * buttons (if we had any).
 */

module.exports = {
	init: function(){

		$('.js-tab').each(function(){
			var $this = $(this);
			var tabGroup = $this.data('tab-group');
			var tabName = $this.data('tab-name');
			var defaultTab = false;
			if ($this.hasClass('active')) {
				defaultTab = true;
			}
			var tabState = tabStateCtrl.addTab(tabGroup, tabName, defaultTab);

			//bind the tab
			rivets.bind(
				$this,
				{ tabstate: tabState }
			);

			$this.on('click', function(){
				var tabGroup = $(this).data('tab-group');
				var tabName = $(this).data('tab-name');
				tabStateCtrl.openTab(tabGroup, tabName);
			});
		});

		$('.js-tab-content').each(function(){
			var $this = $(this);
			var tabGroup = $this.data('tab-group');
			var tabName = $this.data('tab-name');
			var tabState = tabStateCtrl.getTabState(tabGroup, tabName);

			//bind the tab
			rivets.bind(
				$this,
				{ tabstate: tabState }
			);
		});
	}
}
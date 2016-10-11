window.WL_STATE = {};

require('./components/line-basic').init();
require('./components/requests-barchart').init();
require('./components/requests-linechart').init();
require('./components/burn').init();
require('./components/map').init();

//Load this last - the events fired from here will kick things off so if you set up a subsciber after this has run you might miss out on something!
require('./components/main-nav').init();
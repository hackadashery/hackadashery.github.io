*Temp note - where did all the images go!?! Have no fear, I've set up a dropbox folder for them & other larger files - ping your email at me on the Hackadashery channel in the Code for Philly slack and I'll add you.*

#Hackadashery's Protodashery for Philly 311

https://hackadashery.github.io/philly311

---

##Quick tour of the code

Tooling:

 - [handlebars](http://handlebarsjs.com/) :point_right: [Metalsmith](http://www.metalsmith.io/) :point_right: **HTML**
 - [SASS](http://sass-lang.com/) :point_right: [node-sass](https://github.com/sass/node-sass) :point_right: **CSS**
 - [Browserify](http://browserify.org/) :point_right: **JS**

Directories:

 - **_write-your-code-in-here/**.  
    - **base_scripts/** A home Global JS (don't shudder, global things can be good). Using [Browserify](http://browserify.org/) to compile so you can `require('node-modules-too');`!
    - **base_styles/** The styles that underly everything. For each folder in here, there is a quick description in `_write-your-code-in-here/style-base.scss`. Written in [SASS](http://sass-lang.com/) and following the [BEM](https://css-tricks.com/bem-101/) naming methodology.
    - **components/** Each bit of the "app", this is probably where most of your time will be spent.
        - `_component-name.html` a [handlebars](http://handlebarsjs.com/) partial. These are added to the pages (in web_root/) like this: `{{> component-name/_component-name}}`
        - `_component-name.js` if it needs JS to do it's thing. Added to main.js like this: `window.threeOneOne.map = require('./components/map/_map.js');` then add a `<script> threeOneOne.burndown.init(); </script>` in the html file for the component.
        - `_component-name.scss` the styling for the component. By convention the class prefix is the same as the name and we're using the [BEM](https://css-tricks.com/bem-101/) methodology.
    - **layouts/** Markup (HTML) for the head, header, footer, meta. The basic top and bottom for every page, written with [handlebars](http://handlebarsjs.com/).
    - **web_root/** This drives the structure of the site (a directory as a sitemap if you will). Also written with [handlebars](http://handlebarsjs.com/).
    - `main.js` This is the "entry point" for all the JS.
    - `style-base.scss` This pulls all the base styles into a css file that will be loaded, the critical css.
    - `style-components.scss` This pulls all the component styles into a different css file that will be loaded.
 - **metalsmith/** Some functions to help with generating the site, there shouldn't be much to do in here.
 - **philly311/** Don't write any code in here! It will be overwritten. The build process takes everything from **_write-your-code-in-here**, smashes it all together, and spits it out into **philly311/**.
 - `index.html` redirects to `/philly311` because we're using github to host the site so the repo root is the site root but we don't want to be compiling files into the repo root :/


---

##Getting set up

 - Download and install [Node JS](https://nodejs.org) - if you haven't already.
 - Clone / fork the repo.
 - Open the command line / terminal in the root of the repo and run `npm install`.
 - Also run `npm install http-server -g` if you don't already have some kind of local server set up.

 - `npm start` will fire up the server & watch the files for changes! It won't build initially, if you want to just do a full build (HTML, CSS, & JS) you can also run `npm run build`.

Set up should be complete! Report any errors as issues on this repo and we'll try to get to them / figure out your problem.

---

###Tests

We don't have any yet, but when we do it will probably be [Tape](https://github.com/substack/tape) because it doesn't use the whole kitchen sink, or [Zora](https://github.com/lorenzofox3/zora) for the same reason :) - but really, it's up to whoever takes the time to actually set it up.

---

###Chart ideas

*TODO: make a project on github for each new chart idea - initial issue for set up chat? and more at the chart's lead contributors discretion*

 - **Burndown**: X is time, Y (left) is number of active issues, Y (right) total number of issues. red line for issues added, green line for issues resolved, blue line for total number of issues.
 - **Additions & deletions per week** / day (look at the github one vs the Target Process one). Y: time, X: total open line, resolved bar, new bar
 - **Seasonal punchcard** (rows are months, cols are days)
 - Y: number of open bugs, X: time (week / month / year). Line for each week / month / year

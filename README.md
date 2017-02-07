*Temp note - where did all the images go!?! Have no fear, I've set up a dropbox folder for them & other larger files - ping your email at me on the Hackadashery channel in the Code for Philly slack and I'll add you.*

#Hackadashery's Protodashery for Philly 311

https://hackadashery.github.io/philly311

---

##Quick tour of the reop

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
    - **pages/** This drives the structure of the site (a directory as a sitemap if you will). Also written with [handlebars](http://handlebarsjs.com/).
    - `main.js` This is the "entry point" for all the JS.
    - `style-base.scss` This pulls all the base styles into a css file that will be loaded, the critical css.
    - `style-components.scss` This pulls all the component styles into a different css file that will be loaded.
 - **metalsmith/** Some functions to help with generating the site, there shouldn't be much to do in here.
 - **philly311/** Don't write any code in here! It will be overwritten. The build process takes everything from **_write-your-code-in-here**, smashes it all together, and spits it out into **philly311/**.
 - `index.html` redirects to `/philly311` because we're using github to host the site so the repo root is the site root but we don't want to be compiling files into the repo root :/


---

##Setting up on your local

 - Download and install [Node JS](https://nodejs.org) - if you haven't already.
 - Clone / fork the repo.
 - Open the command line / terminal in the root of the repo and run `npm install`.
 - Also run `npm install http-server -g` if you don't already have some kind of local server set up.

 - `npm start` will fire up the server & watch the files for changes! It won't build initially, if you want to just do a full build (HTML, CSS, & JS) you can also run `npm run build`.

Set up should be complete! Report any errors as issues on this repo and we'll try to get to them / figure out your problem.

---

##Building your own chart

I'm going to assume you're looking to create a chart on it's very own page.   


####Set up the page

*(This step is optional, you may just be looking to add your chart to a page that already exists in which case, skip!)*
jump into **_write-your-code-in-here/pages/stats** and create a new .html file.   
The name of this file will be used in the url.   
For the code that goes in, index.html is a good starting point, copy it all into your file.   
Finally, to create a link in the stats sub navm, open **_write-your-code-in-here/components/nav-stats/_nav-stats.html** and duplicate one of the existing links with the info for your page.

-

####Set up a chart component

Inside **_write-your-code-in-here/components**, create a folder with the name of your chart (make it explicit & descriptive). For example **streets-total-over-time/**   
Within that folder you need to create a **_streets-total-over-time.html** file for your markup.   
You will probably want to create **_streets-total-over-time.js** for the JS you wish to write. 
And for the styles, **_streets-total-over-time.scss**. Use the same name as the base class, so 

```css
.streets-total-over-time { 
    //simply super sassy stylins 
}
```

The styles will be autmoatically bundled so no need to worry about those.   
The markup in your .html file will beed to be added to the page (or where ever you want it to appear). 

```handlebars
{{> streets-total-over-time/_streets-total-over-time }}
```

And finally, if you have JS you wish to run on the page:   
"require" it in **_write-your-code-in-here/main.js**, 

```javascript
window.threeOneOne.streetsTotalOverTime = require('./components/streets-total-over-time/_streets-total-over-time.js');
```   

and "init" it in your markup: 

```
<script> threeOneOne.streetsTotalOverTime.init(); </script>
```

*With the current set up, all the JS is bundled into main.js. It's on the TODO list to break them into files specific to the components they serve.*

-

####Getting the data

We don't yet have data processing set up, so for now - call the API or add a json file manually, have a look through the other charts to see how this is done (we have set up as API module to help out.)

---

##Tests

We don't have any yet, but when we do it will probably be [Tape](https://github.com/substack/tape) because it doesn't use the whole kitchen sink, or [Zora](https://github.com/lorenzofox3/zora) for the same reason :) - but really, it's up to whoever takes the time to actually set it up.

---

##Chart ideas

*TODO: make a project on github for each new chart idea - initial issue for set up chat? and more at the chart's lead contributors discretion*

 - **Burndown**: X is time, Y (left) is number of active issues, Y (right) total number of issues. red line for issues added, green line for issues resolved, blue line for total number of issues.
 - **Additions & deletions per week** / day (look at the github one vs the Target Process one). Y: time, X: total open line, resolved bar, new bar
 - **Seasonal punchcard** (rows are months, cols are days)
 - Y: number of open bugs, X: time (week / month / year). Line for each week / month / year


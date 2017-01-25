#Protodashery

This repo is a play space / testing area for trying out ways to build the charts & graphs.

https://hackadashery.github.io/

---

##Set up

###Installing

 - Download and install [Node JS](https://nodejs.org).
 - Clone / fork the repo.
 - Open the command line / terminal in the root of the repo and run `npm install`.
 - Also run `npm install http-server -g` if you don't already have some kind of local server set up.

Set up should be complete! Report any errors as issues on this repo and we'll try to get to them / figure out your problem.

---

###Running

 - `npm start` will fire up the server & watch the files for changes.
 - `npm build` will run all the build steps if that's more your thing.

---

###Directories 

 - *_dont-write-code-in-here/* this is all compiled code.
 - *metalsmith/* Some functions to help with generating the site.
 - *lambda/* Will be the place to keep aws stuff if that ever actualy happens.
 - *development/* Do all your work in here!
    - *base_scripts/* some handy JS that's used throughout.
    - *base_styles/* the styles that underly everything.
    - *components/* Each bit of the "app", this is probably where most of your time will be spent
    - *layouts/* the head, header, footer, meta. All the things a page needs to be a page. In one place.
    - *web_root/* This drives the structure of the site

---

###Dev tooling

 - JS is compiled by [Browserify](http://browserify.org/)
 - CSS is compiled from [SASS](http://sass-lang.com/) by [node-sass](https://github.com/sass/node-sass) & follows the [BEM](https://css-tricks.com/bem-101/) methodology
 - HTML is compiled from [Handlebars](http://handlebarsjs.com/) using [Metalsmith](http://www.metalsmith.io/)

---

###Tests

We don't have any yet, but when we do it will probably be [Tape](https://github.com/substack/tape) because it doesn't use the whole kitchen sink.

---

###Chart ideas

*Burn chart*: X is time, Y (left) is number of active issues, Y (right) total number of issues. red line for issues added, green line for issues resolved, blue line for total number of issues.
 
*Additions & deletions per week* / day (look at the github one vs the Target Process one). Y: time, X: total open line, resolved bar, new bar

 - Seasonal punchcard (rows are months, cols are days)
 - Y: number of open bugs, X: time (week / month / year). Line for each week / month / year

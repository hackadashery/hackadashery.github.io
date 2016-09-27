#Protodashery

This repo is a play space / testing area for trying out ways to build the charts & graphs.

---

##Set up

###Installing

[Fork](https://help.github.com/articles/fork-a-repo/) the repo (unless you have permissions to push directly)

Download and install these two tools, documentation about installing them can be found on their sites:

 - [Node JS](https://nodejs.org)
 - [gulp](http://gulpjs.com/)

Now create a folder for the project anywhere on your computer and [clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#Cloning-an-Existing-Repository) this repo into it.

Open the command line / terminal and navigate/cd into the root of the repo (unless you created your own name for the folder when cloning, it should be called "protodashery").

now run `npm install`

Set up should be complete! Report any errors as issues on this repo and we'll try to get to them / figure out your problem.

---

###Localhost

If you have your own set up for local projects - just point it at index.html and run `gulp` from this repo's root.

If you don't, we have a super simple set up:

 - run  `npm install http-server -g` to install [http-server](https://www.npmjs.com/package/http-server)
 - now run `npm start` and open http://localhost:8080/

---

###Gulp

The gulpfile does a few things for us:

 - compiles all the JavaScript from `src/es6` into `dist/js/common.bundle.js` using [Babel](https://babeljs.io/docs/learn-es2015/) and [Browserify](http://browserify.org/)
 - compiles all the [Sass](http://sass-lang.com/) from `src/sass` into `dist/css/main.css`
 - watches the JS and Sass in src for any saved changes (when you save it'll compile again).



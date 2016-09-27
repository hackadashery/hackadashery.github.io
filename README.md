#Protodashery

This repo is a play space / testing area for trying out ways to build the charts & graphs.

---

##Set up

[Fork](https://help.github.com/articles/fork-a-repo/) the repo (unless you have permissions to push directly)

Download and install these two tools, documentation about installing them can be found on their sites:

 - [Node JS](https://nodejs.org)
 - [gulp](http://gulpjs.com/)

Now create a folder for the project anywhere on your computer and [clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#Cloning-an-Existing-Repository) this repo into it.

Open the command line / terminal and navigate/cd into the root of the repo (unless you created your own name for the folder when cloning, it should be called "protodashery").

now run `npm install`

Set up should be complete! Report any errors as issues on this repo and we'll try to get to them / figure out your problem.

---

##Development

With the command line / terminal open in repo root run `gulp`. This will do a few things:

 - compiles all the JavaScript from `src/es6` into `dist/js/common.bundle.js` using [Babel](https://babeljs.io/docs/learn-es2015/) and [Browserify](http://browserify.org/)
 - compiles all the [Sass](http://sass-lang.com/) from `src/sass` into `dist/css/main.css`
 - watches the JS and Sass in src for any saved changes (when you save it'll compile again).

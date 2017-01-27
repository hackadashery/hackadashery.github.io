var Metalsmith   = require('metalsmith');
var layouts      = require('metalsmith-layouts');
var permalinks   = require('metalsmith-permalinks');
var htmlMinifier = require("metalsmith-html-minifier");
var debug        = require('metalsmith-debug');

/* Bit of a story behind this one. The plugin has recently upgraded to 2.x (breaking change - whoop) hence the package.json requirment for 1.4.4
 * BUT turns out when it reads the partials it ignores the file extension, so I brought it into this repo (metalsmith/in-place ...) to add an extension check
 * That check checks to see if the partial files extension is in the pattern passed in below so we don't get sass in the markup. Awkward!
 */
var inplace      = require('./metalsmith/in-place');

var sanityCheck = function(options){
  return function(files, metalsmith, done){
    Object.keys(files).forEach(function(fileName){
      console.log('fileName ', fileName);
    });

    done();
  };
};

Metalsmith(__dirname)
  .metadata({
    title: "Hackadashery",
    description: "Philly 311",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./_write-your-code-in-here/web_root')
  .destination('./philly311')
  .clean(false)
  .use(sanityCheck())
  .use(inplace({
    pattern: '**/*.html',
    engine: 'handlebars',
    directory: "_write-your-code-in-here/layouts",
    partials: "_write-your-code-in-here/components"
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: "_write-your-code-in-here/layouts",
    partials: "_write-your-code-in-here/components"
  }))
  .use(permalinks())
  .use(htmlMinifier())
  .use(debug())
  .build(function(err, files) {
    if (err) { console.log('metalsmith build error: ', err); }
  });
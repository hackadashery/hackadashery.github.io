var Metalsmith   = require('metalsmith');
var layouts      = require('metalsmith-layouts');
var inplace      = require('metalsmith-in-place');
var permalinks   = require('metalsmith-permalinks');
var htmlMinifier = require("metalsmith-html-minifier");
var debug        = require('metalsmith-debug');

Metalsmith(__dirname)
  .metadata({
    title: "Hackadashery",
    description: "Philly 311",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./development/web_root')
  .destination('./_dont-write-code-in-here')
  .clean(false)
  .use(inplace({
    pattern: "**/*.html"
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: "development/layouts",
    partials: "development/components"
  }))
  .use(permalinks())
  .use(htmlMinifier())
  .use(debug())
  .build(function(err, files) {
    if (err) { console.log('metalsmith build error: ', err); }
  });
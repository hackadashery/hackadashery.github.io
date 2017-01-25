var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var htmlMinifier = require("metalsmith-html-minifier");

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
  .use(markdown())
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars',
    directory: "development/layouts",
    partials: "development/components"
  }))
  .use(htmlMinifier())
  .build(function(err, files) {
    if (err) { throw err; }
  });
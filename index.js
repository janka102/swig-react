var swig = require('swig'),
    React = require('react'),
    reactTag = require('./reactTag')(swig),
    viewDir = __dirname + '/views';

swig.setDefaults({
    loader: swig.loaders.fs(viewDir)
});

var reactPage = swig.compileFile(viewDir + '/index.html')();

console.log(reactPage);

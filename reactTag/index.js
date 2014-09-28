var tags = require('./tags'),
    extensions = require('./extensions');

module.exports = function(swig) {
    Object.keys(extensions).forEach(function(name) {
        swig.setExtension(name, extensions[name]);
    });

    Object.keys(tags).forEach(function(name) {
        var tag = tags[name];

        swig.setTag(name, tag.parse, tag.compile, tag.endTag, tag.blockLevel);
    });
};

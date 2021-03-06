var React = require('react'),
    reactTools = require('react-tools'),
    jsxPragma = '/** @jsx React.DOM */\n',
    dataTagName = 'data-react-render-id';

function getRequired(current, otherComponents) {
    otherComponents = otherComponents || '';

    Object.keys(current.require).forEach(function(name) {
        var requirement = current.require[name];

        otherComponents = requirement.component + '\n' + otherComponents;
        otherComponents = getRequired(requirement, otherComponents);
    });

    return otherComponents;
}

module.exports = function reactCreateClass(_React, currentName, getCurrent) {
    var current = getCurrent(_React);

    // console.log('\nCREATE_CLASS: "' + currentName + '"\n');
    // console.log('_ctx._React: #%s#', JSON.stringify(_React, null, 2));

    var varName = 'var ' + currentName + ' = ';

    var jsx = jsxPragma + varName + 'React.createClass({\n' + current.specs + '\n});';
    // console.log(jsx);

    var transformed = reactTools.transform(jsx).replace(jsxPragma, '');

    // console.log('\ntransformed: #%s#', transformed);

    if (!_React.tree.length) {
        var otherComponents = getRequired(current);

        // console.log('\notherComponents: #%s#', otherComponents);

        var component = eval(';(function() {' + otherComponents + ';return ' + transformed.replace(varName, '') + '})();');

        // console.log(component());
        var renderId = (Math.random() * 1e8).toString(32);

        var html = [
            '<div ' + dataTagName + '="' + renderId + '">\n',
            React.renderComponentToString(component()),
            '\n<script>\n',
            otherComponents,
            transformed + '\n',
            'React.renderComponent(' + currentName + '(null), document.querySelector(\'[' + dataTagName + '="' + renderId + '"]\'));\n',
            '</script>\n</div>'
        ].join('');

        // console.log(html);
    }

    return {
        html: html,
        transformed: transformed
    };
};

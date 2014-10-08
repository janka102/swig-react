var React = require('react'),
    reactTools = require('react-tools'),
    jsxPragma = '/** @jsx React.DOM */ ',
    dataTagName = 'data-react-render-id';

module.exports = function reactCreateClass(functions, reactObj) {
    // console.log('\nCREATE_CLASS: "' + reactObj.currentComponent + '"\n');
    // console.log('_ctx._React: #%s#', JSON.stringify(reactObj, null, 2));

    var otherComponents = "";
    Object.keys(reactObj.components).forEach(function(name) {
        if (name !== reactObj.currentComponent) {
            otherComponents += 'var ' + name + ' = ' + reactObj.components[name] + '\n';
        }
    });

    var jsx = jsxPragma + 'React.createClass({\n' + functions + '\n});';
    // console.log(jsx);

    var transformed = reactTools.transform(jsx).replace(jsxPragma, '');

    // console.log('\notherComponents: #%s#\n\ntransformed: #%s#', otherComponents, transformed);

    var component = eval(';(function() {' + otherComponents + ';return ' + transformed + '})();');

    // console.log(component());
    var renderId = (Math.random() * 1e8).toString(32);

    var html = [
        '<div ' + dataTagName + '="' + renderId + '">\n',
        React.renderComponentToString(component()),
        '\n<script>\n',
        otherComponents,
        'var ' + reactObj.currentComponent + ' = ' + transformed + '\n',
        'React.renderComponent(' + reactObj.currentComponent + '(null), document.querySelector(\'[' + dataTagName + '="' + renderId + '"]\'));\n',
        '</script>\n</div>'
    ].join('');

    // console.log(html);

    return {
        html: html,
        transformed: transformed
    };
};

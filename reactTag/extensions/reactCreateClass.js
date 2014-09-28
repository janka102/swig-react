var React = require('react'),
    reactTools = require('react-tools'),
    jsxPragma = '/** @jsx React.DOM */ ';

module.exports = function reactCreateClass(functions, reactObj) {
    // console.log('\nCREATE_CLASS: "' + reactObj.currentComponent + '"\n');
    // console.log(reactObj);
    var otherComponents = "";
    Object.keys(reactObj.components).forEach(function(name) {
        if (name !== reactObj.currentComponent) {
            otherComponents += 'var ' + name + ' = ' + reactObj.components[name] + '\n';
        }
    });

    var transformed = reactTools.transform(jsxPragma + 'React.createClass({\n' + functions + '\n});').replace(jsxPragma, '');

    // console.log('\notherComponents: #%s#\ntransformed: #%s#', otherComponents, transformed);

    var component = eval('(function() {' + otherComponents + ';return ' + transformed + '})();');

    var html = React.renderComponentToString(component());
    
    html += '\n<script>' + otherComponents + 'var ' + reactObj.currentComponent + ' = ' + transformed + '\nReact.renderComponent(' + reactObj.currentComponent + '({}), document.getElementById("reactContainer"));</script>'
    // console.log(html);

    return {
        html: html,
        transformed: transformed
    };
};

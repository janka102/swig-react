exports.compile = function compile(compiler, args, content, parents, opts, blockName) {
    var functionName = args.shift(),
        tagContent = compiler(content, parents, opts, blockName).replace(/^(\s*)_output(\s?\+=)/mg, '$1__reactCurrentFunction$2'),
        isRender = functionName === 'render',
        output = [
            'var react = _ctx._React = _ctx._React || {};\n',
            'react.currentFunctions = react.currentFunctions || "";\n',
            'var __reactCurrentFunction = "";\n',
            tagContent,
            'react.currentFunctions += "' + functionName + ': ',
            'function ' + functionName + '(' + args.join('') + ') {\\n',
            (isRender ? 'return (' : '') + '" + __reactCurrentFunction + "',
            (isRender ? ');' : '') + '},\\n";\n',
            '__reactCurrentFunction = null;\n',
            '// console.log(react.currentFunctions);\n'
        ];

    // console.log(output.join(''));

    if (!isRender) {
        return output.join('');
    }

    var componentName = '"_' + opts.filename.split('/').slice(-1)[0].split('.')[0] + '"';

    output.push(
        'var components = react.components = react.components || {};\n',
        'react.currentComponent = react.currentComponent || ' + componentName + ';\n',
        // 'console.log(\'\\nREACT: "\' + react.currentComponent + \'"\\n\');\n',

        // 'console.log(_ctx, react);\n',
        'var reactClass = _ext.reactCreateClass(react.currentFunctions.slice(0, -2), react);\n',
        'components[react.currentComponent] = reactClass.transformed;\n',
        'react.currentComponent = react.currentFunctions = null;\n',
        '_output += reactClass.html;\n'
    );

    // console.log(output.join(''));

    return output.join('');
}

exports.parse = function parse(str, line, parser, types, opts, swig) {
    var name;

    parser.on(types.VAR, function(token) {
        if (token.match.indexOf('.') !== -1) {
            throw new Error('Unexpected dot in react argument "' + token.match + '" on line ' + line + '.');
        }

        if (!this.prevToken && this.isLast && !name) {
            name = token.match;

            this.out.push(name);
            // console.log('prop', name);
        } else if (!this.isLast) {
            this.out.push(token.match);
            // console.log('  arg', token.match);
        } else {
            throw new Error('Unexpected token "' + token.match + '" in react tag on line ' + line + '.');
        }
    });

    parser.on(types.FUNCTION, function(token) {
        if (!this.prevToken && !name) {
            name = token.match;

            this.out.push(name);
            this.state.push(types.FUNCTION);
            // console.log('prop', name);
        }
    });

    parser.on(types.FUNCTIONEMPTY, function(token) {
        if (!this.prevToken && !name) {
            name = token.match;

            this.out.push(name);
            // console.log('prop', name);
        }
    });

    parser.on(types.PARENCLOSE, function() {
        if (this.isLast) {
            return;
        }
        throw new Error('Unexpected parenthesis close on line ' + line + ' in react tag.');
    });

    parser.on(types.COMMA, function() {
        return true;
    });

    parser.on(types.WHITESPACE, function() {
        return true;
    });

    parser.on('*', function(token) {
        throw new Error('Unexpected token "' + token.match + '" in react tag on line ' + line + '.');
    });

    parser.on('end', function(token) {
        if (!name) {
            throw new Error('Expected a name token in react tag on line ' + line + '.');
        }

        this.out.push(opts.filename || null);
    });

    return true;
}

exports.endTag = true;
exports.blockLevel = true;

exports.compile = function compile(compiler, args, content, parents, opts, blockName) {
    var functionName = args.shift(),
        tagContent = compiler(content, parents, opts, blockName).replace(/^(\s*)_output(\s?\+=)/mg, '$1__reactCurrentFunction$2'),
        isRender = functionName === 'render',
        output = [
            'var react = _ctx._React = _ctx._React || {};\n',
            'react.require = react.require || {};\n',
            'react.tree = (react.tree || []);\n',
            'var current = _ext.reactGetCurrent(react);\n',
            'var __reactCurrentFunction = "";\n',
            tagContent,
            'current.classObj = current.classObj || "";\n',
            'current.classObj += "' + functionName + ': ',
            'function ' + functionName + '(' + args.join('') + ') {',
            (isRender ? '\\n    return (' : '') + '" + __reactCurrentFunction + "',
            (isRender ? '    );\\n' : '') + '},\\n";\n',
            '//console.log("REACT \\"' + functionName + '\\" > current: #%s#", JSON.stringify(current, null, 2));\n'
        ];

    // console.log(output.join(''));

    if (!isRender) {
        return output.join('');
    }

    // Get the filename without any extension
    var componentName = opts.filename.split('/').slice(-1)[0].split('.')[0];
    //  Replace all chatacters not allowed in a variable name with letters
    componentName = componentName.replace(/[^_$a-z\d]/ig, function() {
        var start = Math.random() > 0.5 ? 65 : 97;

        return String.fromCharCode(Math.floor(Math.random() * 25) + start);
    });
    componentName = '"_' + componentName + '"';

    output.push(
        'var name = react.tree.slice(-1)[0] || ' + componentName + ';\n',
        'current.classObj = current.classObj.slice(0, -2);\n',
        // 'console.log(\'\\nREACT: "\' + name + \'"\\n\');\n',
        // 'console.log(\'_ctx._React: #%s#\', JSON.stringify(_ctx._React, null, 2));\n',

        'var reactClass = _ext.reactCreateClass(react, name, _ext.reactGetCurrent);\n',
        'current.component = reactClass.transformed;\n',
        'react.tree.pop();\n',
        'if (!react.tree.length) {\n',
        '   _output += reactClass.html;\n',
        '}\n'
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

    parser.on('end', function() {
        if (!name) {
            throw new Error('Expected a name token in react tag on line ' + line + '.');
        }

        this.out.push(opts.filename || null);
    });

    return true;
}

exports.endTag = true;
exports.blockLevel = true;

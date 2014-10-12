exports.compile = function compile(compiler, args, content, parents, opts, blockName) {
    var file = args.shift(),
        componentName = args.shift(),
        parentFile = (args.pop() || '').replace(/\\/g, '\\\\'),
        output = [
            // 'console.log(\'\\nREACT_USE: ' + componentName + '\\n\');\n',
            'var react = _ctx._React = _ctx._React || {};\n',
            'react.require = react.require || {};\n',
            'react.tree = (react.tree || []).concat([' + componentName + ']);\n',

            'var current = _ext.reactGetCurrent(react);\n',

            // 'console.log(\'_ctx._React: #%s#\', JSON.stringify(_ctx._React, null, 2));\n',
            // 'console.log(\'\\n_ctx._React: #%s#\', JSON.stringify(react, null, 2));\n',

            '_swig.compileFile(' + file + ', {\n',
            '   resolveFrom: "' + parentFile + '"\n',
            '})(_ctx);\n'
        ].join('');

    // console.log(output);

    return output;
}

exports.parse = function parse(str, line, parser, types, stack, opts) {
    var file,
        componentName;

    parser.on(types.STRING, function(token) {
        if (!this.prevToken && !file) {
            file = token.match;
            this.out.push(file);
            return;
        }

        throw new Error('Unexpected string ' + token.match + ' in reactuse tag on line ' + line + '.');
    });

    parser.on(types.VAR, function(token) {
        if (!this.prevToken && !file) {
            file = '"./' + token.match + '"';
            this.out.push(file);
            return;
        } else if (token.match === 'as' && this.prevToken && !this.isLast) {
            return;
        } else if (this.isLast && this.prevToken.match === 'as' && !componentName) {
            componentName = '"' + token.match + '"';
            this.out.push(componentName);
            return;
        }

        throw new Error('Unexpected variable "' + token.match + '" in reactuse tag on line ' + line + '.');
    });

    parser.on(types.WHITESPACE, function() {
        return true;
    });

    parser.on('*', function(token) {
        throw new Error('Unexpected token "' + token.match + '" in reactuse tag on line ' + line + '.');
    });

    parser.on('end', function() {
        if (!file) {
            throw new Error('Expected a filename in reactuse tag on line ' + line + '.');
        }

        if (!componentName) {
            throw new Error('Expected a component name in reactuse tag on line ' + line + '.');
        }

        this.out.push(opts.filename || null);
    });

    return true;
}

exports.endTag = false;
exports.blockLevel = true;

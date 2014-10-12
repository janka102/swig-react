exports.compile = function compile(compiler, args, content, parents, opts, blockName) {
    var propertyName = args.shift(),
        output = [
            '//console.log(\'\\nREACT_SET: ' + propertyName + '\\n\');\n',
            'var react = _ctx._React = _ctx._React || {};\n',
            'react.require = react.require || {};\n',
            'react.tree = (react.tree || []);\n',

            'var current = _ext.reactGetCurrent(react);\n',
            'current.classObj = current.classObj || "";\n',
            'var value = (function(){return ' + args.join('') + ';})();\n',
            'value = typeof value === "object" ? JSON.stringify(value) : value.toString();\n',
            'current.classObj += "' + propertyName + ': " + value + ",\\n";\n',

            '//console.log(\'current #%s#\', JSON.stringify(current, null, 2));\n',
            '//console.log(\'\\n_ctx: #%s#\', JSON.stringify(_ctx, null, 2));\n'
        ].join('');

    // console.log(output);

    return output;
}

exports.parse = function parse(str, line, parser, types, stack, opts) {
    var propertyName;

    parser.on(types.VAR, function(token) {
        if (!this.prevToken) {
            if (token.match.indexOf('.') !== -1) {
                throw new Error('Unexpected dot in reactset property name "' + token.match + '" on line ' + line + '.');
            }

            propertyName = token.match;

            this.out.push(propertyName);
        } else {
            this.out.push('_ctx.' + token.match);
        }
    });

    parser.on(types.ASSIGNMENT, function(token) {
        if (!propertyName || token.match !== '=') {
            throw new Error('Unexpected reactset assignment "' + token.match + '" on line ' + line + '.');
        }
    });

    parser.on('*', function(token) {
        this.out.push(token.match);
    });

    parser.on('end', function() {
        if (!propertyName) {
            throw new Error('Expected a reactuse property name on line ' + line + '.');
        }
    });

    return true;
}

exports.endTag = false;
exports.blockLevel = true;

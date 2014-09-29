exports.compile = function compile(compiler, args, content, parents, opts, blockName) {
    var file = args.shift(),
        componentName = args.shift(),
        parentFile = (args.pop() || '').replace(/\\/g, '\\\\'),
        output = [
            // 'console.log(\'\\nREQUIRE: ' + componentName + '\\n\');\n',
            'var react = _fn.React = _fn.React || {};\n',
            'var components = react.components = react.components || {};\n',

            'components[' + componentName + '] = null;\n',
            'react.currentComponent = _ctx.__reactComponentName = ' + componentName + ';\n',
            // 'console.log(_ctx, react);\n',
            '_swig.compileFile(' + file + ', {\n',
            '   resolveFrom: "' + parentFile + '"\n' +
            '})(_ctx);\n',
            'react.currentComponent = null; delete _ctx.__reactComponentName;\n'
        ].join('');

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

        throw new Error('Unexpected string ' + token.match + ' in require tag on line ' + line + '.');
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
            return
        }

        throw new Error('Unexpected variable "' + token.match + '" in require tag on line ' + line + '.');
    });

    parser.on(types.WHITESPACE, function() {
        return true;
    });

    parser.on('*', function(token) {
        throw new Error('Unexpected token "' + token.match + '" in require tag on line ' + line + '.');
    });

    parser.on('end', function(token) {
        if (!file) {
            throw new Error('Expected a filename in require tag on line ' + line + '.');
        }

        if (!componentName) {
            this.out.push('"' + file.split('/').slice(-1)[0].split('.')[0] + '"');
        }

        this.out.push(opts.filename || null);
    });

    return true;
}

exports.endTag = false;
exports.blockLevel = true;

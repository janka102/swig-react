module.exports = function reactGetCurrent(_React) {
    var current = _React;

    _React.tree.forEach(function(path) {
        current = current.require[path] = current.require[path] || {
            component: '',
            require: {}
        };
    });

    return current;
};

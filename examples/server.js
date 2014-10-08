var express = require('express'),
    app = express(),
    swig = require('swig'),
    path = require('path'),
    fs = require('fs'),
    port = 3000;

// swig-react-tags
require('../index')(swig);

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname);

// NOTE: You should always cache templates in a production environment.
// Don't leave both of these set to `false` in production!
app.set('view cache', false);
swig.setDefaults({
    cache: false
});

app.get('/', function(req, res) {
    res.render('index', {
        examples: getDirectories('.')
    });
});

app.get('/:example', function(req, res) {
    var file = path.join(req.param('example'), 'views', 'index.html');

    res.render(file);
});

app.listen(port, function() {
    console.log('Example started on http://localhost:%d/', port);
});

function getDirectories(folder) {
    return fs.readdirSync(folder).filter(function(file) {
        return file[0] != '.' && fs.statSync(file).isDirectory();
    });
}

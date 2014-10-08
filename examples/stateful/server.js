var express = require('express')
    app = express(),
    swig = require('swig'),
    path = require('path'),
    port = 3000;

// swig-react-tags
require('../../index')(swig);

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// NOTE: You should always cache templates in a production environment.
// Don't leave both of these set to `false` in production!
app.set('view cache', false);
swig.setDefaults({
    cache: false
});

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port, function() {
    console.log('Example started on http://localhost:%d/', port);
});

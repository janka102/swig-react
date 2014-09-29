var swig = require('swig'),
    reactTag = require('../reactTag')(swig),
    port = 3000;

var express = require('express')
    app = express(),
    swig = require('swig');

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// NOTE: You should always cache templates in a production environment.
// Don't leave both of these set to `false` in production!
app.set('view cache', false);
swig.setDefaults({
    cache: false
});

app.use(express.static('./bower_components/'));
app.use(express.static('./public/'));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port, function() {
    console.log('React-swig started on http://localhost:%s/', port);
});

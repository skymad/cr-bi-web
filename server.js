/**
 * Author: guoyao
 * Time: 10-22-2013 18:26
 * Blog: http://www.guoyao.me
 */

var application_root = __dirname,
    http = require('http'),
    express = require('express'),
    path = require('path'),
    xml2js = require("xml2js"),
    app = express(),
    port = 3000,
    directory = (process.argv.length > 2 && process.argv[2] == 'env=production') ? 'dist' : 'app';

// production only
app.configure('production', function(){
    directory = 'dist';
});

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, directory)));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});

app.get('/weatherInfo', function (request, response) {
//    上海58367 杭州58457
    http.get({
        host: 'www.webxml.com.cn',
        path: '/WebServices/WeatherWebService.asmx/getWeatherbyCityName?theCityName=58367'
    }).on('response', function (res) {
        var body = '',
            query = request.query;
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            if (query && query.callback) {
                var weatherInfo = {};
                xml2js.parseString(body, function (err, result) {
                    if (!err) {
                        weatherInfo = result.ArrayOfString.string;
                    }
                });
                response.setHeader("Content-Type", "text/javascript");
                response.send(query.callback + "(" + JSON.stringify(weatherInfo) + ")");
            } else {
                response.send(body);
            }
        });
    }).on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
});



var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var appId = '0cc5117b';
        var appKey = '7fd6ee57ca3497bc04bf70a71a714a97';
        var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.itemName ? req.body.result.parameters.itemName : "";

        console.log(req.body);

        var recipeSearchTerm = '';
        var requestURL = '';

        if (speech) {
            var speechArr = speech.split(' ');
            for (var i = 0; i < speechArr.length; i++) {
                if (i < speechArr.length - 1) {
                    recipeSearchTerm += recipeSearchTerm + speechArr + "+";
                } else if (i == speechArr.length - 1) {
                    recipeSearchTerm += recipeSearchTerm + speechArr;
                }
            }

            requestURL = 'http://api.yummly.com/v1/api/recipes?_app_id=' + appId + '&_app_key=' + appKey + '&q=' + recipeSearchTerm;
        } else {
            // nothing coming from the speech 
            speech = "Please try again!!!";
            requestURL = 'http://api.yummly.com/v1/api/recipes?_app_id=' + appId + '&_app_key=' + appKey + '&q=onion+soup';
        }

        console.log(requestURL);
        console.log(speech);
        console.log(recipeSearchTerm);

        var str = '';

        var apiResponse = http.get(requestURL, function (response) {
            var body = '';

            response.on('data', function (data) {
                body += data;
            });
            // After the response is completed, parse it and log it to the console
            response.on('end', function () {
                var parsed = JSON.parse(body);
                str = parsed;

                return res.json({
                    speech: speech,
                    displayText: speech,
                    source: 'apiai-webhook-sample'
                });
            });
        })

        console.log('result: ', speech);
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
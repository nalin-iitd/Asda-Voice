'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var http = require('http');

const restService = express();
restService.use(bodyParser.json());

restService.get('/hook', function (req, res) {

    console.log('hook request');

    try {
        // var speech = 'empty speech';

        // if (req.body) {
        //     var requestBody = req.body;

        //     if (requestBody.result) {
        //         speech = '';

        //         if (requestBody.result.itemName) {
        //             speech += requestBody.result.itemName.speech;
        //             speech += ' ';
        //         }

        //         if (requestBody.result.action) {
        //             speech += 'action: ' + requestBody.result.action;
        //         }
        //     }
        // }

        var appId = '0cc5117b';
        var appKey = '7fd6ee57ca3497bc04bf70a71a714a97';
        //var requestURL = 'http://api.yummly.com/v1/api/recipes?_app_id=' + appId + '&_app_key=' + appKey + '&q=onion+soup';
        //var requestURL = 'https://test-es.edamam.com/search?q=' + 'chicken';
        var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.itemName ? req.body.result.parameters.itemName : "Seems like some problem. Speak again."

        var recipeSearchTerm = '';
        var speechArr = speech.split(' ');

        for (var i = 0; i < speechArr.length; i++) {
            if (i < speechArr.length - 1) {
                recipeSearchTerm += recipeSearchTerm + speechArr + "+";
            } else if (i == speechArr.length - 1) {
                recipeSearchTerm += recipeSearchTerm + speechArr;
            }
        }

        var requestURL = 'http://api.yummly.com/v1/api/recipes?_app_id=' + appId + '&_app_key=' + appKey + '&q=onion+soup';
        //var requestURL = 'https://test-es.edamam.com/search?q=' + 'chicken';

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
                console.log(requestURL);
                var parsed = JSON.parse(body);
                str = parsed;
                console.log(str.totalMatchCount);
                //handleResult(str.totalMatchCount);
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
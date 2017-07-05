const Promise = require('bluebird');
const httpreq = require('httpreq');
const removeNewline = require('newline-remove');
const parser = require('xml2json');


const submitSearchRequestPromise = function (url, options) {
    return new Promise(function (resolve, reject){
        httpreq.post(url, options, function (err, res){
            if (err) {
                console.log(err);
                return reject(err);
            }

            if(res.statusCode != 200) console.log('Problem occurs!')

            let cleanBody = removeNewline(res.body);

            let json = parser.toJson(cleanBody);

            // console.log(json); // view on json viewer online

            return resolve(json);
        });
    });
}

const submitResultRequestPromise = function (url, options) {
    return new Promise(function (resolve, reject){
        httpreq.post(url, options, function (err, res){
            if (err) {
                console.log(err);
                return reject(err);
            }

            if(res.statusCode != 200) console.log('Problem occurs!')

            let cleanBody = removeNewline(res.body);

            let json = parser.toJson(cleanBody);

            // console.log('**** submitResultRequestPromise *****');
            // console.log(json); // view on json viewer online

            return resolve(json);
        });
    });
}

module.exports = {
    submitSearchRequestPromise: submitSearchRequestPromise,
    submitResultRequestPromise: submitResultRequestPromise
}
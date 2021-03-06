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

const selectFlightForBookingPromise = function (url, options) {
    return new Promise(function (resolve, reject){
        httpreq.post(url, options, function (err, res){
            if (err) {
                console.log(err);
                return reject(err);
            }

            if(res.statusCode != 200) console.log('Problem occurs!')

            let cleanBody = removeNewline(res.body);

            let json = parser.toJson(cleanBody);

            return resolve(json);
        });
    });
}

const submitBookingDetails = function (url, options){
    return new Promise(function (resolve, reject){
        httpreq.post(url, options, function (err, res){
            if (err) {
                console.log(err);
                return reject(err);
            }

            if(res.statusCode != 200) console.log('Problem occurs!')

            let cleanBody = removeNewline(res.body);

            let json = parser.toJson(cleanBody);

            return resolve(json);
        });
    });
}

// ----------------------------
// Hotel APIs
// ----------------------------
const getHotelListPromise = function (url, options) {
    return new Promise(function(resolve, reject){
        httpreq.post(url, options, function (err, res){
            if (err) {
                console.log(err);
                return reject(err);
            }

            if(res.statusCode != 200) console.log('Problem occurs!')

            let cleanBody = removeNewline(res.body);

            let json = parser.toJson(cleanBody);

            return resolve(json);
        });
    });
}

const getHotelLocationCodePromise = function (url, options) {
    return new Promise(function(resolve, reject){
        httpreq.post(url, options, function (err, res){
            if (err) {
                console.log(err);
                return reject(err);
            }

            if(res.statusCode != 200) console.log('Problem occurs!')

            let cleanBody = removeNewline(res.body);

            console.log('====================================');
            console.log(res);
            console.log('====================================');


            let json = parser.toJson(cleanBody);

            let result = {
                body: json,
                sid: res.headers['set-cookie']
            }

            // console.log(result);

            // return resolve(json);
            return resolve(result);
        });
    });
}

const searchHotelPromise = function (url, options) {
    return new Promise(function(resolve, reject){
        httpreq.post(url, options, function (err, res){
            if (err) {
                // console.log(1111);
                // console.log(err);
                return reject(err);
            }
            console.log('====================================');
            console.log(res);
            console.log('====================================');

            if(res.statusCode != 200) console.log('Problem occurs!')

            let cleanBody = removeNewline(res.body);

            // console.log(cleanBody);

            let json = parser.toJson(cleanBody);

            console.log(json);

            result = {
                body: json,
                cookies: res.cookies
            }

            return resolve(result);
        });
    });
}


const delay = function (t) {
   return new Promise(function(resolve) {
       setTimeout(resolve, t)
   });
}

module.exports = {
    submitSearchRequestPromise: submitSearchRequestPromise,
    submitResultRequestPromise: submitResultRequestPromise,
    selectFlightForBookingPromise: selectFlightForBookingPromise,
    submitBookingDetails: submitBookingDetails,

    getHotelListPromise: getHotelListPromise,
    getHotelLocationCodePromise: getHotelLocationCodePromise,
    searchHotelPromise: searchHotelPromise,

    delay, delay
}
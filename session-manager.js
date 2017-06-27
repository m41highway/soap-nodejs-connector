const Promise = require('bluebird');
const soap = require('soap');
const config = require('./config.json');

// ----------------------------------
// Promisify create client function
// ----------------------------------
const createClient = new Promise(function (resolve, reject) {

        soap.createClient(config.rq.url, function (err, client){
            if (err) reject(err);

            return resolve(client);
        })
    }
);



// -------------------------------------
// Promisify create session function
// Be aware the library function begins
// with capital letter
// -------------------------------------
const createSessionPromise = function(client) {
    return new Promise(function (resolve, reject){
        client.CreateSession(config, function (err, response){
            console.log('Hey Hey');
            if (err) reject(err);

            // console.log(response);
            console.log('OK');
            return resolve(response);
        })
    })
};

const airLowFareSearchPromise = function (client, request, session) {
    return new Promise(function (resolve, reject){

        client.AirLowFareSearch(request, function (err, response){
            if (err) {
                console.log(err);
                return reject(err);
            }

            console.log('Air Low Fare Search ...');
            return resolve(response);
        })
    })
};

module.exports = {
    createClient: createClient,
    createSessionPromise: createSessionPromise,
    airLowFareSearchPromise: airLowFareSearchPromise
}

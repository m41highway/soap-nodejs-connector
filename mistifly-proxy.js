// -----------------------------------------------------------------
// This is a proxy for Node Js to communicate with the SOAP API of
// Mystifly
//
// Pay attention!!
// 1. All the function name/ SOAP Endpoint begin with capital letter
// 2. All the proxied API begin with small capital letter, following
//    Node Js standards
// 3. The sequence of attributes in the request parameter matters!
//
// Following lists the native SOAP API:
// CreateSession: [Object],
// EndSession: [Object],
// AirLowFareSearch: [Object],
// AirRevalidate: [Object],
// BookFlight: [Object],
// FareRules: [Object],
// CancelBooking: [Object],
// TicketOrder: [Object],
// TripDetails: [Object],
// AddBookingNotes: [Object],
// MessageQueues: [Object],
// RemoveMessageQueues: [Object],
// AirSeatMap: [Object],
// AirSeatReserve: [Object],
// AirBookingData: [Object],
// MultiAirRevalidate: [Object],
// MultiAirBookFlight: [Object],
// IntelliFareSearch: [Object],
// IntelliBestBuy: [Object],
// AirQuote: [Object],
// FareRules1_1: [Object],
// CreateSession1_1: [Object],
// CreateSession1_2: [Object],
// Check3DSCardDetails: [Object]
// -----------------------------------------------------------------

const Promise = require('bluebird');
const soap = require('soap');
const config = require('./config.json');
const requestHelper = require('./request-helper');


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
// -------------------------------------
const createSessionPromise = function(client) {
    return new Promise(function (resolve, reject){
        client.CreateSession(config, function (err, response){
            if (err) reject(err);

            return resolve(response);
        })
    })
};

// -------------------------------------
// Promisify airLowFareSearch
// -------------------------------------
const airLowFareSearchPromise = function (client, sessionId, options) {
    return new Promise(function (resolve, reject){

        let params = requestHelper.generateAirLowFareSearchOptions(sessionId, options);

        client.AirLowFareSearch(params, function (err, response){
            if (err) {
                return reject(err);
            }

            return resolve(response);
        })
    })
};

// -------------------------------------
// Promisify airRevalidate
// -------------------------------------
const airRevalidatePromise = function (client, sessionId, options) {
    return new Promise(function (resolve, reject) {

        client.AirRevalidate(options, function(err, response) {
            if (err) {
                return reject(err);
            }

            return resolve(response);
        })
    })
}

// -------------------------------------
// Promisify airBook
// -------------------------------------
const airBookPromise = function(client, sessionId, options) {
    return new Promise(function (resolve, reject){

        // console.log('client object', client);

        client.BookFlight(options, function(err, response){
            if (err) {
                return reject(err);
            }

            return resolve(response);
        })
    })
}

// -------------------------------------
// Promisify airOrderTicket
// -------------------------------------
const airOrderTicketPromise = function(client, sessionId, options) {
    return new Promise(function (resolve, reject) {

        client.TicketOrder(options, function(err, response){
            if (err) {
                return reject(err);
            }

            return resolve(response);
        })
    })
}

module.exports = {
    createClient: createClient,
    createSessionPromise: createSessionPromise,
    airLowFareSearchPromise: airLowFareSearchPromise,
    airRevalidatePromise: airRevalidatePromise,
    airBookPromise: airBookPromise,
    airOrderTicketPromise: airOrderTicketPromise
}

const sessionManager = require('./session-manager');

let clientStub;

// ------------------------------
// Step 1: Init proxy
// ------------------------------
sessionManager.createClient


.then(function (client) {

    clientStub = client; // for later use


    // ------------------------------
    // Step 2: Create session
    // ------------------------------
    return sessionManager.createSessionPromise(client)
})


.then((result) => {

    // ------------------------------
    // Step 3: Flight search
    // ------------------------------
    let options = {
        legs: [
            {
                'origin': 'HKG',
                'destination': 'SIN',
                'departureDateTime': '2017-07-30T00:00:00'
            },
            {
                'origin': 'SIN',
                'destination': 'HKG',
                'departureDateTime': '2017-08-06T00:00:00'
            }
        ],
        cabinType: 'Economy'  // [ 'Economy', 'Business', 'First' ]
    };

    return sessionManager.airLowFareSearchPromise(clientStub, result.CreateSessionResult.SessionId, options);
})
.then( (res) => {

    // console.log('Calling fare search...');


    if (!res.AirLowFareSearchResult) console.log('Fail to connect to API!');

    if(res.AirLowFareSearchResult.Errors) {
        console.log(res.AirLowFareSearchResult.Errors);
    }

    if (res.AirLowFareSearchResult.PricedItineraries) {
        let fareList = res.AirLowFareSearchResult.PricedItineraries.PricedItinerary;

        console.log(fareList);
        console.log('--------------------------------------');
        // console.log(fareList.OriginDestinationOptions);

        let simplifiedList = fareList.map(function(element){
            return {
                segments: element.OriginDestinationOptions.OriginDestinationOption,
                fareSourceCode: element.AirItineraryPricingInfo.FareSourceCode
            }
        })

        console.log('=======================================');
        console.log(simplifiedList);

        simplifiedList.forEach(function(s){
            console.log(s.fareSourceCode);
            s.segments.forEach(function(seg){
                console.log(seg);
            })

        })

        // persist

    }




})
.catch( (error) => {
    console.log(error);
});
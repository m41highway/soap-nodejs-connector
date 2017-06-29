const sessionManager = require('./session-manager');

let clientStub;
let tempSessionId;

// ------------------------------
// Step 1: Init proxy
// ------------------------------
console.log('----- Step 1": Init proxy -----');
sessionManager.createClient


.then(function (client) {

    clientStub = client; // for later use


    // ------------------------------
    // Step 2: Create session
    // ------------------------------
    console.log('----- Step 2": Create Session -----');
    return sessionManager.createSessionPromise(client)
})


.then((result) => {

    tempSessionId = result.CreateSessionResult.SessionId; // for later use

    // ------------------------------
    // Step 3: Flight search
    // ------------------------------
    let options = {
        legs: [
            {
                'origin': 'DEL',
                'destination': 'SIN',
                'departureDateTime': '2017-09-02T00:00:00'
            },
            {
                'origin': 'SIN',
                'destination': 'DEL',
                'departureDateTime': '2017-09-05T00:00:00'
            }
        ],
        cabinType: 'Economy'  // [ 'Economy', 'Business', 'First' ]
    };

    console.log('----- Step 3": Low Fare Search -----');
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

        // console.log(fareList);
        // console.log('--------------------------------------');
        // console.log(fareList.OriginDestinationOptions);

        let simplifiedList = fareList.map(function(element){
            return {
                segments: element.OriginDestinationOptions.OriginDestinationOption,
                fareSourceCode: element.AirItineraryPricingInfo.FareSourceCode
            }
        })

        // console.log('=======================================');
        // console.log(simplifiedList);

        // simplifiedList.forEach(function(s){
            // console.log(s.fareSourceCode);
            // s.segments.forEach(function(seg){
            //     console.log(seg);
            // })
        // })



        // persist

        return simplifiedList;
    }
})

.then(function(simplifiedList){

    console.log('----- Step 4": Air Revalidate -----');
    console.log('Number of itin:', simplifiedList.length);
    console.log(simplifiedList[0]);

    let options = {
        rq: {
            FareSourceCode: simplifiedList[0].fareSourceCode,
            SessionId: tempSessionId,
            Target: 'Test'
        }

    }

    // console.log(tempSessionId);
    console.log(options);

    return sessionManager.airRevalidatePromise(clientStub, tempSessionId, options)
})

.then(function(res){
    console.log('After revalidate...');
    // console.log(res);

    if (!res.AirRevalidateResult) console.log('Fail to connect to API!');

    if (res.AirRevalidateResult.Errors) {
        console.log(res.AirRevalidateResult.Errors.Error);
    }

    console.log(res.AirRevalidateResult.PricedItineraries.PricedItinerary);
})

.catch( (error) => {
    console.log(error);
});
const proxy = require('./mistifly-proxy');

let clientStub;
let tempSessionId;

// ------------------------------
// Step 1: Init proxy
// ------------------------------
console.log('----- Step 1": Init proxy -----');
proxy.createClient


.then(function (client) {

    clientStub = client; // for later use


    // ------------------------------
    // Step 2: Create session
    // ------------------------------
    console.log('----- Step 2": Create Session -----');
    return proxy.createSessionPromise(client)
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
                'departureDateTime': '2017-09-04T00:00:00'
            },
            {
                'origin': 'SIN',
                'destination': 'DEL',
                'departureDateTime': '2017-09-07T00:00:00'
            }
        ],
        cabinType: 'Economy'  // [ 'Economy', 'Business', 'First' ]
    };

    console.log('----- Step 3": Low Fare Search -----');
    return proxy.airLowFareSearchPromise(clientStub, result.CreateSessionResult.SessionId, options);
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
                fareSourceCode: element.AirItineraryPricingInfo.FareSourceCode,
                totalFare: element.AirItineraryPricingInfo.ItinTotalFare.TotalFare,
                isPassportMandatory: element.IsPassportMandatory,
                ticketType: element.TicketType
            }
        })

        // console.log(simplifiedList);

        simplifiedList.forEach(function(s){
            console.log('=======================================');
            // console.log(s.fareSourceCode);
            s.segments.forEach(function(seg){
                // console.log(seg);
                let s = seg.FlightSegments.FlightSegment;

                // console.log(seg.FlightSegments.FlightSegment.DepartureAirportLocationCode);
                // console.log(seg.FlightSegments.FlightSegment.ArrivalAirportLocationCode);
                // console.log(seg.FlightSegments.FlightSegment.DepartureDateTime);
                // console.log(seg.FlightSegments.FlightSegment.ArrivalDateTime);
                // console.log(seg.FlightSegments.FlightSegment.OperatingAirline);
                // console.log(seg.FlightSegments.FlightSegment.CabinClassCode);

                console.log(`${s.DepartureAirportLocationCode} -> ${s.ArrivalAirportLocationCode} by ${s.OperatingAirline.Code} ${s.OperatingAirline.FlightNumber} (${s.OperatingAirline.Equipment}) ${s.DepartureDateTime} -> ${s.ArrivalDateTime}`);
            })
            console.log(`${s.totalFare.CurrencyCode} ${s.totalFare.Amount}`);
        })



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

    return proxy.airRevalidatePromise(clientStub, tempSessionId, options)
})

.then(function(res){
    console.log('After revalidate...');
    // console.log(res);

    if (!res.AirRevalidateResult) console.log('Fail to connect to API!');

    if (res.AirRevalidateResult.Errors) {
        console.log(res.AirRevalidateResult.Errors.Error);
    }

    console.log(res.AirRevalidateResult.PricedItineraries.PricedItinerary);

    console.log('--------------------------');
    console.log(res.AirRevalidateResult.PricedItineraries.PricedItinerary.AirItineraryPricingInfo.FareInfos);
    console.log(res.AirRevalidateResult.PricedItineraries.PricedItinerary.AirItineraryPricingInfo.ItinTotalFare);
    console.log(res.AirRevalidateResult.PricedItineraries.PricedItinerary.AirItineraryPricingInfo.PTC_FareBreakdowns);

    let airItineraryPricingInfo = res.AirRevalidateResult.PricedItineraries.PricedItinerary.AirItineraryPricingInfo;




    console.log('----- Step 5": Book -----');

    let options = {
        rq: {
            FareSourceCode: airItineraryPricingInfo.FareSourceCode,
            SessionId: tempSessionId,
            TravelerInfo:{
                AirTravelers: {
                    AirTraveler: [
                        {
                            Gender: 'F',
                            PassengerName: {
                                PassengerFirstName: 'Testing',
                                PassengerLastName: 'Tester',
                                PassengerTitle: 'MRS' // MR/MRS/Sir/Lord/Lady/Miss/Inf
                            },
                            PassengerType: 'ADT', // ADT, CHD, INF
                            Email: 'anthony.ng@travie.co',
                        }
                    ]

                    // AirTraveler: [
                    //     {
                    //         PassengerType: 'ADT', // ADT, CHD, INF
                    //         Gender: 'M',
                    //         PassengerName: {
                    //             PassengerTitle: 'Mr', // Mr/Mrs/Sir/Lord/Lady/Miss/Inf
                    //             PassengerFirstName: 'Testing',
                    //             PassengerLastName: 'Tester',
                    //         },
                    //         DateOfBirth: '1982-05-15T00:00:00',
                    //         FrequentFlyerNumber: 'BA4356789', // It specifies the passenger frequent flyer number preceding with the Yes two letters IATA airline code.
                    //         Passport: {
                    //             PassportNumber: 'ABC455767453',
                    //             ExpiryDate: '2020-01-16T00:00:00',
                    //             Country: 'IN',
                    //         },
                    //         ExtraServices1_1: {
                    //             Services: {
                    //                 ExtraServiceId: 2
                    //             }
                    //         },
                    //         ExtraServices: {
                    //             Services: {
                    //                 ExtraServiceId: 2,
                    //                 Quantity: 1
                    //             }
                    //         },
                    //         AreaCode: 66,
                    //         CountryCode: 852,
                    //         Email: 'anthony.ng@travie.co',
                    //         PhoneNumber: 65789487
                    //     }
                    // ]
                }
            },
            Target: 'Test'
        }
    }

    return proxy.airBookPromise(clientStub, tempSessionId, options)

})

.then(function(res) {

    console.log(res);

    if (res.BookFlightResult.Errors) {
        console.log(res.BookFlightResult.Errors.Error);
    }


    console.log(res.BookFlightResult);

// Sample successful
// { Errors: null,
//      Status: 'CONFIRMED',
//      Success: 'true',
//      Target: 'Default',
//      TktTimeLimit: '2017-06-30T02:29:59',
//      UniqueID: 'MF01598517' }

    console.log('----- Step 6": Order Ticket -----');
    let options = {
        rq: {
            SessionId: tempSessionId,
            UniqueID: res.BookFlightResult.UniqueID,
            Target: 'Test'
        }
    }
    return proxy.airOrderTicketPromise(clientStub, tempSessionId, options)

})

.then(function(res){


    if (res.TicketOrderResult.Errors) {
        console.log(res.TicketOrderResult.Errors.Error);
    }

    console.log(res.TicketOrderResult);
})


.catch( (error) => {
    console.log(error);
});
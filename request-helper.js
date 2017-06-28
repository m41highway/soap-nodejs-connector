// ---------------------------------------------------------------
// paras:
// 1. sessionId
// 2. options.departureDateTime
// 3. options.origin
// 4. options.destination
//
// ---------------------------------------------------------------
const generateAirLowFareSearchOptions = function (sessionId, options) {

    // ------------------------------
    // Transform segments criteria
    // ------------------------------
    let originDestinationInformation = options.legs.map(function(leg){
        return {
            DepartureDateTime: leg.departureDateTime,
            DestinationLocationCode: leg.destination,
            OriginLocationCode: leg.origin
        }
    })

    // ------------------------------
    // Lookup cabinType criteria
    // ------------------------------
    let cabinType = 'Y'
    switch(options.cabinType) {
        case 'Economy':
            cabinType = 'Y'
            break;
        case 'Business':
            cabinType = 'C'
            break;
        case 'First':
            cabinType = 'F'
            break;
        default:
            cabinType = 'Y'
    }

    let airLowFareSearchOptions = {
        rq: {
            IsRefundable: true,
            IsResidentFare: false,
            NearByAirports: true,
            OriginDestinationInformations: {
                OriginDestinationInformation: originDestinationInformation
            },
            PassengerTypeQuantities: {
                PassengerTypeQuantity: {
                    Code: 'ADT',
                    Quantity: 1
                }
            },
            PricingSourceType: 'All',
            RequestOptions: 'Fifty',
            SessionId: sessionId,
            Target: 'Test',
            TravelPreferences: {
                AirTripType: 'Return',
                CabinPreference: 'Y',
                MaxStopsQuantity: 'Direct',
                Preferences: {
                    CabinClassPreference: {
                        CabinType: cabinType
                    }
                }
            }
        }
    }

    return airLowFareSearchOptions;
}


module.exports = {
    generateAirLowFareSearchOptions: generateAirLowFareSearchOptions
}
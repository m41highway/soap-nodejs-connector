const soap = require('soap');

const wsdl = 'https://testv80.elsyarres.net/service.asmx?WSDL';

soap.createClient(wsdl, function (err, client){
    if (err) console.log(err);

    console.log(client.describe());
    // console.log(client.describe().WebService.WebServiceSoap.SearchFlights);

    console.log(client.describe().WebService.WebServiceSoap.GetFlightDetails);

    let options = {
        SoapMessage: {
            Username: 'Travie',
            Password: '3844152EB5',
            LanguageCode: 'EN',
            Request:
            {
                DepartureDate: '2017-09-02',
                ReturnDate: '2017-09-04',
                Departure: 'FRA',
                Destination: 'LAX',
                NumADT: 1,
                NumINF: 0,
                NumCHD: 0,
                CurrencyCode: 'USD',
                WaitForResult: false,
                NearbyDepartures: false,
                NearbyDestinations: false,
                RROnly: false,
                MetaSearch: false
                // Roundtrip: false
            },
        }
    };

    client.SearchFlights(options, function(err, res){
        if (err) console.log(err);

        console.log(res);
        console.log(res.SearchFlightId);

        let flightDetailsOption = {
            SoapMessage: {
                Username: 'Travie',
                Password: '3844152EB5',
                LanguageCode: 'EN',
                Request:{
                    FlightId: res.SearchFlightId
                }
            }
        }

        client.GetFlightDetails(flightDetailsOption, function(err, res){
            if (err) console.log(err);

            console.log(res);
        })
    })
})
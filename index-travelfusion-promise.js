const proxy = require('./travelfusion-proxy');
const config = require('./config');

let routingId;
let outwardId;
let returnId;

const options = {
    body: '<CommandList>' +
    '<StartRouting>' +
        `<XmlLoginId>${config.travelfusion.flights.xmlLoginId}</XmlLoginId>` +
        `<LoginId>${config.travelfusion.flights.xmlLoginId}</LoginId>` +
        `<Mode>plane</Mode>` +
        '<Origin>' +
            // `<Descriptor>LON</Descriptor>` +
            // `<Descriptor>DEL</Descriptor>` +
            `<Descriptor>HKG</Descriptor>` +
            `<Type>airportgroup</Type>` +
        `</Origin>` +
        `<Destination>` +
            // `<Descriptor>MAD</Descriptor>` +
            // `<Descriptor>SIN</Descriptor>` +
            `<Descriptor>NRT</Descriptor>` +
            `<Type>airportcode</Type>` +
            `<Radius>1000</Radius>` +
        `</Destination>` +
        `<OutwardDates>` +
            `<DateOfSearch>27/08/2017-10:00</DateOfSearch>` +
        `</OutwardDates>` +
        `<ReturnDates>` +
            `<DateOfSearch>30/08/2017-10:00</DateOfSearch>` +
        `</ReturnDates>` +
        `<MaxChanges>1</MaxChanges>` +
        `<MaxHops>2</MaxHops>` +
        `<Timeout>40</Timeout>` +
        `<TravelClass>First</TravelClass>` +  // Best Effort Only
        `<TravellerList>` +
            `<Traveller>` +
                `<Age>30</Age>` +
            `</Traveller>` +
        `</TravellerList>` +
        `<IncrementalResults>true</IncrementalResults>` +
    `</StartRouting>` +
`</CommandList>`,
    headers:{
        'Content-Type': 'text/xml; charset=utf-8',
  }
}



proxy.submitSearchRequestPromise(config.travelfusion.flights.apiEndpoint, options)

.then (function(res){
    let jsonObj = JSON.parse(res);
    // console.log(jsonObj.CommandList);

    console.log('---- Routing Id ----');
    console.log(jsonObj.CommandList.StartRouting.RoutingId);
    // return jsonObj.CommandList.StartRouting.RoutingId;
    routingId = jsonObj.CommandList.StartRouting.RoutingId;

    const options2 = {
        body: '<CommandList>' +
            '<CheckRouting>' +
                `<XmlLoginId>${config.travelfusion.flights.xmlLoginId}</XmlLoginId>` +
                `<LoginId>${config.travelfusion.flights.xmlLoginId}</LoginId>` +
                `<RoutingId>${jsonObj.CommandList.StartRouting.RoutingId}</RoutingId>` +
            `</CheckRouting>` +
        `</CommandList>`,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
        }
    }

    return proxy.submitResultRequestPromise(config.travelfusion.flights.apiEndpoint, options2)
})

.then(function (res){
    // console.log(res);
    let jsonObj = JSON.parse(res);
    console.log('------------------------------------');
    console.log('Step 3: submit result request');
    // console.log(jsonObj.CommandList.CheckRouting.RouterList);
    // console.log(jsonObj.CommandList.CommandExecutionFailure.CheckRouting);
    jsonObj.CommandList.CheckRouting.RouterList.Router.forEach(function (element){
        console.log('********************');
        // console.log(element.GroupList);
    //     // console.log(element.GroupList.Group.OutwardList.Outward);
        if (element.GroupList.Group){

            // console.log('^^^^^^^^');

            // console.log(element.GroupList.Group.OutwardList);
            // console.log(element.GroupList.Group.ReturnList);


            element.GroupList.Group.OutwardList.Outward.forEach(function (s) {
                // console.log(s);
                console.log('---- Outward Id ----', s.Id);
                console.log(`(1) ${s.Price.Currency} ${s.Price.Amount}`);

                // console.log(s.SegmentList.Segment);
                // console.log(s.SegmentList);

                if (Array.isArray(s.SegmentList.Segment)){      // mulitple segment
                    s.SegmentList.Segment.forEach(function (x){
                        console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                    })
                } else {
                    // should be an object, single segment
                    let x = s.SegmentList.Segment;
                    console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                }
            })

            // Take the earliest slot for outward
            outwardId = element.GroupList.Group.OutwardList.Outward[0].Id;

            element.GroupList.Group.ReturnList.Return.forEach(function(r){
                // console.log(r);
                console.log('---- Return Id ----', r.Id);
                console.log(`(2) ${r.Price.Currency} ${r.Price.Amount}`);

                if (Array.isArray(r.SegmentList.Segment)) {      // Array, multiple segment
                    r.SegmentList.Segment.forEach(function (x){
                        console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                    })
                } else {
                    let x = r.SegmentList.Segment; // single segemtn
                    console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                }
            })

            returnId = element.GroupList.Group.ReturnList.Return[ element.GroupList.Group.ReturnList.Return.length -1 ].Id;

        }
    })

    console.log('--- Summary ---');
    console.log(jsonObj.CommandList.CheckRouting.Summary);

    const options3 = {
        body: '<CommandList>' +
                '<ProcessDetails>' +
                `<XmlLoginId>${config.travelfusion.xmlLoginId}</XmlLoginId>` +
                `<LoginId>${config.travelfusion.xmlLoginId}</LoginId>` +
                `<RoutingId>${routingId}</RoutingId>` +
                `<OutwardId>${outwardId}</OutwardId>` +
                `<ReturnId>${returnId}</ReturnId>` +
                `<HandoffParametersOnly>false</HandoffParametersOnly>` +
                '</ProcessDetails>' +
        `</CommandList>`,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
        }
    }

    // console.log(options3);
    return proxy.selectFlightForBookingPromise(config.travelfusion.flights.apiEndpoint, options3)
})
.then(function (res){

    // console.log(res);

    let jsonObj = JSON.parse(res);
    console.log('------------------------------------');
    console.log('Step 4: booking flight');

    console.log(jsonObj.CommandList.ProcessDetails);

    const options4 = {
        body: '<CommandList>' +
                '<ProcessTerms>' +
                    `<XmlLoginId>${config.travelfusion.xmlLoginId}</XmlLoginId>` +
                    `<LoginId>${config.travelfusion.xmlLoginId}</LoginId>` +
                    `<RoutingId>${routingId}</RoutingId>` +
                    // `<ReturnId>${returnId}</ReturnId>` +
                    '<BookingProfile>' +
                    '<TravellerList>' +
                        '<Traveller>' +
                        `<Age>30</Age>` +
                        '<Name>' +
                            `<Title>Mr</Title>` +
                            '<NamePartList>' +
                            `<NamePart>Andy</NamePart>` +
                            `<NamePart>S</NamePart>` +
                            `<NamePart>Peterson</NamePart>` +
                            '</NamePartList>' +
                        '</Name>' +
                        '<CustomSupplierParameterList>' +
                            '<CustomSupplierParameter>' +
                            `<Name>DateOfBirth</Name>` +
                            `<Value>16/04/1974</Value>` +
                            '</CustomSupplierParameter>' +
                        '</CustomSupplierParameterList>' +
                        '</Traveller>' +
                    '</TravellerList>' +
                    '<ContactDetails>' +
                        '<Name>' +
                        `<Title>Mr</Title>` +
                        '<NamePartList>' +
                            `<NamePart>Andy</NamePart>` +
                            `<NamePart>S</NamePart>` +
                            `<NamePart>Peterson</NamePart>` +
                        '</NamePartList>' +
                        '</Name>' +
                        '<Address>' +
                        `<Company></Company>` +
                        `<Flat>22A</Flat>` +
                        `<BuildingName>Dean's Court</BuildingName>` +
                        `<BuildingNumber>3</BuildingNumber>` +
                        `<Street>St. George Street</Street>` +
                        `<Locality>Redland</Locality>` +
                        `<City>Bristol</City>` +
                        `<Province>Avon</Province>` +
                        `<Postcode>BS8 6GC</Postcode>` +
                        `<CountryCode>GB</CountryCode>` +
                        '</Address>' +
                        '<HomePhone>' +
                        `<InternationalCode>0044</InternationalCode>` +
                        `<AreaCode>12332</AreaCode>` +
                        `<Number>232223</Number>` +
                        `<Extension>3322</Extension>` +
                        '</HomePhone>' +
                        `<Email>andy@hotmail.com</Email>` +
                    '</ContactDetails>' +
                    '<BillingDetails>' +
                        '<Name>' +
                        `<Title>Mr</Title>` +
                        '<NamePartList>' +
                            `<NamePart>Andy</NamePart>` +
                            `<NamePart>S</NamePart>` +
                            `<NamePart>Peterson</NamePart>` +
                        '</NamePartList>' +
                        '</Name>' +
                        '<Address>' +
                        `<Company></Company>` +
                        `<Flat>22A</Flat>` +
                        `<BuildingName>Dean's Court</BuildingName>` +
                        `<BuildingNumber>3</BuildingNumber>` +
                        `<Street>St. George Street</Street>` +
                        `<Locality>Redland</Locality>` +
                        `<City>Bristol</City>` +
                        `<Province>Avon</Province>` +
                        `<Postcode>BS8 6GC</Postcode>` +
                        `<CountryCode>GB</CountryCode>` +
                        '</Address>' +
                        '<CreditCard>' +
                        `<Company></Company>` +
                        '<NameOnCard>' +
                            '<NamePartList>' +
                            `<NamePart>Mr Andy S Peterson</NamePart>` +
                            '</NamePartList>' +
                        '</NameOnCard>' +
                        `<Number>5105105105105100</Number>` +
                        `<SecurityCode>887</SecurityCode>` +
                        `<ExpiryDate>09/19</ExpiryDate>` +
                        `<StartDate>01/16</StartDate>` +
                        `<CardType>MasterCard</CardType>` +
                        `<IssueNumber>0</IssueNumber>` +
                        '</CreditCard>' +
                    '</BillingDetails>' +
                    '</BookingProfile>' +
                '</ProcessTerms>' +



        `</CommandList>`,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
        }
    }

    return proxy.submitBookingDetails(config.travelfusion.flights.apiEndpoint, options4)
})
.then(function (res){
    let jsonObj = JSON.parse(res);

    console.log('-------------------------------------');
    console.log('Step 5: Submit passengers details');

    console.log(jsonObj);
    // console.log(jsonObj.CommandList.DataValidationFailure);
    // console.log(jsonObj.CommandList.DataValidationFailure.ProcessTerms.BookingProfile.TravellerList);
    // console.log(jsonObj.CommandList.DataValidationFailure.ProcessTerms.BookingProfile.ContactDetails);
    // console.log(jsonObj.CommandList.DataValidationFailure.ProcessTerms.BookingProfile.BillingDetails);
    console.log(jsonObj.CommandList.CommandExecutionFailure.ProcessTerms);


    console.log(jsonObj.CommandList.GeneralInfoItemList.GeneralInfoItem);
})
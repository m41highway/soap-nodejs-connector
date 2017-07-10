const proxy = require('./travelfusion-proxy');
const config = require('./config');

const options = {
    body: '<CommandList>' +
    '<StartRouting>' +
        `<XmlLoginId>${config.travelfusion.xmlLoginId}</XmlLoginId>` +
        `<LoginId>${config.travelfusion.xmlLoginId}</LoginId>` +
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



proxy.submitSearchRequestPromise(config.travelfusion.apiEndpoint, options)

.then (function(res){
    let jsonObj = JSON.parse(res);
    // console.log(jsonObj.CommandList);

    console.log('---- Routing Id ----');
    console.log(jsonObj.CommandList.StartRouting.RoutingId);
    // return jsonObj.CommandList.StartRouting.RoutingId;

    const options2 = {
        body: '<CommandList>' +
            '<CheckRouting>' +
                `<XmlLoginId>${config.travelfusion.xmlLoginId}</XmlLoginId>` +
                `<LoginId>${config.travelfusion.xmlLoginId}</LoginId>` +
                `<RoutingId>${jsonObj.CommandList.StartRouting.RoutingId}</RoutingId>` +
            `</CheckRouting>` +
        `</CommandList>`,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
        }
    }

    return proxy.submitResultRequestPromise(config.travelfusion.apiEndpoint, options2)
})

.then(function (res){
    // console.log(res);
    let jsonObj = JSON.parse(res);
    console.log('------------------------------------');
    console.log('Step 3: submit result request');
    // console.log(jsonObj.CommandList.CheckRouting.RouterList);

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

            element.GroupList.Group.ReturnList.Return.forEach(function(r){
                // console.log(r);
                console.log('---- Return Id ----', r.Id);
                console.log(`(2) ${r.Price.Currency} ${r.Price.Amount}`);

                if (Array.isArray(r.SegmentList.Segment)) {      // Array, multiple segment
                    r.SegmentList.Segment.forEach(function (x){
                        console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                    })
                } else {
                    let x = r.SegmentList.Segment;
                    console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                }
            })
        }
    })

    console.log('--- Summary ---');
    console.log(jsonObj.CommandList.CheckRouting.Summary);

})
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
            `<Descriptor>DEL</Descriptor>` +
            `<Type>airportgroup</Type>` +
        `</Origin>` +
        `<Destination>` +
            // `<Descriptor>MAD</Descriptor>` +
            `<Descriptor>SIN</Descriptor>` +
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
    console.log(jsonObj.CommandList);

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
        console.log(element.GroupList);
    //     // console.log(element.GroupList.Group.OutwardList.Outward);
        if (element.GroupList.Group){

            // console.log('^^^^^^^^');

            // console.log(element.GroupList.Group.OutwardList);
            // console.log(element.GroupList.Group.ReturnList);


            element.GroupList.Group.OutwardList.Outward.forEach(function (s) {
                console.log(s);
                console.log(`(1) ${s.Price.Currency} ${s.Price.Amount}`);

                // console.log(s.SegmentList.Segment);

                s.SegmentList.Segment.forEach(function (x){
                    console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                })
            })

            element.GroupList.Group.ReturnList.Return.forEach(function(r){
                console.log(r);
                console.log(`(2) ${r.Price.Currency} ${r.Price.Amount}`);

                r.SegmentList.Segment.forEach(function (x){
                    console.log(`${x.Origin.Code} -> ${x.Destination.Code} by ${x.Operator.Name} ${x.FlightId.Code} ${x.DepartDate} -> ${x.ArriveDate} (${x.TravelClass.TfClass})`);
                })
            })
        }
    })

    console.log('--- Summary ---');
    console.log(jsonObj.CommandList.CheckRouting.Summary);

})
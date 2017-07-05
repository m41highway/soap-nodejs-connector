const httpreq = require('httpreq');
const parser = require('xml2json');
const removeNewline = require('newline-remove');


const url = 'https://api.travelfusion.com';

const xmlLoginId = '2OJBM9GHGS97N0E5';

const args = {
    body: '<CommandList>' +
    '<StartRouting>' +
        `<XmlLoginId>${xmlLoginId}</XmlLoginId>` +
        `<LoginId>${xmlLoginId}</LoginId>` +
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


httpreq.post(url, args, function (err, res){
    if (err) console.log(err);

    if(res.statusCode != 200) console.log('Problem occurs!')

    let cleanBody = removeNewline(res.body);

    let json = parser.toJson(cleanBody);

    console.log(json); // view on json viewer online

});
const proxy = require('./travelfusion-proxy');
const config = require('./config');

// let city = 'Lon';
let city = 'Hkg';

const options = {

    body: `<ResolveLocationRequest token="${config.travelfusion.hotels.token}" xmlns="http://www.travelfusion.com/xml/api/simple">` +
            `<text>${city}</text>` +
            `<maxOptions>10</maxOptions>` +
            `<language>EN,FI</language>` +
            `<showSubLocations>true</showSubLocations>` +
        `</ResolveLocationRequest>`,
    headers: {
        'Content-Type': 'text/xml; charset=utf-8',
    }
}



proxy.getHotelLocationCodePromise(config.travelfusion.hotels.apiEndpoint, options)
.then(function (res){

    // let position = res.sid[0].indexOf('; path=/');

    // let sid = res.sid[0].substring(0, position);
    // let sid = res.sid[0];

    // console.log('sid=', sid);
    // console.log('body...', res.body);

    // let jsonObj = JSON.parse(res);
    let jsonObj = JSON.parse(res.body);
    // console.log(jsonObj.ResolveLocationResponse.locations);
    console.log('Real sid', jsonObj.ResolveLocationResponse.sid);



    const options2 = {
        body: `<GetHotelsRequest sid="${jsonObj.ResolveLocationResponse.sid}" token="${config.travelfusion.hotels.token}" xmlns="http://www.travelfusion.com/xml/api/simple">` +
            '<location>' +
            //<!-- Submit only 1 of the following location identifiers -->
            `<city code="LON"/>` +
            `<airport code="LHR"/>` +
            `<hotel code="00005gaw87"/>` +
            `<coordinate lat="0.34234" lon="65.283"/>` +
            `<locationResolutionResultItem id="6296680"/>` +
            '</location>' +
            `<radius>xxx</radius>` +        // in metres. If omitted, default logic will be used.
            `<date>2017-09-10</date>` +
            `<duration>4</duration>` +
            '<rooms>' +
                '<room>' +
                    //<!-- The ages of the people that will be staying in the room -->
                    '<ages>' +
                    `<age>30</age>` +
                    `<age>30</age>` +
                    `<age>1</age>` +
                    '</ages>' +
                '</room>' +
            '</rooms>' +
            //<!-- special parameters may be necessary in certain special cases. Please discuss with Travelfusion if you feel that you need to submit any extra information such as personal logins to supplier systems -->
            // '<specialParameters>' +
            //     `<parameter type="supplier" name="_supplier_name_._param_name_">__some_value__</parameter>` +
            // '</specialParameters>' +
            '</GetHotelsRequest>',
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cookies': jsonObj.ResolveLocationResponse.sid,
            'Accept-Encoding': 'gzip',
            'Host': 'api.travelfusion.com',
            'User-Agent': 'curl/7.19.7 (x86_64-pc-linux-gnu) libcurl/7.19.7 zlib/1.2.3'
        }
    };

    return proxy.searchHotelPromise(config.travelfusion.hotels.apiEndpoint, options2)
})

.then(function (res){

    // console.log(res);
    let jsonObj = JSON.parse(res);
    console.log(jsonObj.body);
})
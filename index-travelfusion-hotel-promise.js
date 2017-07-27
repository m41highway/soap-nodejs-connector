const proxy = require('./travelfusion-proxy');
const config = require('./config');

let city = 'Lon';
// let city = 'Hkg';

let globalRes;

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

console.log(res);

    let jsonObj = JSON.parse(res.body);
    console.log(jsonObj.ResolveLocationResponse.locations);
    // console.log('Real sid', jsonObj.ResolveLocationResponse.sid);



    const options2 = {
        body: `<GetHotelsRequest token="${config.travelfusion.hotels.token}" xmlns="http://www.travelfusion.com/xml/api/simple">` +
            '<location>' +
            //<!-- Submit only 1 of the following location identifiers -->
            // `<city code="LON"/>` +
            // `<airport code="LON"/>` +
            //`<hotel code="00005gaw87"/>` +
            //`<coordinate lat="0.34234" lon="65.283"/>` +
            `<locationResolutionResultItem id="6296599"/>` +  // LCY
            '</location>' +
            // `<radius>3000</radius>` +        // in metres. If omitted, default logic will be used.
            `<date>2017-09-10</date>` +
            `<duration>2</duration>` +
            '<rooms>' +
                '<room>' +
                    //<!-- The ages of the people that will be staying in the room -->
                    '<ages>' +
                    `<age>30</age>` +
                    `<age>30</age>` +
                    // `<age>1</age>` +
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
            // 'Cookies': jsonObj.ResolveLocationResponse.sid,
            'Accept-Encoding': 'gzip',
            'Host': 'api.travelfusion.com',
            'User-Agent': 'curl/7.19.7 (x86_64-pc-linux-gnu) libcurl/7.19.7 zlib/1.2.3'
        }
    };

    return proxy.searchHotelPromise(config.travelfusion.hotels.apiEndpoint, options2)
})

.then(function (res){

    console.log('------------------------------------------');
    console.log('1. Result from First GetHotelRequest');
    let jsonObj = JSON.parse(res.body);
    console.log(jsonObj);
    // console.log(jsonObj.GetHotelsResponse.sid);
    // console.log(jsonObj.GetHotelsResponse.resultInfo);
    // console.log(jsonObj.GetHotelsResponse.resultInfo.supplierResultInfo.supplier);
    // console.log(jsonObj.GetHotelsResponse.results);


// ---------------------------------
// Just make a 5 second delay
    return res;
})
.then(function (res){
    globalRes = res; // Save to global
    return proxy.delay(5000);
})

.then(function (){

    res = globalRes; // Get back from global

    let jsonObj = JSON.parse(res.body);

    const options3 = {
        body: `<GetHotelsRequest sid="${jsonObj.GetHotelsResponse.sid}" token="${config.travelfusion.hotels.token}" xmlns="http://www.travelfusion.com/xml/api/simple">` +
            '</GetHotelsRequest>',
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cookie': res.cookies,
            // 'Accept-Encoding': 'gzip',
        }
    };

// end of delay
// -----------------------------------

    console.log('------------------------------------------');
    console.log('2. Request Header and Body of Second GetHotelRequest');
    console.log(options3);
    return proxy.searchHotelPromise(config.travelfusion.hotels.apiEndpoint, options3)
})

.then(function (res) {
    console.log('------------------------------------------');
    console.log('3. Response of second GethotelRequest');
    // console.log(res);
    let jsonObj = JSON.parse(res.body);
    console.log(jsonObj);

    // console.log('==========================');
    // console.log('totalOffers', jsonObj.GetHotelsResponse.resultInfo);
    // console.log('==========================');

    console.log('totalOffers', jsonObj.GetHotelsResponse.results.hotel);

    let hotels = jsonObj.GetHotelsResponse.results.hotel;

    hotels.forEach(function (hotel) {

        console.log('***********************************');
        // console.log(hotel.code);
        // console.log(hotel.id);
        // console.log(hotel.hotelDetails.id);
        // console.log(hotel.hotelDetails.extraInfos);
        console.log(hotel.hotelDetails.address);
        // console.log(hotel.hotelDetails.addressDetails);
        console.log(hotel.hotelDetails.coordinate);
        console.log(hotel.hotelDetails.description);
        // console.log(hotel.hotelDetails.facilities);
        console.log(hotel.hotelDetails.hotelName);
        // console.log(hotel.hotelDetails.images);
        console.log(hotel.hotelDetails.priceInfo);
        console.log(hotel.hotelDetails.starRating);
        console.log(hotel.hotelDetails.thumbnail);

        console.log(hotel.offers.offer);

        for (let i=0; i < hotel.offers.offer.length ; i++) {
            console.log(hotel.offers.offer[i].id);
            console.log(hotel.offers.offer[i].price);
            console.log(hotel.offers.offer[i].billingPrice);
            console.log(hotel.offers.offer[i].supplier);
            console.log(hotel.offers.offer[i].roomtypes);
            console.log(hotel.offers.offer[i].extraInfos);
            console.log(hotel.offers.offer[i].rooms);

            for (let j=0; j < hotel.offers.offer[i].rooms.room.length; j++){
                console.log(hotel.offers.offer[i].rooms.room[j]);
            }

        }


        // if (hotel.offers) {
        //     if (hotel.offers.offer) {
        //         hotel.offers.offer.forEach(function (o){
        //             console.log(o.id);
        //             console.log(o.price);
        //             console.log(o.billingPrice);
        //             console.log(o.supplier);
        //             console.log(o.roomtypes);
        //             console.log(o.extraInfos);
        //             console.log(o.rooms);

        //         })
        //     }
        // }
    })

//     { code: '00000000014D430F',
//     id: '00000000014D430F',
//     hotelDetails:
//      { id: '00000000014D430F',
//        extraInfos: [Object],
//        address: '266 Neville Road, London, United Kingdom, E7 9QN',
//        addressDetails: [Object],
//        coordinate: [Object],
//        description: 'The Ne Ville is situated in the Newham district in London, 3.4 km from Olympic Stadium and 5 km from O2 Arena.Every room has
// a flat-screen TV. You will find a kettle in the room. For your comfort, you will find free toiletries and a hairdryer. The',
//        facilities: [Object],
//        hotelName: 'The Ne Ville',
//        images: [Object],
//        priceInfo: [Object],
//        starRating: '3',
//        thumbnail: 'http://images.travelfusion.com/?url=aHR0cDovL2FmZi5ic3RhdGljLmNvbS9pbWFnZXMvaG90ZWwvc3F1YXJlNjAvOTI1LzkyNTQ4Mzk2LmpwZw==' },
//     offers: { offer: [Array] } }


    // console.log('totalOffers', jsonObj.GetHotelsResponse.resultInfo.totalOffers);

    // console.log('completeConnections', jsonObj.GetHotelsResponse.resultInfo.completeConnections);

    // console.log('completeConnections', jsonObj.GetHotelsResponse.resultInfo.completeConnections);


    console.log(res.cookies);

})
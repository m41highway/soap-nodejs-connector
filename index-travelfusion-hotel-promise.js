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
    let jsonObj = JSON.parse(res);

    console.log(jsonObj.ResolveLocationResponse.locations);
})
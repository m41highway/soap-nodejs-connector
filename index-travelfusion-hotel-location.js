const httpreq = require('httpreq');
const config = require('./config.json');

httpreq.post(config.travelfusion.hotels.apiEndpoint, {
    headers: {
        'Content-Type': 'text/xml; charset=utf-8',
    },
    body: `<ResolveLocationRequest token="${config.travelfusion.hotels.token}" xmlns="http://www.travelfusion.com/xml/api/simple"><text>Lon</text><maxOptions>10</maxOptions><language>EN,FI</language><showSubLocations>true</showSubLocations></ResolveLocationRequest>`
}, function (err, res){
    if (err) {
        console.log(err);
    } else {
        console.log(res.body);
    }
})



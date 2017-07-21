var httpreq = require('httpreq');

let url = 'http://api.travelfusion.com/api-v2/';

httpreq.post(url, {
    headers: {
        'Content-Type': 'text/xml; charset=utf-8',
    },
    body: '<ResolveLocationRequest token="TvLwDF_pxUECUxcEXUaHDm06Mp7jIB6nTY3DqzeEJ6NG" xmlns="http://www.travelfusion.com/xml/api/simple"><text>Lon</text><maxOptions>10</maxOptions><language>EN,FI</language><showSubLocations>true</showSubLocations></ResolveLocationRequest>'
}, function (err, res){
    if (err) {
        console.log(err);
    } else {
        console.log(res.body);
    }
})


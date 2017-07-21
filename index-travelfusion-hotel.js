var httpreq = require('httpreq');

let url = 'http://api.travelfusion.com/api-v2/';

httpreq.post(url, {
//   body: '<?xml version="1.0" encoding="UTF-8"?><CommandList><Login><Username>travieapphotel</Username><Password>3azhnl</Password></Login></CommandList>',

  body: '<LoginRequest xmlns="http://www.travelfusion.com/xml/api/simple"><username>travieapphotel</username><password>3azhnl</password></LoginRequest>',

  headers:{
    'Content-Type': 'text/xml; charset=utf-8',
  }},function (err, res){
    if (err) {
        console.log(err);
    } else {
        console.log(res.body);


    }
})


/*

<?xml version="1.0" encoding='UTF-8'?>
    <LoginResponse xmlns="http://www.travelfusion.com/xml/api/simple" token="TvLwDF_pxUECUxcEXUaHDm06Mp7jIB
6nTY3DqzeEJ6NG"/>

*/
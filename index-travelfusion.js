var httpreq = require('httpreq');

httpreq.post('https://api.travelfusion.com',{
  body: '<?xml version="1.0" encoding="UTF-8"?><CommandList><Login><Username>travieapp</Username><Password>54av83ap0</Password></Login></CommandList>',
  headers:{
    'Content-Type': 'text/xml; charset=utf-8',
  }},
  function (err, res) {
    if (err){
      console.log(err);
    }else{
      console.log(res.body);
    }
  }
);

{/*<CommandList>
    <Login millis="0">
        <LoginId>2OJBM9GHGS97N0E5</LoginId>
    </Login>
    <GeneralInfoItemList>
        <GeneralInfoItem>
            <Name>ClientAddress</Name>
            <Value>210.0.232.132</Value>
        </GeneralInfoItem>
        <GeneralInfoItem>
            <Name>StartTime</Name>
            <Value>04/07/17-06:42:36</Value>
        </GeneralInfoItem>
        <GeneralInfoItem>
            <Name>EndTime</Name>
            <Value>04/07/17-06:42:36</Value>
        </GeneralInfoItem>
    </GeneralInfoItemList>
</CommandList>*/}
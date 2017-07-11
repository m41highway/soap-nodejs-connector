const proxy = require('./travelfusion-proxy');
const config = require('./config');


const options = {
        body: '<CommandList>' +
                '<GetHotelIdList>' +
                    `<XmlLoginId>${config.travelfusion.xmlLoginId}</XmlLoginId>` +
                    `<LoginId>${config.travelfusion.xmlLoginId}</LoginId>` +
                    `<IsTest>true</IsTest>` +
                '</GetHotelIdList>' +
        `</CommandList>`,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
        }
    }

proxy.getHotelListPromise(config.travelfusion.apiEndpoint, options)

.then(function (res) {
    let jsonObj = JSON.parse(res);

    console.log(jsonObj);

    console.log(jsonObj.CommandList.GeneralInfoItemList.GeneralInfoItem);
})

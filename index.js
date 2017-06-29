const soap = require('soap');
const config = require('./config.json');

const url = 'http://onepointdemo.myfarebox.com/V2/OnePoint.svc?wsdl';

soap.createClient(url, function(err, client) {

    // -----------------------------------------------
    // View all the methods
    // -----------------------------------------------
    console.log(client.describe());

    // -----------------------------------------------
    // View the specific method
    // -----------------------------------------------
    console.log(client.describe().OnePoint.BasicHttpBinding_IOnePoint.CreateSession);

    console.log(client.describe().OnePoint.BasicHttpBinding_IOnePoint.AirLowFareSearch);

    console.log(client.describe().OnePoint.BasicHttpBinding_IOnePoint.AirRevalidate);

    console.log(client.describe().OnePoint.BasicHttpBinding_IOnePoint.BookFlight);


    // client.CreateSession(config, function(err, result) {
    //     if (err) console.log(err);

    //     if (result.CreateSessionResult.Errors) {
    //         console.log('Error occurs from SOAP server');
    //         console.log(result.CreateSessionResult.Errors);
    //     }

    //     console.log('Success');
    //     console.log(result.CreateSessionResult);
    // });
});
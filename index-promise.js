const sessionManager = require('./session-manager');

let clientStub;

sessionManager.createClient


.then(function (client) {

    clientStub = client; // for later use

    return sessionManager.createSessionPromise(client)
})


.then((result) => {
    console.log('last...');
    console.log(result.CreateSessionResult.sessionId);

    let options = {
        rq: {
            SessionId: result.CreateSessionResult.sessionId
        }
    }

    return sessionManager.airLowFareSearchPromise(clientStub, options);
})
.then( (res) => {



    console.log('Calling fare search...');
    // console.log(res);

    if (!res.AirLowFareSearchResult) console.log('Fail to connect to API!');

    if(res.AirLowFareSearchResult.Errors) {
        console.log(res.AirLowFareSearchResult.Errors);
    }



})
.catch( (error) => {
    console.log(error);
});
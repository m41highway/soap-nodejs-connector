'use strict'

const Promise = require('bluebird');
const sessionManager = require('./session-manager');
const config = require('./config.json');

const search = function () {
    return Promise.coroutine(function *(){
        const client = yield sessionManager.createClient;

        const session = yield sessionManager.createSessionPromise(client);

        return session;
    })();
}

search()
.then((result) => {

    console.log('======================');
    console.log(result);
})

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

const https = require('https');

const snxHost = 'https://ec.synnex.com';

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            //await context.sendActivity(`You said '${ context.activity.text }'`);
            await this.queryVendorInfo(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome and!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async queryVendorInfo(context) {
        let vend_name = context.activity.text;
        console.log('--------------search vend_name:' + vend_name);

        const url = encodeURI('https://ec.synnex.com/gateway/p1-service?app_code=vendor-service&invoke_method=/api/vendor/vendorNamePattern/{patternName}/headers&paths={\"patternName\":\"' + 'abc' + '\"}\"');
        console.log('--------------search Path:' + url);
        await context.sendActivity(`You said '${url}'`);

        let finalresult = '';
        await context.sendActivity(`Result '${finalresult}'`);

        try {
            finalresult = await requestRemoteByGetUser(url, 'ethanh');
        } catch (err) {
            finalresult = err;
        }

        await context.sendActivity(`Result '${finalresult}'`);
    }
}

async function requestRemoteByGetUser(url, user) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 300) {
                    reject("Error, status code = " + xhr.status)
                } else {
                    resolve(xhr.responseText);
                }
            }
        }
        xhr.open('get', url, true)
        xhr.send();
    });
}

module.exports.EchoBot = EchoBot;

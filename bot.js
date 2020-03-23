// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { http } = require('http');

const { querystring } = require('querystring');
const { host } = 'image.synnex-china.com';

const { snxDomain } = 'mycis.synnex.org';

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

        let url = encodeURI('/gateway/p1-service?app_code=vendor-service&invoke_method=/api/vendor/vendorNamePattern/{patternName}/headers&paths={\"patternName\":\"' + 'abc' + '\"}\"');
        console.log('--------------search Path:' + url);
        await context.sendActivity(`You said '${url}'`);

        let result = '';
        await context.sendActivity(`Result '${result}'`);

        const https = require('https');
        await context.sendActivity(`https '${https}'`);

        const snxHost = 'https://ec.synnex.com';
        const options = {
            hostname: snxHost,
            port: 443,
            path: url,
            method: 'GET'
        };
        const request = https.get(options, res => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', data => {
                body += data;
                await context.sendActivity(`Body '${body}'`);
            });
            res.on('end', () => {
                //resolve(body);   
                result += body;
                await context.sendActivity(`Body '${body}'`);
            });
            await context.sendActivity(`Body '${body}'`);
        });

        request.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            result += e.message;
        });

        request.end();

        await context.sendActivity(`Result '${result}'`);
    }
}

module.exports.EchoBot = EchoBot;
